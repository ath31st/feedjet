import { octetInputParser } from '@trpc/server/http';
import { Readable } from 'node:stream';
import { fileStorageService, t } from '../../container.js';
import { protectedProcedure } from '../../middleware/auth.js';

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
    .input(octetInputParser)
    .mutation(async ({ input, ctx }) => {
      const fileName = ctx.req.headers['x-file-name'] as string;
      if (!fileName) {
        throw new Error('Missing file name header');
      }

      const nodeStream = webReadableToNode(input);
      const savedPath = await fileStorageService.saveStream(
        nodeStream,
        fileName,
      );

      return { ok: true, path: savedPath };
    }),

  listFiles: protectedProcedure.query(async () => {
    const files = await fileStorageService.listFiles();
    return files;
  }),
});
