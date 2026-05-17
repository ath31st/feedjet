import type { PreviewDescription } from '..';

export function Description({
  name,
  format,
  resolution,
  size,
  duration,
}: PreviewDescription) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-1 rounded-lg bg-(--card-bg)/70 px-5 py-3 text-sm backdrop-blur">
      {name && <span className="font-semibold">{name}</span>}
      {format && <span className="text-(--meta-text)">{format}</span>}
      {resolution && (
        <span className="font-mono text-(--meta-text)">{resolution}</span>
      )}
      {size && <span className="text-(--meta-text)">{size}</span>}
      {duration && <span className="text-(--meta-text)">{duration}</span>}
    </div>
  );
}
