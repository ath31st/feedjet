export function getTextSizeByCells(cellsCount: number): string {
  switch (cellsCount) {
    case 1:
    case 2:
      return 'text-2xl';
    case 3:
    case 4:
      return 'text-xl';
    case 5:
    case 6:
      return 'text-lg';
    case 7:
    case 8:
      return 'text-md';
    case 9:
    case 10:
      return 'text-sm';
    default:
      return 'text-xs';
  }
}
