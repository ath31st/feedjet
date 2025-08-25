import { Readable } from 'node:stream';
import { fileStorageService, t } from '../../container.js';
import { protectedProcedure } from '../../middleware/auth.js';
import {
  fileDeleteParamsSchema,
  fileParamsSchema,
} from '../../validations/schemas/file.storage.validation.js';

function webReadableToNode(
  readable: ReadableStream<Uint8Array>,
): NodeJS.ReadableStream {
  const reader = readable.getReader();
  const nodeStream = new Readable({
    read() {
      reader
        .read()
        .then(({ done, value }) => {
          if (done) {
            this.push(null);
          } else {
            this.push(Buffer.from(value));
          }
        })
        .catch((err) => this.destroy(err));
    },
  });
  return nodeStream;
}

export const fileStorageRouter = t.router({
  uploadFile: protectedProcedure
    .input(fileParamsSchema)
    .mutation(async ({ input }) => {
      const file = input.get('file') as File;
      const filename = input.get('filename') as string;
      const nodeStream = webReadableToNode(file.stream());

      const savedPath = await fileStorageService.saveStream(
        nodeStream,
        filename,
      );

      return { ok: true, path: savedPath };
    }),

  listFiles: protectedProcedure.query(async () => {
    const files = await fileStorageService.listFiles();
    return files;
  }),

  deleteFile: protectedProcedure
    .input(fileDeleteParamsSchema)
    .mutation(async ({ input }) => {
      await fileStorageService.remove(input.filename);
      return { ok: true };
    }),
});
