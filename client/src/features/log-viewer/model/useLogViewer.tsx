import {
  downloadLogFile,
  useDeleteLogFiles,
  useGetLogFiles,
  useGetLogPage,
  useGetLogSources,
  type LogFilter,
  type LogLevel,
} from '@/entities/log';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const FOLLOW_INTERVAL_MS = 4_000;
const SEARCH_DEBOUNCE_MS = 400;

export const useLogViewer = () => {
  const [file, setFile] = useState<string>();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [levels, setLevels] = useState<LogLevel[]>([]);
  const [source, setSource] = useState<string>('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [isFollowing, setIsFollowing] = useState(true);
  const [daysToKeep, setDaysToKeep] = useState(7);
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: files, isLoading: isFilesLoading } = useGetLogFiles();
  const { data: sources = [] } = useGetLogSources(file);
  const { mutate: deleteLogFiles, isPending: isDeleting } = useDeleteLogFiles();

  const filter: LogFilter = {
    levels: levels.length > 0 ? levels : undefined,
    source: source || undefined,
    search: search || undefined,
  };

  const followEnabled = isFollowing && page === 0;

  const {
    data: logPage,
    isLoading: isPageLoading,
    isFetching,
  } = useGetLogPage(
    file,
    filter,
    page,
    pageSize,
    followEnabled ? FOLLOW_INTERVAL_MS : false,
  );

  useEffect(() => {
    if (!files?.length) return;

    if (!file || !files.includes(file)) {
      const preferred = files.find((f) => f === 'current.log') ?? files[0];
      setFile(preferred);
      setPage(0);
    }
  }, [files, file]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(0);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const handleFileChange = (nextFile: string) => {
    setFile(nextFile);
    setPage(0);
    setSource('');
    if (nextFile !== 'current.log') {
      setIsFollowing(false);
    }
  };

  const handleLevelsChange = (next: LogLevel[]) => {
    setLevels(next);
    setPage(0);
  };

  const handleSourceChange = (next: string) => {
    setSource(next);
    setPage(0);
  };

  const handlePageSizeChange = (next: number) => {
    setPageSize(next);
    setPage(0);
  };

  const handleToggleFollow = () => {
    setIsFollowing((prev) => {
      const next = !prev;
      if (next) setPage(0);
      return next;
    });
  };

  const handleNewer = () => {
    setPage((p) => Math.max(0, p - 1));
  };

  const handleOlder = () => {
    setIsFollowing(false);
    setPage((p) => p + 1);
  };

  const handleDownload = async () => {
    if (!file) return;
    setIsDownloading(true);
    try {
      await downloadLogFile(file);
      toast.success('Файл скачан');
    } catch {
      toast.error('Не удалось скачать файл');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = () => {
    deleteLogFiles({ daysToKeep });
  };

  return {
    file,
    files: files ?? [],
    sources,
    levels,
    source,
    searchInput,
    page,
    pageSize,
    daysToKeep,
    isFollowing: followEnabled,
    isFollowingDesired: isFollowing,
    logPage,
    isFilesLoading,
    isPageLoading,
    isFetching,
    isDeleting,
    isDownloading,
    handleFileChange,
    handleLevelsChange,
    handleSourceChange,
    setSearchInput,
    handlePageSizeChange,
    setDaysToKeep,
    handleToggleFollow,
    handleNewer,
    handleOlder,
    handleDownload,
    handleDelete,
  };
};
