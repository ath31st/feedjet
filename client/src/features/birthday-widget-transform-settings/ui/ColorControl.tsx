interface ColorControlProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

export function ColorControl({ label, value, onChange }: ColorControlProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-(--meta-text) text-xs">
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-6 w-full cursor-pointer rounded border border-(--border)"
      />
    </div>
  );
}
