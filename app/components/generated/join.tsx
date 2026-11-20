export function joinParts(parts: Array<string | undefined>, sep: string): string {
  return parts.filter((p): p is string => Boolean(p?.trim())).join(sep)
}
