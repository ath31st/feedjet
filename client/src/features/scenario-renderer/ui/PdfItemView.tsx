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

export const PdfItemView = ({
  fileName,
  durationSeconds,
  onEnd,
  isPaused = false,
}: Props) => {
  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageSrc, setPageSrc] = useState<string | null>(null);

  const handleEnd = useEffectEvent(() => {
    onEnd();
  });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const doc = await getDocument(buildPdfUrl(fileName)).promise;
        if (cancelled) {
          await doc.destroy();
          return;
        }
        pdfDocRef.current = doc;
        setPageCount(doc.numPages);
        setPageNumber(1);
      } catch {
        if (!cancelled) {
          handleEnd();
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
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
    if (!doc || pageCount === 0) return;

    let cancelled = false;

    const draw = async () => {
      try {
        const page = await doc.getPage(pageNumber);
        if (cancelled) return;

        const baseViewport = page.getViewport({ scale: 1 });
        const pixelRatio = window.devicePixelRatio || 1;
        const fitScale = Math.min(
          (window.innerWidth * pixelRatio) / baseViewport.width,
          (window.innerHeight * pixelRatio) / baseViewport.height,
        );
        const viewport = page.getViewport({ scale: fitScale });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        renderTaskRef.current?.cancel();
        const task = page.render({
          canvasContext: context,
          viewport,
          canvas,
        });
        renderTaskRef.current = task;
        await task.promise;
        if (cancelled) return;

        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, 'image/png');
        });
        if (cancelled || !blob) return;

        const nextSrc = URL.createObjectURL(blob);
        setPageSrc((prev) => {
          if (prev) {
            window.setTimeout(() => URL.revokeObjectURL(prev), 700);
          }
          return nextSrc;
        });
      } catch {
        // cancelled render or transient error — ignore
      }
    };

    void draw();

    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
      renderTaskRef.current = null;
    };
  }, [pageNumber, pageCount]);

  useEffect(() => {
    if (pageCount === 0 || !pageSrc || isPaused) return;

    const seconds = Math.max(1, durationSeconds ?? 10);
    const timeoutId = window.setTimeout(() => {
      if (pageNumber >= pageCount) {
        handleEnd();
        return;
      }
      setPageNumber((prev) => prev + 1);
    }, seconds * 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [pageNumber, pageCount, pageSrc, durationSeconds, isPaused]);

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
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
};
