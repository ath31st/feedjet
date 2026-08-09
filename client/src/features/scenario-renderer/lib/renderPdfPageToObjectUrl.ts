import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';

export type RenderPdfPageResult =
  | { ok: true; objectUrl: string }
  | { ok: false; reason: 'cancelled' | 'no-context' | 'toBlob-null' | 'error' };

const isRenderCancelledError = (error: unknown) =>
  Boolean(
    error &&
      typeof error === 'object' &&
      'name' in error &&
      String((error as { name?: string }).name) ===
        'RenderingCancelledException',
  );

/** Fit page to viewport; DPR capped at 1 for TV WebView memory/toBlob cost. */
export async function renderPdfPageToObjectUrl(
  doc: PDFDocumentProxy,
  pageNumber: number,
  {
    isCancelled,
    setRenderTask,
  }: {
    isCancelled: () => boolean;
    setRenderTask: (task: RenderTask | null) => void;
  },
): Promise<RenderPdfPageResult> {
  try {
    const page = await doc.getPage(pageNumber);
    if (isCancelled()) return { ok: false, reason: 'cancelled' };

    const baseViewport = page.getViewport({ scale: 1 });
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1);
    const fitScale = Math.min(
      (window.innerWidth * pixelRatio) / baseViewport.width,
      (window.innerHeight * pixelRatio) / baseViewport.height,
    );
    const viewport = page.getViewport({ scale: fitScale });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return { ok: false, reason: 'no-context' };

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    const task = page.render({
      canvasContext: context,
      viewport,
      canvas,
    });
    setRenderTask(task);
    await task.promise;
    if (isCancelled()) return { ok: false, reason: 'cancelled' };

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png');
    });
    if (isCancelled()) return { ok: false, reason: 'cancelled' };
    if (!blob) return { ok: false, reason: 'toBlob-null' };

    return { ok: true, objectUrl: URL.createObjectURL(blob) };
  } catch (error) {
    if (isRenderCancelledError(error) || isCancelled()) {
      return { ok: false, reason: 'cancelled' };
    }
    return { ok: false, reason: 'error' };
  }
}
