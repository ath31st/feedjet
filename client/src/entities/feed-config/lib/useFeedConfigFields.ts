import { useFeedConfig, useUpdateFeedConfig } from '..';
import { useState, useEffect } from 'react';

export function useFeedConfigFields(minVisible = 1, minTotal = 1) {
  const { data: config } = useFeedConfig();
  const update = useUpdateFeedConfig();

  const visible = config?.visibleCellCount ?? minVisible;
  const total = config?.carouselSize ?? minTotal;

  const [visibleCellCount, setVisibleCellCount] = useState(visible);
  const [carouselSize, setCarouselSize] = useState(total);

  useEffect(() => {
    if (config) {
      if (config.visibleCellCount !== visibleCellCount) {
        setVisibleCellCount(config.visibleCellCount);
      }
      if (config.carouselSize !== carouselSize) {
        setCarouselSize(config.carouselSize);
      }
    }
  }, [config, visibleCellCount, carouselSize]);

  const setVisible = (v: number) => {
    setVisibleCellCount(v);
    if (carouselSize < v) {
      setCarouselSize(v);
      update.mutate({ data: { visibleCellCount: v, carouselSize: v } });
    } else {
      update.mutate({ data: { visibleCellCount: v } });
    }
  };

  const setTotal = (v: number) => {
    if (visibleCellCount > v) {
      setVisibleCellCount(v);
      setCarouselSize(v);
      update.mutate({ data: { visibleCellCount: v, carouselSize: v } });
    } else {
      setCarouselSize(v);
      update.mutate({ data: { carouselSize: v } });
    }
  };

  return {
    visibleCellCount,
    carouselSize,
    setVisibleCellCount: setVisible,
    setCarouselSize: setTotal,
  };
}
