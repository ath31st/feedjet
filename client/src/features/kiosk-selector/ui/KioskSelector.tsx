import type { Kiosk } from '@/entities/kiosk';

interface KioskSelectorProps {
  kiosks: Kiosk[];
  activeKiosk: Kiosk | null;
  onChange: (kiosk: Kiosk) => void;
}

export function KioskSelector({
  kiosks,
  activeKiosk,
  onChange,
}: KioskSelectorProps) {
  return (
    <div className="flex border-transparent border-b">
      {kiosks.map((k) => {
        const isActive = k.slug === activeKiosk?.slug;
        return (
          <button
            key={k.slug}
            type="button"
            onClick={() => onChange(k)}
            className={`relative w-38 px-6 py-2 font-medium text-md outline-none transition-colors hover:text-[color:var(--border)] ${
              isActive
                ? 'text-[color:var(--text)] hover:text-[color:var(--text)]'
                : 'text-muted-foreground'
            }`}
          >
            {isActive && (
              <span
                className="pointer-events-none absolute top-0 right-0 left-0 h-full"
                style={{
                  background:
                    'linear-gradient(to bottom, color-mix(in srgb, var(--border) 20%, transparent) 0%, transparent 80%)',
                }}
              />
            )}
            <span className="relative z-10">{k.name}</span>
          </button>
        );
      })}
    </div>
  );
}
