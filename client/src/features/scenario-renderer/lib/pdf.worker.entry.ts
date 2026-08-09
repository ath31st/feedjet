/**
 * Vite entry for the pdf.js worker. Polyfills APIs that SaluteTV / some
 * Android WebViews lack (despite reporting a modern Chrome UA), then loads
 * the real worker.
 */
import { installPdfRuntimeCompat } from './pdfCompat';

installPdfRuntimeCompat();

import 'pdfjs-dist/build/pdf.worker.min.mjs';
