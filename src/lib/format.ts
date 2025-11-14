export const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    v,
  )

export const absUrl = (path: string): string => {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  const base = process.env.NEXT_PUBLIC_API_BASE || ''
  try {
    return new URL(path, base).toString()
  } catch {
    return path
  }
}
