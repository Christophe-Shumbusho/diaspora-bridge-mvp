export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined"
}

export function readJson<T = unknown>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJson<T = unknown>(key: string, value: T): void {
  if (!isBrowser()) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore
  }
}

export function remove(key: string): void {
  if (!isBrowser()) return
  try {
    window.localStorage.removeItem(key)
  } catch {
    // ignore
  }
}





