import * as Switch from '@radix-ui/react-switch';
import {
  widgetTypes,
  widgetLabels,
  type WidgetType,
} from '@shared/types/ui.config';
import { useWidgetSelector } from '../model/useWidgetSelector';
import { Calendar, Video, Image, Newspaper, Gift, Info } from 'lucide-react';

interface WidgetSelectorProps {
  kioskId: number;
}

export function WidgetSelector({ kioskId }: WidgetSelectorProps) {
  const { rotatingWidgets, handleWidgetChange } = useWidgetSelector(kioskId);

  if (!widgetTypes.length) return <p>Нет доступных виджетов</p>;

  const renderIcon = (type: WidgetType, isActive: boolean) => {
    const colorClass = isActive ? 'text-(--text)' : 'text-(--meta-text)';

    switch (type) {
      case 'schedule':
        return <Calendar className={colorClass} />;
      case 'video':
        return <Video className={colorClass} />;
      case 'image':
        return <Image className={colorClass} />;
      case 'feed':
        return <Newspaper className={colorClass} />;
      case 'birthday':
        return <Gift className={colorClass} />;
      case 'info':
        return <Info className={colorClass} />;
      default:
        return null;
    }
  };

  return (
    <ul className="space-y-2">
      {widgetTypes.map((type) => {
        const isActive = rotatingWidgets.includes(type);

        return (
          <li
            key={type}
            className={`flex items-center justify-between rounded-lg border ${isActive ? 'border-(--border)' : 'border-(--border-disabled)'} px-4 py-2`}
          >
            <div className="flex items-center gap-2">
              {renderIcon(type, isActive)}
              <span
                className={`truncate ${
                  isActive ? 'text-(--text)' : 'text-(--meta-text)'
                }`}
              >
                {widgetLabels[type]}
              </span>
            </div>

            <Switch.Root
              checked={isActive}
              onCheckedChange={(checked) => {
                let next: string[];
                if (checked) {
                  next = [...rotatingWidgets, type];
                } else {
                  next = rotatingWidgets.filter((t) => t !== type);
                  if (next.length === 0) return;
                }
                handleWidgetChange(next);
              }}
              className="relative h-5 w-10 shrink-0 cursor-pointer rounded-full border border-(--border) transition-colors data-[state=checked]:bg-(--button-bg)"
            >
              <Switch.Thumb className="block h-4 w-4 translate-x-[1px] rounded-full bg-(--text) transition-transform data-[state=checked]:translate-x-[21px]" />
            </Switch.Root>
          </li>
        );
      })}
    </ul>
  );
}
