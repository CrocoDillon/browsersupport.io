import type { Observation } from './index.ts'
export function detectProperty(
  name: string,
  root: Record<string, unknown> = globalThis as unknown as Record<
    string,
    unknown
  >
): Observation {
  const parts = name.match(/^[^.\[]+|\.[^.\[]+|\[@@[^\]]+\]/g)
  if (!parts || parts.join('') !== name) return { throws: true }
  let target: unknown = root
  try {
    for (let i = 0; i < parts.length; i++) {
      const token = parts[i]
      let key: PropertyKey = token.replace(/^\./, '')
      if (token.startsWith('[@@')) {
        const symbolName = token.slice(3, -1)
        const symbol = Object.getOwnPropertyDescriptor(
          Symbol,
          symbolName
        )?.value
        if (typeof symbol !== 'symbol') return { symbol: false }
        key = symbol
      }
      if (target == null)
        return i > 0 && parts[i - 1] === '.prototype'
          ? { parentProto: false }
          : { parent: false }
      const object = Object(target)
      if (i === parts.length - 1)
        return {
          in: key in object,
          own: Object.prototype.hasOwnProperty.call(object, key),
        }
      target = object[key]
    }
  } catch {
    return { throws: true }
  }
  return { throws: true }
}
export function discoverProperties(root: object = globalThis) {
  const names = new Set<string>()
  const symbols = Object.getOwnPropertyNames(Symbol)
    .map(
      key => [key, Object.getOwnPropertyDescriptor(Symbol, key)?.value] as const
    )
    .filter(([, value]) => typeof value === 'symbol')
  const collect = (object: object, prefix: string) => {
    for (const name of Object.getOwnPropertyNames(object)) {
      if (/^[\w$-]+$/.test(name)) names.add(prefix + '.' + name)
    }
    for (const [name, symbol] of symbols) {
      if (Object.prototype.hasOwnProperty.call(object, symbol))
        names.add(prefix + '[@@' + name + ']')
    }
  }
  for (const name of Object.getOwnPropertyNames(root)) {
    if (!/^[$A-Z_a-z][\w$]*$/.test(name)) continue
    names.add(name)
    try {
      const value = Object.getOwnPropertyDescriptor(root, name)?.value
      if (
        !value ||
        value === root ||
        !['object', 'function'].includes(typeof value)
      )
        continue
      collect(value, name)
      const prototype = Object.getOwnPropertyDescriptor(
        value,
        'prototype'
      )?.value
      if (prototype) collect(prototype, name + '.prototype')
    } catch {
      /* A restricted host object is still a discovered global. */
    }
  }
  return [...names].filter(name => name.length <= 240).sort()
}
