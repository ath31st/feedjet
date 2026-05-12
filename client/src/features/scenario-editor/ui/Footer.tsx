interface FooterProps {
  itemsCount: number;
  activeItemsCount: number;
  totalDuration: number;
}

export function Footer({
  itemsCount,
  activeItemsCount,
  totalDuration,
}: FooterProps) {
  return (
    <div className="mt-2 text-(--text-muted) text-xs">
      {itemsCount} элем. · {activeItemsCount} активных · Цикл:{' '}
      {Math.floor(totalDuration / 60)}:
      {String(totalDuration % 60).padStart(2, '0')}
    </div>
  );
}
