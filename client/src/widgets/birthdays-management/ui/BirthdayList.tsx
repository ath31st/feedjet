import { LoadingThreeDotsJumping } from '@/shared/ui';
import { BirthdayCard } from './BirthdayCard';
import { useBirthdayList } from '../model/useBirthdayList';
import { PopoverHint } from '@/shared/ui/common';

export function BirthdayList() {
  const {
    isLoading,
    birthdays,
    handleDelete,
    startEdit,
    saveEdit,
    setFullNameDraft,
    fullNameDraft,
    editingId,
    cancelEdit,
  } = useBirthdayList();

  if (isLoading) return <LoadingThreeDotsJumping />;
  if (!birthdays?.length) return <p>В базе данных нет дней рождения</p>;

  return (
    <div>
      <div className="absolute top-3 left-44">
        <PopoverHint
          content={
            <>
              <p className="text-yellow-500">Внимание!</p>
              <p>
                При возникновении проблем с правильностью распознования ФИО и
                дат:
              </p>
              <p>1. Откройте документ в текстовом редакторе</p>
              <p>2. Выделите нужные строки</p>
              <p>
                3. На панели инструментов или в меню ПКМ найдите и примените
                "Очистить форматирование"
              </p>
              <p>4. Сохраните документ</p>
              <p>5. Повторите попытку загрузить документ</p>
            </>
          }
        />
      </div>

      <div className="flex w-full flex-col gap-2">
        {birthdays.map((b) => (
          <BirthdayCard
            key={b.id}
            birthday={b}
            isEditing={editingId === b.id}
            fullNameDraft={fullNameDraft}
            onChangeFullName={setFullNameDraft}
            onEdit={startEdit}
            onSave={saveEdit}
            onCancel={cancelEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
