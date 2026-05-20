import { screenRotations } from '@/entities/ui-config';
import { useScreenRotationSelector } from '../model/useScreenRotationSelector';
import { AppearanceButton } from '@/shared/ui';

interface Props {
  kioskId: number;
}

export function ScreenRotationSelector({ kioskId }: Props) {
  const { screenRotation, handleChange, isLoading, formatLabel } =
    useScreenRotationSelector(kioskId);

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-5 gap-2">
        {screenRotations.map((value) => {
          const isActive = value === screenRotation;

          return (
            <AppearanceButton
              key={value}
              value={value}
              isActive={isActive}
              disabled={isLoading}
              onClick={() => handleChange(value)}
              label={formatLabel(value)}
            />
          );
        })}
      </div>
    </div>
  );
}
