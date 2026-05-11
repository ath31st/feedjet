/** biome-ignore-all lint/a11y: disable all a11y rules */
import { useState, useEffect, useCallback } from 'react';
import { useScenario, useReorderScenarioItems } from '@/entities/scenario';
import type { ScenarioItem } from '@/entities/scenario';
import { useKioskStore } from '@/entities/kiosk';
import { toast } from 'sonner';
import { ScenarioPreviewPlayer } from '@/features/scenario-preview-player';
import {
  ScenarioEditor,
  type PreviewMediaState,
} from '@/features/scenario-editor';
import { ScenarioPreviewModal } from '@/features/scenario-editor/ui/ScenarioPreviewModal';
import { ScenarioAddItemModal } from '@/features/scenario-add-item-modal';
import { SettingsCard } from '@/shared/ui';

export function ScenariosManagementWidget() {
  const currentKiosk = useKioskStore((s) => s.currentKiosk);
  const effectiveKioskId = currentKiosk.id;
  const kioskSlug = currentKiosk.slug || '';
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [localItems, setLocalItems] = useState<ScenarioItem[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [paused, setPaused] = useState(false);
  const [previewContent, setPreviewContent] =
    useState<PreviewMediaState | null>(null);
  const [currentPlayingItemId, setCurrentPlayingItemId] = useState<
    number | null
  >(null);

  const { data: scenario, isLoading } = useScenario(effectiveKioskId);

  const reorder = useReorderScenarioItems(effectiveKioskId);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (typeof e.data !== 'object' || e.data === null) return;

      if (
        e.data.type === 'kiosk:item-changed' ||
        e.data.type === 'kiosk:state'
      ) {
        if (typeof e.data.itemId === 'number') {
          setCurrentPlayingItemId(e.data.itemId);
        }

        if (typeof e.data.userPaused === 'boolean') {
          setPaused(e.data.userPaused);
        }
      }
    };

    window.addEventListener('message', onMessage);

    return () => window.removeEventListener('message', onMessage);
  }, []);

  useEffect(() => {
    if (scenario) {
      setLocalItems(scenario.items);
      setIsDirty(false);
    }
  }, [scenario]);

  const reloadIframe = useCallback(() => {
    setIframeKey((k) => k + 1);
    setPaused(false);
  }, []);

  const handleSave = () => {
    reorder.mutate(
      {
        kioskId: effectiveKioskId,
        orderedIds: localItems.map((i) => i.id),
      },
      {
        onSuccess: () => {
          toast.success('Сценарий сохранён');

          setIsDirty(false);
        },
      },
    );
  };

  const openPreview = useCallback((payload: PreviewMediaState) => {
    setPreviewContent(payload);
  }, []);

  const previewSrc = kioskSlug ? `/${kioskSlug}` : '/';

  const activeItemsCount = localItems.filter((i) => i.isActive).length;

  const totalDuration = localItems
    .filter((i) => i.isActive)
    .reduce((sum, i) => sum + (i.durationSeconds ?? 10), 0);

  return (
    <div className="flex w-full flex-row items-start gap-6">
      <SettingsCard title="Редактор сценариев" className="w-full md:w-1/2">
        <ScenarioEditor
          kioskId={effectiveKioskId}
          items={localItems}
          isDirty={isDirty}
          isLoading={isLoading}
          currentPlayingItemId={currentPlayingItemId}
          onItemsChange={setLocalItems}
          onDirtyChange={setIsDirty}
          onSave={handleSave}
          onReset={() => {
            setLocalItems(scenario?.items ?? []);
            setIsDirty(false);
          }}
          onOpenAddModal={() => setAddModalOpen(true)}
          onPreview={openPreview}
        />
      </SettingsCard>

      <SettingsCard title="Превью киоска" className="w-full md:w-1/2">
        <ScenarioPreviewPlayer
          previewSrc={previewSrc}
          iframeKey={iframeKey}
          paused={paused}
          setPaused={setPaused}
          activeItemsCount={activeItemsCount}
          totalDuration={totalDuration}
          effectiveKioskId={effectiveKioskId}
          onReload={reloadIframe}
        />
      </SettingsCard>

      <ScenarioAddItemModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        kioskId={effectiveKioskId}
      />

      <ScenarioPreviewModal
        preview={previewContent}
        onClose={() => setPreviewContent(null)}
      />
    </div>
  );
}
