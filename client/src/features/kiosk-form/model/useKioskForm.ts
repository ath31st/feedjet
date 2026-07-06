import { useForm } from 'react-hook-form';
import type { Kiosk, NewKiosk, UpdateKiosk } from '@/entities/kiosk';

export type KioskFormValues = {
  name: string;
  slug: string;
  description: string;
  location: string;
  isActive: boolean;
};

export type Mode = 'create' | 'update';

type Params =
  | {
      mode: 'create';
      kiosk?: never;
      onCreate: (data: NewKiosk) => void;
      onUpdate?: never;
      onClose: () => void;
    }
  | {
      mode: 'update';
      kiosk: Kiosk;
      onUpdate: (kioskId: number, data: UpdateKiosk) => void;
      onCreate?: never;
      onClose: () => void;
    };

export function useKioskForm(params: Params) {
  const { mode, onClose } = params;

  const form = useForm<KioskFormValues>({
    defaultValues:
      mode === 'create'
        ? {
            name: '',
            slug: '',
            description: '',
            location: '',
            isActive: false,
          }
        : {
            name: params.kiosk.name,
            slug: params.kiosk.slug,
            description: params.kiosk.description ?? '',
            location: params.kiosk.location ?? '',
            isActive: params.kiosk.isActive,
          },
  });

  const submit = form.handleSubmit((data) => {
    if (mode === 'create') {
      const payload: NewKiosk = {
        name: data.name.trim(),
        slug: data.slug.trim(),
        description: data.description.trim(),
        location: data.location.trim(),
      };

      params.onCreate(payload);
      form.reset();
      onClose();
      return;
    }

    const k = params.kiosk;

    const payload: UpdateKiosk = {
      name: data.name !== k.name ? data.name.trim() : undefined,
      description:
        data.description !== (k.description ?? '')
          ? data.description.trim()
          : undefined,
      location:
        data.location !== (k.location ?? '') ? data.location.trim() : undefined,
      isActive: data.isActive !== k.isActive ? data.isActive : undefined,
    };

    params.onUpdate(k.id, payload);
    onClose();
  });

  return {
    form,
    submit,
    cancel: () => {
      form.reset();
      onClose();
    },
    mode,
  };
}
