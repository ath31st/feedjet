export interface BirthdayWidgetTransform {
  month: number;
  posX: number;
  posY: number;
  fontScale: number;
  rotateZ: number;
  rotateX: number;
  rotateY: number;
  lineGap: number;
}

export interface BirthdayWidgetTransformUpdate {
  month: number;
  posX?: number;
  posY?: number;
  fontScale?: number;
  rotateZ?: number;
  rotateX?: number;
  rotateY?: number;
  lineGap?: number;
}
