export function field<T extends object>(obj: T, prefix: string, lang: string): string {
  const key = `${prefix}_${lang}` as keyof T
  const v = obj[key]
  return typeof v === 'string' ? v : ''
}

export function paragraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
