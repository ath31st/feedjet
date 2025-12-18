import type React from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  maxLength?: number;
  currentLength?: number;
  children: React.ReactNode;
  disabled?: boolean;
}

export function FormField({
  id,
  label,
  hint,
  required,
  maxLength,
  currentLength,
  children,
  disabled,
}: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className={`block font-medium text-sm ${disabled ? 'text-(--meta-text)' : ''}`}
      >
        {label} {required && '*'}
      </label>

      {children}

      <div className="mt-1 flex justify-between">
        {hint && <div className="text-(--meta-text) text-xs">{hint}</div>}
        {maxLength !== undefined && currentLength !== undefined && (
          <div className="ml-auto text-(--meta-text) text-xs">
            {currentLength}/{maxLength} символов
          </div>
        )}
      </div>
    </div>
  );
}

export const sharedInputStyles =
  'w-full rounded-lg border px-2 py-1 text-sm transition-all ' +
  'border-(--border) focus:outline-none focus:ring-(--border) focus:ring-1 ' +
  'disabled:border-(--border-disabled) disabled:bg-transparent';
