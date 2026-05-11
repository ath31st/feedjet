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
      className={`flex w-full justify-center border-(--border) border-b-2 ${className || ''}`.trim()}
    >
      {tabs.map((tab) => (
        <button
          type="button"
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`relative -mb-px h-10 w-35 cursor-pointer px-4 text-md transition-colors ${
            value === tab.value
              ? 'border-(--border) border-b-6'
              : 'hover:bg-(--button-hover-bg)'
          }
          `
            .trim()
            .replace(/\s+/g, ' ')}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
