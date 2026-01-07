import { LogCard } from './LogCard';
import { LogLevel, type LogItem } from '@/entities/log';
import { IconButton, SimpleDropdownMenu } from '@/shared/ui/common';
import { ThickArrowLeftIcon, ThickArrowRightIcon } from '@radix-ui/react-icons';
import { useLogViewer } from '../model/useLogViewer';

export function LogViewer() {
  const {
    file,
    setFile,
    files,
    setFilter,
    setLevel,
    setPage,
    pageSize,
    level,
    isLoading,
    search,
    setSearch,
    applyFilters,
    setPageSize,
    logPage,
  } = useLogViewer();

  if (isLoading) {
    return <div className="p-4">Загрузка...</div>;
  }

  if (!file) {
    return <div className="p-4">Нет логов</div>;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex w-full flex-row items-center gap-4 p-3">
        <SimpleDropdownMenu
          value={file ?? ''}
          options={(files ?? []).map((f) => ({ label: f, value: f }))}
          placeholder="Выберите файл"
          onSelect={(v) => {
            setFile(v);
            setPage(0);
          }}
        />

        <SimpleDropdownMenu
          value={level ?? ''}
          options={[
            { label: 'Все уровни', value: '' },
            ...Object.entries(LogLevel).map(([key, value]) => ({
              label: key,
              value,
            })),
          ]}
          onSelect={(l) => {
            const newLevel = l === '' ? undefined : (l as LogLevel);
            setLevel(newLevel);
            setFilter({
              level: newLevel,
              search: search || undefined,
            });
            setPage(0);
          }}
        />

        <input
          type="search"
          placeholder="Поиск"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          className="h-full rounded-lg border border-(--border) bg-transparent px-3 py-2 focus:outline-none focus:ring-(--border) focus:ring-1"
          required
        />

        <SimpleDropdownMenu
          value={pageSize}
          options={[
            { label: '20', value: 20 },
            { label: '50', value: 50 },
            { label: '100', value: 100 },
          ]}
          onSelect={(v) => {
            setPageSize(v);
            setPage(0);
          }}
        />

        <div className="ml-auto flex gap-2">
          <IconButton
            onClick={() => setPage((p) => p - 1)}
            tooltip="Следующая страница"
            disabled={!logPage?.hasPrev}
            icon={<ThickArrowLeftIcon className="h-5 w-5 cursor-pointer" />}
          />
          <IconButton
            onClick={() => setPage((p) => p + 1)}
            tooltip="Предыдущая страница"
            disabled={!logPage?.hasNext}
            icon={<ThickArrowRightIcon className="h-5 w-5 cursor-pointer" />}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3 text-sm">
        {logPage?.logs.map((log: LogItem, i: number) => (
          <LogCard key={`${log.time}-${i}`} log={log} />
        ))}
      </div>
    </div>
  );
}
