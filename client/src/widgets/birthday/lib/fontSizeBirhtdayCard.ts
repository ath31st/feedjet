export function fontSizeBirthdayCard(birthdayCount: number): number {
  let fontSizeXl = 5;

  if (birthdayCount <= 8) {
    fontSizeXl = 5;
  } else if (birthdayCount <= 12) {
    fontSizeXl = 4;
  } else if (birthdayCount <= 24) {
    fontSizeXl = 3;
  } else {
    fontSizeXl = 2;
  }

  return fontSizeXl;
}
