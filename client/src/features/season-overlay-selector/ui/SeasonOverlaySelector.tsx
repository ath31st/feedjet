import {
  seasonOverlayLabels,
  seasonOverlayModes,
  type SeasonOverlayMode,
} from '@/entities/ui-config';
import { useSeasonOverlaySelector } from '../model/useSeasonOverlaySelector';
import { AppearanceButton } from '@/shared/ui';

interface Props {
  kioskId: number;
}

export function SeasonOverlaySelector({ kioskId }: Props) {
  const { seasonOverlay, handleChange, isLoading } =
    useSeasonOverlaySelector(kioskId);

  return (
    <div className="grid grid-cols-3 gap-2">
      {seasonOverlayModes.map((value: SeasonOverlayMode) => {
        const isActive = value === seasonOverlay;

        return (
          <AppearanceButton
            key={value}
            value={value}
            isActive={isActive}
            disabled={isLoading}
            onClick={() => handleChange(value)}
            label={seasonOverlayLabels[value]}
          />
        );
      })}
    </div>
  );
}
