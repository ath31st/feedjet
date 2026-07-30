import { useCallback, useState, type DragEvent } from 'react';

function hasFilePayload(e: DragEvent): boolean {
  return Array.from(e.dataTransfer.types).includes('Files');
}

export function useFileDropZone(onDrop: (files: File[]) => void) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: DragEvent) => {
    if (!hasFilePayload(e)) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    if (!hasFilePayload(e)) return;
    e.preventDefault();
    e.stopPropagation();

    const next = e.relatedTarget;
    if (next instanceof Node && e.currentTarget.contains(next)) return;

    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      if (!hasFilePayload(e)) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) onDrop(files);
    },
    [onDrop],
  );

  return {
    isDragOver,
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
  };
}
