import {
  usePairPhilipsComplete,
  usePairPhilipsStart,
} from '@/entities/integration';
import { useState } from 'react';

export type PairStatus =
  | 'idle'
  | 'starting'
  | 'awaitingPin'
  | 'completing'
  | 'success'
  | 'error';

interface UsePhilipsPairArgs {
  ip: string;
  onSuccess?: () => void;
}

export function usePhilipsPair({ ip, onSuccess }: UsePhilipsPairArgs) {
  const [status, setStatus] = useState<PairStatus>('idle');
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startMutation = usePairPhilipsStart();
  const completeMutation = usePairPhilipsComplete();

  const reset = () => {
    setStatus('idle');
    setPin('');
    setErrorMessage(null);
  };

  const start = () => {
    if (!ip) {
      setErrorMessage(
        'У киоска нет активного подключения (heartbeat). Запустите клиент на TV или укажите устройство.',
      );
      setStatus('error');
      return;
    }

    setErrorMessage(null);
    setStatus('starting');
    startMutation.mutate(
      { ip },
      {
        onSuccess: () => {
          setStatus('awaitingPin');
        },
        onError: (error) => {
          setErrorMessage(error.message || 'Не удалось запустить привязку');
          setStatus('error');
        },
      },
    );
  };

  const complete = (description?: string) => {
    if (!pin.trim()) {
      setErrorMessage('Введите PIN с экрана TV');
      return;
    }

    setErrorMessage(null);
    setStatus('completing');
    completeMutation.mutate(
      {
        ip,
        pin: pin.trim(),
        description: description?.trim() || undefined,
      },
      {
        onSuccess: () => {
          setStatus('success');
          setPin('');
          onSuccess?.();
        },
        onError: (error) => {
          setErrorMessage(error.message || 'Не удалось завершить привязку');
          setStatus('error');
        },
      },
    );
  };

  return {
    status,
    pin,
    setPin,
    errorMessage,
    start,
    complete,
    reset,
    ip,
  };
}
