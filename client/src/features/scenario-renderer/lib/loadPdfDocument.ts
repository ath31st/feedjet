import type { PDFDocumentLoadingTask, PDFDocumentProxy } from 'pdfjs-dist';
import { getDocument } from './pdfjs';

export const loadPdfDocument = (url: string): PDFDocumentLoadingTask =>
  getDocument({ url, verbosity: 0 });

export const destroyPdfDocument = (doc: PDFDocumentProxy | null) => {
  if (!doc) return;
  void doc.loadingTask.destroy();
};
