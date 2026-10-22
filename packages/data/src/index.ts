export type Observation = {
  in?: boolean
  own?: boolean
  parent?: boolean
  parentProto?: boolean
  symbol?: boolean
  throws?: boolean
  recordedAt?: string
}
export type Property = {
  name: string
  created?: string
  browsers: Record<string, Record<string, Observation>>
}
export const browsers = [
  ['chrome', 'Chrome'],
  ['edge', 'Edge'],
  ['firefox', 'Firefox'],
  ['safari', 'Safari'],
  ['opera', 'Opera'],
  ['ios_saf', 'iOS Safari'],
  ['and_chr', 'Chrome Android'],
  ['and_ff', 'Firefox Android'],
  ['and_uc', 'UC Android'],
  ['op_mini', 'Opera Mini'],
  ['ie', 'Internet Explorer'],
  ['ie_mob', 'IE Mobile'],
  ['samsung', 'Samsung Internet'],
] as const
export type Support = 'present' | 'absent' | 'unknown'
export function supportOf(observation?: Observation | null): Support {
  if (!observation || observation.throws) return 'unknown'
  if (
    observation.parent === false ||
    observation.parentProto === false ||
    observation.symbol === false ||
    observation.in === false
  )
    return 'absent'
  return observation.in === true ? 'present' : 'unknown'
}
export function propertyHref(name: string) {
  return (
    '/' +
    encodeURIComponent(name).replace(/%(40|5B|5D)/g, code =>
      decodeURIComponent(code)
    )
  )
}
export function segments(name: string): { label: string; name: string }[] {
  const tokens = name.match(/^[^.\[]+|\.[^.\[]+|\[@@[^\]]+\]/g)
  if (!tokens || tokens.join('') !== name) return [{ label: name, name }]
  let path = ''
  return tokens.map(label => ({ label, name: (path += label) }))
}
export function compareVersions(a: string, b: string) {
  return a
    .replaceAll('_', '.')
    .localeCompare(b.replaceAll('_', '.'), 'en', { numeric: true })
}
export const displayVersion = (version: string) =>
  version === '0' ? 'all' : version.replaceAll('_', '.')
export const examples = [
  {
    name: 'String.prototype.trimStart',
    category: 'String',
    description: 'A little less whitespace. A little more certainty.',
  },
  {
    name: 'Object.entries',
    category: 'Object',
    description: 'Keys and values, together at last.',
  },
  {
    name: 'Array.prototype.includes',
    category: 'Array',
    description: 'Find out if something belongs.',
  },
  {
    name: 'Promise',
    category: 'Async',
    description: 'Good things come to those who await.',
  },
  {
    name: 'localStorage',
    category: 'Web API',
    description: 'A familiar browser API with a few caveats.',
  },
  {
    name: 'NaN',
    category: 'Global',
    description: 'Not a number. Still worth looking up.',
  },
]
