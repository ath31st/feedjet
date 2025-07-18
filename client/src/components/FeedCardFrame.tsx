export function FeedCardFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="shadow-2xl box-border flex h-full 4k:rounded-4xl rounded-xl 4k:border-4 border-2 4k:p-4 p-2"
      style={{
        borderColor: 'var(--border)',
        backgroundColor: 'var(--card-bg)',
      }}
    >
      {children}
    </div>
  );
}
