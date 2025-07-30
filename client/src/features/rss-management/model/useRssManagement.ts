import { useState } from 'react';
import {
  useGetAllRss,
  useCreateRss,
  useDeleteRss,
  useUpdateRss,
} from '@/entities/rss';

export function useRssManagement() {
  const [newFeed, setNewFeed] = useState('');
  const { data: feeds, isLoading: feedsLoading } = useGetAllRss();
  const createRss = useCreateRss();
  const deleteRss = useDeleteRss();
  const updateRss = useUpdateRss();

  const handleAddFeed = () => {
    const url = newFeed.trim();
    if (!url) return;
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

  return {
    newFeed,
    setNewFeed,
    feeds,
    feedsLoading,
    handleAddFeed,
    handleDeleteFeed,
    handleUpdateFeed,
  };
}
