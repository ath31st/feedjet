interface ColorControlProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

export function ColorControl({ label, value, onChange }: ColorControlProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="color" className="text-(--meta-text) text-sm">
        {label}
      </label>

      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-6 w-full cursor-pointer rounded border border-(--border)"
        />

        <span className="text-(--meta-text) text-xs">{value}</span>
      </div>
    </div>
  );
}
