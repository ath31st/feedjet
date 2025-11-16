import { forwardRef } from 'react';

interface HiddenFileInputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const HiddenFileInput = forwardRef<
  HTMLInputElement,
  HiddenFileInputProps
>(({ onChange }, ref) => (
  <input
    type="file"
    accept="image/*"
    ref={ref}
    data-month=""
    className="hidden"
    onChange={onChange}
  />
));
