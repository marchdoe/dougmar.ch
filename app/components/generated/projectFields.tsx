// Reads an optional string field from a content record without widening its type.
export function textField(source: object, key: string): string {
  const value: unknown = Reflect.get(source, key)
  return typeof value === 'string' ? value : ''
}
