import { useEffect, useEffectEvent, useRef, useState } from 'react';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import { buildPdfUrl } from '@/entities/pdf';
import { getDocument } from '../lib/pdfjs';
import { renderPdfPageToObjectUrl } from '../lib/renderPdfPageToObjectUrl';

interface UsePdfItemPlaybackParams {
  fileName: string;
  durationSeconds: number | null;
  onEnd: () => void;
  isPaused?: boolean;
}

export function usePdfItemPlayback({
  fileName,
  durationSeconds,
  onEnd,
  isPaused = false,
}: UsePdfItemPlaybackParams) {
  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const endedRef = useRef(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageSrc, setPageSrc] = useState<string | null>(null);

  const handleEnd = useEffectEvent(() => {
    if (endedRef.current) return;
    endedRef.current = true;
    onEnd();
  });

  useEffect(() => {
    endedRef.current = false;
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
      const result = await renderPdfPageToObjectUrl(doc, pageNumber, {
        isCancelled: () => cancelled,
        setRenderTask: (task) => {
          renderTaskRef.current?.cancel();
          renderTaskRef.current = task;
        },
      });

      if (cancelled) return;
      if (!result.ok) {
        if (result.reason === 'cancelled') return;
        handleEnd();
        return;
      }

      setPageSrc((prev) => {
        if (prev) {
          window.setTimeout(() => URL.revokeObjectURL(prev), 700);
        }
        return result.objectUrl;
      });
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

  return {
    pageNumber,
    pageSrc,
    onPageImageError: handleEnd,
  };
}
