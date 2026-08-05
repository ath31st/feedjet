import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

GlobalWorkerOptions.workerSrc = pdfWorker;

console.info('[feedjet:pdf] worker configured', {
  workerSrc: pdfWorker,
  userAgent: navigator.userAgent,
});

export { getDocument };
