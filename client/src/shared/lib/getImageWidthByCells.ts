export function getImageWidthByCells(cellsCount: number): string {
  switch (cellsCount) {
    case 1:
    case 2:
      return 'w-[50%]';
    case 3:
    case 4:
      return 'w-[40%]';
    case 5:
    case 6:
      return 'w-[35%]';
    case 7:
    case 8:
    case 9:
    case 10:
      return 'w-[30%]';
    default:
      return 'w-[30%]';
  }
}
