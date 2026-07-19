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
      className="relative flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-(--border) bg-(--background-secondary) p-0.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-(--button-bg) focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-(--button-bg) data-[state=checked]:bg-(--button-bg)"
    >
      <SwitchPrimitive.Thumb className="block size-4 rounded-full bg-(--text) shadow-sm transition-transform duration-200 ease-out data-[state=checked]:translate-x-5" />
    </SwitchPrimitive.Root>
  );

  return tooltip ? (
    <TooltipWrapper tooltip={tooltip}>{switchEl}</TooltipWrapper>
  ) : (
    switchEl
  );
}
