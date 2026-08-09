import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import { installPdfRuntimeCompat } from './pdfCompat';
import pdfWorker from './pdf.worker.entry.ts?worker&url';

installPdfRuntimeCompat();

GlobalWorkerOptions.workerSrc = pdfWorker;

export { getDocument };
