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
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [newFeedName, setNewFeedName] = useState('');
  const { data: feeds, isLoading: feedsLoading } = useGetAllRss();
  const createRss = useCreateRss();
  const deleteRss = useDeleteRss();
  const updateRss = useUpdateRss();

  const handleAddFeed = () => {
    const url = newFeedUrl.trim();
    const name = newFeedName.trim() || undefined;

    if (!url) {
      toast.error('Введите ссылку RSS');
      return;
    }

    if (!isValidUrl(url)) {
      toast.error('Некорректная ссылка RSS');
      return;
    }

    createRss.mutate(
      { url, name },
      {
        onSuccess: () => setNewFeedUrl(''),
        onError: () => setNewFeedName(''),
      },
    );
  };

  const handleDeleteFeed = (id: number) => {
    deleteRss.mutate({ id });
  };

  const handleUpdateFeed = (
    id: number,
    url?: string,
    name?: string,
    isActive?: boolean,
  ) => {
    updateRss.mutate({ id, data: { url, name, isActive } });
  };

  const handleUrlInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFeedUrl(e.target.value);
  };

  const handleNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewFeedName(e.target.value);
  };

  return {
    newFeedUrl,
    newFeedName,
    feeds,
    feedsLoading,
    handleAddFeed,
    handleDeleteFeed,
    handleUpdateFeed,
    handleUrlInput,
    handleNameInput,
  };
}
