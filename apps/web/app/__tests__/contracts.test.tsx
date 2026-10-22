import { renderToStaticMarkup } from 'react-dom/server'
import {
  segments,
  propertyHref,
  supportOf,
  compareVersions,
} from '@browsersupport/data'
import {
  browserVersion,
  escapeRegex,
  observationBatch,
  searchInput,
  validName,
} from '@browsersupport/data/validation'
import { PropertyPath } from '../components/property-path'
import {
  detectProperty,
  discoverProperties,
} from '@browsersupport/data/detection'
describe('existing property URLs', () => {
  test('every object path segment links to its cumulative path', () => {
    expect(segments('String.prototype.trimStart')).toEqual([
      { label: 'String', name: 'String' },
      { label: '.prototype', name: 'String.prototype' },
      { label: '.trimStart', name: 'String.prototype.trimStart' },
    ])
    const html = renderToStaticMarkup(
      <PropertyPath name="String.prototype.trimStart" />
    )
    for (const href of [
      '/String',
      '/String.prototype',
      '/String.prototype.trimStart',
    ])
      expect(html).toContain('href="' + href + '"')
  })
  test('well-known symbols retain bracket URLs', () => {
    expect(propertyHref('Array.prototype[@@iterator]')).toBe(
      '/Array.prototype[@@iterator]'
    )
    expect(segments('Array.prototype[@@iterator]')[2]).toEqual({
      label: '[@@iterator]',
      name: 'Array.prototype[@@iterator]',
    })
  })
  test('constructor is a legitimate archived property', () =>
    expect(validName('Object.prototype.constructor')).toBe(
      'Object.prototype.constructor'
    ))
})
describe('observation semantics', () => {
  test('missing and thrown checks are unknown', () => {
    expect(supportOf()).toBe('unknown')
    expect(supportOf({ throws: true, in: false })).toBe('unknown')
    expect(supportOf({ own: false })).toBe('unknown')
  })
  test('missing parents and symbols mean absent', () => {
    for (const value of [
      { parent: false },
      { parentProto: false },
      { symbol: false },
      { in: false },
    ])
      expect(supportOf(value)).toBe('absent')
  })
  test('inherited properties are present', () =>
    expect(supportOf({ in: true, own: false })).toBe('present'))
  test('underscore versions sort numerically', () =>
    expect(['9_1', '10_1', '10', '9', '100'].sort(compareVersions)).toEqual([
      '9',
      '9_1',
      '10',
      '10_1',
      '100',
    ]))
})
describe('untrusted search and lab inputs', () => {
  test('search metacharacters are literal', () => {
    const regex = new RegExp(escapeRegex('Array.prototype[@@iterator]'))
    expect(regex.test('Array.prototype[@@iterator]')).toBe(true)
    expect(regex.test('ArrayXprototypei')).toBe(false)
  })
  test('pagination and search are bounded', () => {
    for (const page of ['0', '-1', '1.5', '2001', 'Infinity'])
      expect(() => searchInput('', page)).toThrow()
    expect(searchInput(' trim ', null)).toMatchObject({
      query: 'trim',
      page: 1,
    })
    expect(() => searchInput('a'.repeat(121), 1)).toThrow()
  })
  test('browser paths cannot inject MongoDB operators', () => {
    expect(browserVersion('safari', '16.4')).toEqual({
      browser: 'safari',
      version: '16_4',
    })
    for (const browser of ['chrome.$set', '__proto__', 'unknown'])
      expect(() => browserVersion(browser, '1')).toThrow()
    expect(() => browserVersion('chrome', '$ne')).toThrow()
  })
  test('only boolean observations are accepted and dates are server generated', () => {
    expect(
      observationBatch([{ name: 'NaN', in: true }])[0].observation
    ).toMatchObject({ in: true, recordedAt: expect.any(String) })
    for (const item of [
      { name: 'NaN', in: 'yes' },
      { name: 'NaN', recordedAt: 'fake' },
      { name: 'NaN', unsupported: true },
    ])
      expect(() => observationBatch([item])).toThrow()
  })
})
describe('detector', () => {
  test('detects missing parents, inheritance, symbols, and throwing getters without eval', () => {
    const root = { Array, String, sub: Object.create({ inherited: true }) }
    expect(detectProperty('String.prototype.trimStart', root)).toEqual({
      in: true,
      own: true,
    })
    expect(detectProperty('Missing.prototype.x', root)).toEqual({
      parent: false,
    })
    expect(detectProperty('sub.inherited', root)).toEqual({
      in: true,
      own: false,
    })
    expect(detectProperty('Array.prototype[@@iterator]', root)).toEqual({
      in: true,
      own: true,
    })
    expect(detectProperty('sub[@@notASymbol]', root)).toEqual({ symbol: false })
    const bad = Object.defineProperty({}, 'bad', {
      get() {
        throw new Error('blocked')
      },
    })
    expect(detectProperty('bad.child', bad)).toEqual({ throws: true })
  })
  test('discovery never invokes global getters', () => {
    const getter = jest.fn(() => {
      throw new Error('blocked')
    })
    const root = Object.defineProperty({ String }, 'restricted', {
      get: getter,
    })
    const names = discoverProperties(root)
    expect(names).toContain('restricted')
    expect(names).toContain('String.prototype.trimStart')
    expect(getter).not.toHaveBeenCalled()
  })
})
