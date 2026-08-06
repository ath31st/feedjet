import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import { buildPdfUrl } from '@/entities/pdf';
import { getDocument } from '../lib/pdfjs';

interface Props {
  fileName: string;
  durationSeconds: number | null;
  onEnd: () => void;
  isPaused?: boolean;
}

const pageMotion = {
  initial: { opacity: 0, scale: 1.04, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.97, y: -10 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

const log = (stage: string, details?: Record<string, unknown>) => {
  console.info(`[feedjet:pdf] ${stage}`, {
    t: Date.now(),
    ...details,
  });
};

const logError = (
  stage: string,
  error: unknown,
  details?: Record<string, unknown>,
) => {
  console.error(`[feedjet:pdf] ${stage}`, {
    t: Date.now(),
    error,
    message: error instanceof Error ? error.message : String(error),
    ...details,
  });
};

export const PdfItemView = ({
  fileName,
  durationSeconds,
  onEnd,
  isPaused = false,
}: Props) => {
  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const endedRef = useRef(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageSrc, setPageSrc] = useState<string | null>(null);

  const handleEnd = useEffectEvent((reason: string) => {
    if (endedRef.current) {
      log('onEnd skipped (already ended)', { reason, fileName });
      return;
    }
    endedRef.current = true;
    log('onEnd', { reason, fileName, pageNumber, pageCount });
    onEnd();
  });

  useEffect(() => {
    endedRef.current = false;
    const url = buildPdfUrl(fileName);
    let cancelled = false;

    log('mount/load start', {
      fileName,
      url,
      durationSeconds,
      viewport: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
      },
    });

    const load = async () => {
      const startedAt = Date.now();
      try {
        const loadingTask = getDocument(url);
        log('getDocument created', { fileName, url });

        const doc = await loadingTask.promise;
        log('getDocument resolved', {
          fileName,
          numPages: doc.numPages,
          ms: Date.now() - startedAt,
        });

        if (cancelled) {
          log('getDocument ignored (cancelled)', { fileName });
          await doc.destroy();
          return;
        }

        pdfDocRef.current = doc;
        setPageCount(doc.numPages);
        setPageNumber(1);
      } catch (error) {
        logError('getDocument failed', error, {
          fileName,
          url,
          ms: Date.now() - startedAt,
        });
        if (!cancelled) {
          handleEnd('getDocument-error');
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
      log('unmount/cleanup', { fileName });
      renderTaskRef.current?.cancel();
      renderTaskRef.current = null;
      const doc = pdfDocRef.current;
      pdfDocRef.current = null;
      void doc?.destroy();
      setPageSrc((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, [fileName]);

  useEffect(() => {
    const doc = pdfDocRef.current;
    if (!doc || pageCount === 0) {
      log('draw skipped (no doc/pageCount)', {
        fileName,
        hasDoc: Boolean(doc),
        pageCount,
        pageNumber,
      });
      return;
    }

    let cancelled = false;
    const startedAt = Date.now();

    const draw = async () => {
      log('draw start', { fileName, pageNumber, pageCount });

      try {
        const page = await doc.getPage(pageNumber);
        if (cancelled) {
          log('draw cancelled after getPage', { fileName, pageNumber });
          return;
        }

        const baseViewport = page.getViewport({ scale: 1 });
        const pixelRatio = window.devicePixelRatio || 1;
        const fitScale = Math.min(
          (window.innerWidth * pixelRatio) / baseViewport.width,
          (window.innerHeight * pixelRatio) / baseViewport.height,
        );
        const viewport = page.getViewport({ scale: fitScale });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        log('canvas ready', {
          fileName,
          pageNumber,
          base: { w: baseViewport.width, h: baseViewport.height },
          pixelRatio,
          fitScale,
          canvas: { w: canvas.width, h: canvas.height },
          hasContext: Boolean(context),
        });

        if (!context) {
          logError(
            'canvas 2d context null',
            new Error('getContext(2d) returned null'),
            {
              fileName,
              pageNumber,
            },
          );
          handleEnd('canvas-context-null');
          return;
        }

        renderTaskRef.current?.cancel();
        const task = page.render({
          canvasContext: context,
          viewport,
          canvas,
        });
        renderTaskRef.current = task;

        await task.promise;
        if (cancelled) {
          log('draw cancelled after render', { fileName, pageNumber });
          return;
        }

        log('render done, toBlob…', {
          fileName,
          pageNumber,
          ms: Date.now() - startedAt,
        });

        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, 'image/png');
        });

        if (cancelled) {
          log('draw cancelled after toBlob', { fileName, pageNumber });
          return;
        }

        if (!blob) {
          logError('toBlob returned null', new Error('canvas.toBlob null'), {
            fileName,
            pageNumber,
            canvas: { w: canvas.width, h: canvas.height },
          });
          handleEnd('toBlob-null');
          return;
        }

        const nextSrc = URL.createObjectURL(blob);
        log('pageSrc set', {
          fileName,
          pageNumber,
          blobSize: blob.size,
          blobType: blob.type,
          pageSrcPrefix: nextSrc.slice(0, 64),
          ms: Date.now() - startedAt,
        });

        setPageSrc((prev) => {
          if (prev) {
            window.setTimeout(() => URL.revokeObjectURL(prev), 700);
          }
          return nextSrc;
        });
      } catch (error) {
        const name =
          error && typeof error === 'object' && 'name' in error
            ? String((error as { name?: string }).name)
            : '';
        if (name === 'RenderingCancelledException' || cancelled) {
          log('draw cancelled (exception)', { fileName, pageNumber, name });
          return;
        }
        logError('draw failed', error, { fileName, pageNumber });
        handleEnd('draw-error');
      }
    };

    void draw();

    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
      renderTaskRef.current = null;
    };
  }, [pageNumber, pageCount, fileName]);

  useEffect(() => {
    if (pageCount === 0 || !pageSrc || isPaused) {
      log('page timer idle', {
        fileName,
        pageNumber,
        pageCount,
        hasPageSrc: Boolean(pageSrc),
        isPaused,
      });
      return;
    }

    const seconds = Math.max(1, durationSeconds ?? 10);
    log('page timer start', { fileName, pageNumber, pageCount, seconds });

    const timeoutId = window.setTimeout(() => {
      if (pageNumber >= pageCount) {
        handleEnd('last-page-elapsed');
        return;
      }
      log('advance page', { fileName, from: pageNumber, to: pageNumber + 1 });
      setPageNumber((prev) => prev + 1);
    }, seconds * 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [pageNumber, pageCount, pageSrc, durationSeconds, isPaused, fileName]);

  return (
    <div className="fixed inset-0 z-50">
      <AnimatePresence mode="wait">
        {pageSrc ? (
          <motion.img
            key={pageNumber}
            src={pageSrc}
            alt=""
            className="absolute inset-0 z-10 h-full w-full object-contain"
            initial={pageMotion.initial}
            animate={pageMotion.animate}
            exit={pageMotion.exit}
            transition={pageMotion.transition}
            style={{ willChange: 'opacity, transform' }}
            onLoad={() => {
              log('img onLoad', {
                fileName,
                pageNumber,
                pageSrcPrefix: pageSrc.slice(0, 64),
              });
            }}
            onError={(event) => {
              logError('img onError', new Error('page image failed to load'), {
                fileName,
                pageNumber,
                pageSrcPrefix: pageSrc.slice(0, 64),
                eventType: event.type,
              });
              handleEnd('img-error');
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
};
