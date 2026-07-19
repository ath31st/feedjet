import { LogCard } from './LogCard';
import { LevelMultiSelect } from './LevelMultiSelect';
import { ConfirmActionDialog } from '@/shared/ui';
import { IconButton, SimpleDropdownMenu } from '@/shared/ui/common';
import {
  ThickArrowLeftIcon,
  ThickArrowRightIcon,
  TrashIcon,
} from '@radix-ui/react-icons';
import { Download, Pause, Play } from 'lucide-react';
import { useLogViewer } from '../model/useLogViewer';

export function LogViewer() {
  const {
    file,
    files,
    sources,
    levels,
    source,
    searchInput,
    page,
    pageSize,
    daysToKeep,
    isFollowing,
    isFollowingDesired,
    logPage,
    isFilesLoading,
    isPageLoading,
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
  } = useLogViewer();

  if (isFilesLoading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
            key={i}
            className="h-8 animate-pulse rounded bg-(--border)"
          />
        ))}
      </div>
    );
  }

  if (!file || files.length === 0) {
    return <div className="p-4 text-(--meta-text)">Нет логов</div>;
  }

  const logs = logPage?.logs ?? [];
  const showInitialSkeleton = isPageLoading && !logPage;

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="min-w-40 flex-1">
          <SimpleDropdownMenu
            value={file}
            options={files.map((f) => ({ label: f, value: f }))}
            placeholder="Файл"
            onSelect={handleFileChange}
          />
        </div>

        <div className="min-w-36 flex-1">
          <LevelMultiSelect value={levels} onChange={handleLevelsChange} />
        </div>

        <div className="min-w-36 flex-1">
          <SimpleDropdownMenu
            value={source}
            options={[
              { label: 'Все источники', value: '' },
              ...sources.map((s) => ({ label: s, value: s })),
            ]}
            placeholder="Источник"
            onSelect={handleSourceChange}
          />
        </div>

        <input
          type="search"
          placeholder="Поиск…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="min-w-40 flex-1 rounded-lg border border-(--border) bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:ring-(--border) focus:ring-1"
        />

        <div className="w-24">
          <SimpleDropdownMenu
            value={pageSize}
            options={[
              { label: '20', value: 20 },
              { label: '50', value: 50 },
              { label: '100', value: 100 },
            ]}
            onSelect={handlePageSizeChange}
          />
        </div>

        <IconButton
          onClick={handleToggleFollow}
          tooltip={
            isFollowingDesired
              ? 'Пауза автообновления'
              : 'Следить за новыми записями'
          }
          ariaLabel="Автообновление"
          className={isFollowing ? 'bg-(--button-hover-bg)' : ''}
          icon={
            isFollowingDesired ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )
          }
        />

        <IconButton
          onClick={handleDownload}
          disabled={isDownloading}
          tooltip="Скачать файл"
          ariaLabel="Скачать файл"
          icon={<Download className="h-5 w-5" />}
        />

        <div className="flex items-center gap-1">
          <IconButton
            onClick={handleNewer}
            tooltip="Новее"
            disabled={!logPage?.hasPrev}
            icon={<ThickArrowLeftIcon className="h-5 w-5" />}
          />
          <span className="min-w-16 text-center text-(--meta-text) text-xs">
            стр. {page + 1}
            {/* {isFetching && !showInitialSkeleton ? ' · …' : ''} */}
          </span>
          <IconButton
            onClick={handleOlder}
            tooltip="Старее"
            disabled={!logPage?.hasNext}
            icon={<ThickArrowRightIcon className="h-5 w-5" />}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="w-48">
          <SimpleDropdownMenu
            placeholder="Оставить логи за:"
            value={daysToKeep}
            options={[
              { label: 'Последние 3 дня', value: 3 },
              { label: 'Последние 7 дней', value: 7 },
              { label: 'Последние 30 дней', value: 30 },
            ]}
            onSelect={setDaysToKeep}
          />
        </div>

        <ConfirmActionDialog
          title="Очистить старые логи?"
          description={`Будут удалены файлы старше ${daysToKeep} дн. Текущий лог не затронут. Восстановить нельзя.`}
          confirmText="Удалить"
          trigger={
            <IconButton
              disabled={isDeleting}
              tooltip="Очистить старые логи"
              ariaLabel="Очистить старые логи"
              icon={<TrashIcon className="h-5 w-5" />}
            />
          }
          onConfirm={handleDelete}
        />
      </div>

      <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-(--border) p-2">
        {showInitialSkeleton ? (
          <div className="space-y-2 p-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                key={i}
                className="h-6 animate-pulse rounded bg-(--border)"
              />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-6 text-center text-(--meta-text) text-sm">
            Нет записей по текущим фильтрам
          </div>
        ) : (
          logs.map((log, i) => (
            <LogCard
              // biome-ignore lint/suspicious/noArrayIndexKey: its complicated index already
              key={`${log.time}-${log.source}-${log.msg}-${i}`}
              log={log}
            />
          ))
        )}
      </div>
    </div>
  );
}
