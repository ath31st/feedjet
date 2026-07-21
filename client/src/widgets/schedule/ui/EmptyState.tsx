export function EmptyState({
  message,
  isEffectiveXl,
}: {
  message: string;
  isEffectiveXl: boolean;
}) {
  return (
    <div
      className={`flex min-h-0 flex-1 items-center justify-center text-center text-(--meta-text) leading-snug ${
        isEffectiveXl ? 'text-3xl' : 'text-2xl'
      }`}
    >
      {message}
    </div>
  );
}
