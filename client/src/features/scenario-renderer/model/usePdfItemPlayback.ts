import { useEffect, useEffectEvent, useRef, useState } from 'react';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import { buildPdfUrl } from '@/entities/pdf';
import {
  destroyPdfDocument,
  loadPdfDocument,
} from '../lib/loadPdfDocument';
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
  const pageNumberRef = useRef(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pageSrc, setPageSrc] = useState<string | null>(null);

  pageNumberRef.current = pageNumber;

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
        const doc = await loadPdfDocument(buildPdfUrl(fileName)).promise;
        if (cancelled) {
          destroyPdfDocument(doc);
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
      destroyPdfDocument(doc);
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

  // Start duration only when a page image is ready — not when pageNumber alone changes
  // (otherwise the timer runs against the previous page's blob and resets mid-flight).
  useEffect(() => {
    if (pageCount === 0 || !pageSrc || isPaused) return;

    const seconds = Math.max(1, durationSeconds ?? 10);
    const timeoutId = window.setTimeout(() => {
      if (pageNumberRef.current >= pageCount) {
        handleEnd();
        return;
      }
      setPageNumber((prev) => prev + 1);
    }, seconds * 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [pageSrc, pageCount, durationSeconds, isPaused]);

  return {
    pageSrc,
    onPageImageError: handleEnd,
  };
}
