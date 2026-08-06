import { Loader2 } from 'lucide-react';

export type SpinnerSize =
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl'
  | '8xl'
  | '9xl';

const sizeMap: Record<SpinnerSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-5 w-5',
  lg: 'h-8 w-8',
  xl: 'h-10 w-10',
  '2xl': 'h-12 w-12',
  '3xl': 'h-16 w-16',
  '4xl': 'h-20 w-20',
  '5xl': 'h-24 w-24',
  '6xl': 'h-28 w-28',
  '7xl': 'h-32 w-32',
  '8xl': 'h-36 w-36',
  '9xl': 'h-40 w-40',
};

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <Loader2
      className={`animate-spin text-(--meta-text) ${sizeMap[size]} ${className ?? ''}`}
    />
  );
}
