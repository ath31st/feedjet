import * as SwitchPrimitive from '@radix-ui/react-switch';
import { TooltipWrapper } from '../TooltipWrapper';

interface CommonSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  tooltip?: string;
}

export function CommonSwitch({
  checked,
  onCheckedChange,
  disabled = false,
  tooltip,
}: CommonSwitchProps) {
  const switchEl = (
    <SwitchPrimitive.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className="relative h-5 w-10 shrink-0 cursor-pointer rounded-full border border-(--border) transition-colors disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-(--button-bg)"
    >
      <SwitchPrimitive.Thumb className="block h-4 w-4 translate-x-px rounded-full bg-(--text) transition-transform data-[state=checked]:translate-x-5.25" />
    </SwitchPrimitive.Root>
  );

  if (!tooltip) return switchEl;

  return <TooltipWrapper tooltip={tooltip}>{switchEl}</TooltipWrapper>;
}
