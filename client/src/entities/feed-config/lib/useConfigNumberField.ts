import { useFeedConfig, useUpdateFeedConfig } from '..';
import { useEffect, useState } from 'react';

export function useConfigNumberField<
  Field extends 'cellsPerPage' | 'pagesCount',
>(field: Field, min = 1) {
  const { data: config } = useFeedConfig();
  const update = useUpdateFeedConfig();
  const initial = config?.[field] ?? min;
  const [value, setValue] = useState(initial);

  useEffect(() => {
    if (config?.[field] != null && config[field] !== value) {
      setValue(config[field]);
    }
  }, [config, field, value]);

  const set = (v: number) => {
    if (v < min) return;
    setValue(v);
    update.mutate({ data: { [field]: v } });
  };

  return { value, set };
}
