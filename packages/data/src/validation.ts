import { browsers } from './index.ts'
export class InputError extends Error {}
export function validName(value: unknown): string {
  if (
    typeof value !== 'string' ||
    value.length === 0 ||
    value.length > 240 ||
    /[\x00-\x1f/\\]/.test(value)
  )
    throw new InputError('Invalid property name')
  return value
}
export function searchInput(q: unknown, page: unknown) {
  const query = typeof q === 'string' ? q.trim() : ''
  if (query.length > 120)
    throw new InputError('Search is limited to 120 characters')
  const currentPage = page == null || page === '' ? 1 : Number(page)
  if (!Number.isInteger(currentPage) || currentPage < 1 || currentPage > 2000)
    throw new InputError('Page must be between 1 and 2000')
  return { query, page: currentPage, perPage: 30 }
}
export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
export function browserVersion(browser: unknown, version: unknown) {
  if (
    !browsers.some(([id]) => id === browser) ||
    typeof version !== 'string' ||
    !/^\d{1,4}(?:[._]\d{1,4}){0,3}$/.test(version)
  )
    throw new InputError('Choose a known browser and a numeric version')
  return { browser: browser as string, version: version.replaceAll('.', '_') }
}
export function observationBatch(input: unknown) {
  if (!Array.isArray(input) || input.length > 500 || input.length === 0)
    throw new InputError('Submit between 1 and 500 observations')
  return input.map(item => {
    if (!item || typeof item !== 'object' || typeof item.name !== 'string')
      throw new InputError('Invalid observation')
    const name = validName(item.name)
    const observation: Record<string, boolean | string> = {
      recordedAt: new Date().toISOString(),
    }
    for (const [key, value] of Object.entries(item)) {
      if (key === 'name') continue
      if (
        !['in', 'own', 'parent', 'parentProto', 'symbol', 'throws'].includes(
          key
        ) ||
        typeof value !== 'boolean'
      )
        throw new InputError('Observation flags must be booleans')
      observation[key] = value
    }
    if (Object.keys(observation).length === 1)
      throw new InputError('Observation needs at least one detection flag')
    return { name, observation }
  })
}
