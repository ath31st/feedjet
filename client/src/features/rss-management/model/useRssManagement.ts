import { useState } from 'react';
import {
  useGetAllRss,
  useCreateRss,
  useDeleteRss,
  useUpdateRss,
} from '@/entities/rss';
import { isValidUrl } from '@/shared/lib/isValidUrl';
import { toast } from 'sonner';

export function useRssManagement() {
  const [newFeed, setNewFeed] = useState('');
  const { data: feeds, isLoading: feedsLoading } = useGetAllRss();
  const createRss = useCreateRss();
  const deleteRss = useDeleteRss();
  const updateRss = useUpdateRss();

  const handleAddFeed = () => {
    const url = newFeed.trim();

    if (!url || !isValidUrl(url)) {
      toast.error('Некорректная ссылка RSS');
      return;
    }

    createRss.mutate(
      { url },
      {
        onSuccess: () => setNewFeed(''),
      },
    );
  };

  const handleDeleteFeed = (id: number) => {
    deleteRss.mutate({ id });
  };

  const handleUpdateFeed = (id: number, url?: string, isActive?: boolean) => {
    updateRss.mutate({ id, data: { url, isActive } });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFeed(e.target.value);
  };

  return {
    newFeed,
    feeds,
    feedsLoading,
    handleAddFeed,
    handleDeleteFeed,
    handleUpdateFeed,
    handleInput,
  };
}
