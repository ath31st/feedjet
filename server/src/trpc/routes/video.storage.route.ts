import { Readable } from 'node:stream';
import { videoStorageService, t } from '../../container.js';
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

export const videoStorageRouter = t.router({
  uploadFile: protectedProcedure
    .input(fileParamsSchema)
    .mutation(async ({ input }) => {
      const file = input.get('file') as File;
      const filename = input.get('filename') as string;
      const nodeStream = webReadableToNode(file.stream());

      const savedPath = await videoStorageService.saveStream(
        nodeStream,
        filename,
      );

      return { ok: true, path: savedPath };
    }),

  listFiles: protectedProcedure.query(async () => {
    const files = await videoStorageService.listVideosWithMetadata();
    return files;
  }),

  deleteFile: protectedProcedure
    .input(fileDeleteParamsSchema)
    .mutation(async ({ input }) => {
      await videoStorageService.remove(input.filename);
      return { ok: true };
    }),
});
