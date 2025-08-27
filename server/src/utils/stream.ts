import { Readable } from 'node:stream';

export function webReadableToNode(
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
