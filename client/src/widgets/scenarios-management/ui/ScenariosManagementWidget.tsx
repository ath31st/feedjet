import { useKioskStore } from '@/entities/kiosk';
import { ScenarioPreviewPlayer } from '@/features/scenario-preview-player';
import { ScenarioEditor } from '@/features/scenario-editor';
import { ScenarioAddItemModal } from '@/features/scenario-add-item-modal';
import { SettingsCard } from '@/shared/ui';
import { useScenarioManagement } from '../model/useScenarioManagement';
import { usePlayerSync } from '../model/usePlayerSync';
import { useModals } from '../model/useModals';
import { PreviewModal } from '@/features/preview-modal';

export function ScenariosManagementWidget() {
  const currentKiosk = useKioskStore((s) => s.currentKiosk);
  const effectiveKioskId = currentKiosk.id;
  const kioskSlug = currentKiosk.slug || '';

  const {
    localItems,
    setLocalItems,
    isLoading,
    isDirty,
    setIsDirty,
    activeItemsCount,
    totalDuration,
    handleSave,
    handleReset,
  } = useScenarioManagement(effectiveKioskId);

  const { iframeKey, paused, setPaused, currentPlayingItemId, reloadIframe } =
    usePlayerSync();

  const {
    addModalOpen,
    openAddModal,
    closeAddModal,
    previewContent,
    openPreview,
    closePreview,
  } = useModals();

  const previewSrc = kioskSlug ? `/preview/${kioskSlug}` : '/';

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
          onReset={handleReset}
          onOpenAddModal={openAddModal}
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
        onClose={closeAddModal}
        kioskId={effectiveKioskId}
      />

      {previewContent && (
        <PreviewModal
          open={!!previewContent}
          kind={previewContent.kind}
          src={previewContent.src}
          alt={previewContent.name}
          onClose={closePreview}
          videoMuted
          description={{ name: previewContent.name }}
        />
      )}
    </div>
  );
}
