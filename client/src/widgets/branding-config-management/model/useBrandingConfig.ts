import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useGetCurrentConfig, useUpdateConfig } from '@/entities/branding';

export type BrandingFormValues = {
  id: number;
  organizationName: string;
  scheduleHeaderTitle: string;
};

export const useBranding = () => {
  const { data: brandingConfig, isLoading } = useGetCurrentConfig();
  const { mutate: updateBranding } = useUpdateConfig();

  const form = useForm<BrandingFormValues>({
    defaultValues: {
      id: 0,
      organizationName: '',
      scheduleHeaderTitle: '',
    },
  });

  useEffect(() => {
    if (!brandingConfig) return;

    form.reset({
      id: brandingConfig.id,
      organizationName: brandingConfig.organizationName,
      scheduleHeaderTitle: brandingConfig.scheduleHeaderTitle,
    });
  }, [brandingConfig, form]);

  const onSubmit = form.handleSubmit((values) => {
    updateBranding({
      brandingConfigId: values.id,
      data: {
        organizationName: values.organizationName,
        scheduleHeaderTitle: values.scheduleHeaderTitle,
      },
    });
  });

  const onCancel = () => {
    form.reset();
  };

  return {
    form,
    brandingConfig,
    isLoading,
    onSubmit,
    onCancel,
  };
};
