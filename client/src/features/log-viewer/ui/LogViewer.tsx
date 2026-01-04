import { useEffect, useState } from 'react';
import { LogCard } from './LogCard';
import {
  LogLevel,
  useGetLogFiles,
  useGetLogPage,
  type LogFilter,
  type LogItem,
} from '@/entities/log';

export function LogViewer() {
  const [file, setFile] = useState<string>();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [filter, setFilter] = useState<LogFilter>({});
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState<LogLevel | ''>('');

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

  if (isLoading) {
    return <div className="p-4">Загрузка...</div>;
  }

  if (!file) {
    return <div className="p-4">Нет логов</div>;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-3 border-b p-3 text-sm">
        <select
          value={file}
          onChange={(e) => {
            setFile(e.target.value);
            setPage(0);
          }}
        >
          {files?.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(0);
          }}
        >
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>

        <select
          value={level}
          onChange={(e) =>
            setLevel(e.target.value ? Number(e.target.value) : '')
          }
        >
          <option value="">Все уровни</option>{' '}
          <option value={LogLevel.Trace}>Trace</option>{' '}
          <option value={LogLevel.Debug}>Debug</option>{' '}
          <option value={LogLevel.Info}>Info</option>{' '}
          <option value={LogLevel.Warn}>Warn</option>{' '}
          <option value={LogLevel.Error}>Error</option>{' '}
          <option value={LogLevel.Fatal}>Fatal</option>{' '}
        </select>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск"
        />

        <button type="button" onClick={applyFilters}>
          Применить
        </button>

        <div className="ml-auto flex gap-2">
          <button
            type="button"
            disabled={!data?.hasPrev}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Назад
          </button>
          <button
            type="button"
            disabled={!data?.hasNext}
            onClick={() => setPage((p) => p + 1)}
          >
            Вперёд →
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3 font-mono text-xs">
        {isLoading && <div>Загрузка...</div>}
        {data?.logs.map((log: LogItem, i: number) => (
          <LogCard key={`${log.time}-${i}`} log={log} />
        ))}
      </div>
    </div>
  );
}
