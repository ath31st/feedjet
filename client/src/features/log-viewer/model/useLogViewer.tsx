import {
  useGetLogFiles,
  useGetLogPage,
  type LogFilter,
  type LogLevel,
} from '@/entities/log';
import { useEffect, useState } from 'react';

export const useLogViewer = () => {
  const [file, setFile] = useState<string>();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(20);
  const [filter, setFilter] = useState<LogFilter>({});
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState<LogLevel | undefined>(undefined);
  const { data: files } = useGetLogFiles();

  useEffect(() => {
    if (files?.length && !file) {
      setFile(files[0]);
      setPage(0);
    }
  }, [files, file]);

  const { data, isLoading } = useGetLogPage(file, filter, page, pageSize);

  const applyFilters = () => {
    setFilter({
      level: level || undefined,
      search: search || undefined,
    });
    setPage(0);
  };

  return {
    file,
    setFile,
    files,
    level,
    setPage,
    pageSize,
    isLoading,
    setLevel,
    setFilter,
    search,
    setSearch,
    applyFilters,
    setPageSize,
    logPage: data,
  };
};
