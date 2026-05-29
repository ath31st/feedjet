import type React from 'react';

interface FolderTreeContainerProps {
  header?: React.ReactNode; // Слот для шапки/баннера перемещения (вне скролла)
  rootRow: React.ReactNode; // Строка "Все файлы" (внутри скролла)
  children: React.ReactNode; // Список нод дерева (внутри скролла)
  bodyFooter?: React.ReactNode; // Слот для элементов внутри скролла (форма создания папки)
  asideFooter?: React.ReactNode; // Слот для элементов строго внизу aside (статистика)
}

export function FolderTreeContainer({
  header,
  rootRow,
  children,
  bodyFooter,
  asideFooter,
}: FolderTreeContainerProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-4 rounded-lg transition-all">
      {header}

      <div className="flex-1 overflow-y-auto">
        {rootRow}
        {children}
        {bodyFooter}{' '}
      </div>
      {asideFooter}
    </aside>
  );
}
