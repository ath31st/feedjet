import { CommonButton } from '@/shared/ui/common';
import { FormField, sharedInputStyles } from '@/shared/ui/common/FormField';
import { CheckIcon, ReloadIcon } from '@radix-ui/react-icons';
import { usePhilipsPair } from '../model/usePhilipsPair';

interface PhilipsPairPanelProps {
  ip: string;
  isPaired: boolean;
  description?: string;
  onPaired?: () => void;
}

export function PhilipsPairPanel({
  ip,
  isPaired,
  description,
  onPaired,
}: PhilipsPairPanelProps) {
  const { status, pin, setPin, errorMessage, start, complete, reset } =
    usePhilipsPair({
      ip,
      onSuccess: () => onPaired?.(),
    });

  const renderStatusBadge = () => {
    if (status === 'success') {
      return (
        <span className="text-green-500">✓ Сопряжение выполнено успешно</span>
      );
    }
    if (isPaired && status === 'idle') {
      return (
        <span className="text-green-500">
          ✓ Привязка активна — TV запомнил сервер
        </span>
      );
    }
    if (!isPaired && status === 'idle') {
      return (
        <span className="text-(--meta-text)">Привязка ещё не выполнена</span>
      );
    }
    return null;
  };

  return (
    <div className="space-y-2 rounded-md border border-(--border) p-3">
      <div className="flex items-center justify-between text-sm">
        <strong className="text-(--meta-text)">Привязка к TV</strong>
        {renderStatusBadge()}
      </div>

      <div className="text-(--meta-text) text-xs">
        {ip ? (
          <>
            Целевой адрес: <span className="font-mono">{ip}:1926</span>
          </>
        ) : (
          <span className="text-yellow-500">
            ⚠ Введите IP-адрес Philips TV.
          </span>
        )}
      </div>

      {(status === 'idle' || status === 'error') && (
        <div className="flex justify-center gap-2 text-sm">
          <CommonButton
            type="button"
            onClick={start}
            disabled={!ip}
            tooltip={
              isPaired
                ? 'Привязать заново (старая привязка станет недействительной только после успешной новой)'
                : 'Начать привязку к Philips TV'
            }
          >
            {isPaired ? 'Привязать заново' : 'Начать привязку'}
          </CommonButton>
        </div>
      )}

      {status === 'starting' && (
        <div className="text-sm">Отправляю запрос на привязку к TV…</div>
      )}

      {status === 'awaitingPin' && (
        <div className="space-y-2">
          <div className="text-sm">
            На экране TV появился 4-значный PIN. Введите его сюда (тайм-аут — 60
            сек):
          </div>
          <FormField id="philips-pair-pin" label="PIN" required>
            <input
              id="philips-pair-pin"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={16}
              className={sharedInputStyles}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
            />
          </FormField>
          <div className="flex gap-2">
            <CommonButton
              type="button"
              onClick={reset}
              tooltip="Отменить и начать заново"
            >
              <ReloadIcon />
            </CommonButton>
            <CommonButton
              type="button"
              onClick={() => complete(description)}
              disabled={!pin.trim()}
              tooltip="Подтвердить PIN"
            >
              <CheckIcon />
            </CommonButton>
          </div>
        </div>
      )}

      {status === 'completing' && (
        <div className="text-sm">Подтверждаю PIN…</div>
      )}

      {status === 'success' && (
        <div className="space-y-3 py-1 text-center">
          <div className="flex items-center justify-center gap-1 font-medium text-green-500 text-sm">
            <CheckIcon className="h-4 w-4" /> Сопряжение выполнено успешно!
          </div>
          <div className="text-(--meta-text) text-xs">
            Телевизор успешно сохранил авторизацию.
          </div>
          <div className="flex justify-center">
            <CommonButton
              type="button"
              onClick={() => onPaired?.()}
              tooltip="Закрыть окно сопряжения"
            >
              Готово
            </CommonButton>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="text-red-500 text-sm">{errorMessage}</div>
      )}
    </div>
  );
}
