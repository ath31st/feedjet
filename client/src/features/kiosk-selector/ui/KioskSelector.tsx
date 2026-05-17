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
    <div className="scrollbar-hide relative flex flex-row flex-wrap gap-2 overflow-x-auto">
      {kiosks.map((k) => {
        const isActive = k.slug === activeKiosk?.slug;
        return (
          <button
            key={k.slug}
            type="button"
            onClick={() => onChange(k)}
            className={`relative cursor-pointer px-4 py-2 font-medium text-md outline-none transition-colors hover:text-(--button-hover-bg) ${
              isActive
                ? 'text-(--text) hover:text-(--text)'
                : 'text-muted-foreground'
            }`}
          >
            {isActive && (
              <span
                className="pointer-events-none absolute top-0 right-0 left-0 h-full"
                style={{
                  background:
                    'linear-gradient(to top, color-mix(in srgb, var(--border) 30%, transparent) 40%, transparent 100%)',
                }}
              />
            )}
            <span
              title={k.name}
              className="relative block overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {k.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
