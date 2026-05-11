export function cn(
  ...args: Array<string | false | null | undefined | 0>
): string {
  return args.filter(Boolean).join(' ');
}
