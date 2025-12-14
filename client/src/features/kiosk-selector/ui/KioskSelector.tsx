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
    <div className="relative flex flex-col">
      <div className="-top-6 absolute bottom-0 left-50 w-[2px] bg-(--border)" />

      {kiosks.map((k) => {
        const isActive = k.slug === activeKiosk?.slug;
        return (
          <button
            key={k.slug}
            type="button"
            onClick={() => onChange(k)}
            className={`relative w-50 cursor-pointer px-6 py-2 font-medium text-md outline-none transition-colors hover:text-(--button-hover-bg) hover:text-var(--border) ${
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
                    'linear-gradient(to left, color-mix(in srgb, var(--border) 30%, transparent) 40%, transparent 100%)',
                }}
              />
            )}
            <span
              title={k.name}
              className="relative block overflow-hidden text-ellipsis"
            >
              {k.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
