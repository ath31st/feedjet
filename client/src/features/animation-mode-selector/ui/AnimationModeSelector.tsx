import {
  animationTypes,
  animationLabels,
  type AnimationType,
} from '@/entities/ui-config';
import { useAnimationModeSelector } from '../model/useAnimationModeSelector';
import { AppearanceButton } from '@/shared/ui';

interface Props {
  kioskId: number;
}

export function AnimationModeSelector({ kioskId }: Props) {
  const { animationMode, handleChange, isLoading } =
    useAnimationModeSelector(kioskId);

  return (
    <div className="grid grid-cols-2 gap-2">
      {animationTypes.map((value: AnimationType) => {
        const isActive = value === animationMode;
        return (
          <AppearanceButton
            key={value}
            value={value}
            isActive={isActive}
            disabled={isLoading}
            onClick={() => handleChange(value)}
            label={animationLabels[value]}
          />
        );
      })}
    </div>
  );
}
