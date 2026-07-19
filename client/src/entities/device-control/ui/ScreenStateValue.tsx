import type { ScreenState } from '@shared/types/screen.state';

const LABELS: Record<ScreenState, string> = {
  on: 'Вкл',
  off: 'Выкл',
  unreachable: 'Не отвечает',
};

const COLORS: Record<ScreenState, string> = {
  on: 'text-green-500',
  off: 'text-(--meta-text)',
  unreachable: 'text-orange-500',
};

interface ScreenStateValueProps {
  state?: ScreenState;
}

export function ScreenStateValue({ state }: ScreenStateValueProps) {
  if (!state) {
    return <span className="text-(--meta-text)">…</span>;
  }

  return <span className={COLORS[state]}>{LABELS[state]}</span>;
}
