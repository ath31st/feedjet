interface TabItem {
  value: string;
  label: string;
}

interface ContentTabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ContentTabs({
  tabs,
  value,
  onChange,
  className,
}: ContentTabsProps) {
  return (
    <div
      className={`flex w-full items-center justify-center border-(--border) border-b-4 ${className || ''}`.trim()}
    >
      {tabs.map((tab) => {
        const isActive = value === tab.value;

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`relative -mb-px h-10 w-38 cursor-pointer px-6 font-medium text-md outline-none transition-colors ${
              isActive
                ? 'text-(--text) hover:text-(--text)'
                : 'text-muted-foreground hover:text-(--border)'
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
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
