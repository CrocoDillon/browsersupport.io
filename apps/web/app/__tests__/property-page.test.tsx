import { renderToStaticMarkup } from 'react-dom/server'
import { propertyHref } from '@browsersupport/data'
import { findProperty, relatedProperties } from '../lib/catalog'
import PropertyPage, { generateMetadata } from '../[name]/page'

jest.mock('../lib/catalog', () => ({
  findProperty: jest.fn(),
  relatedProperties: jest.fn(),
  suggestions: jest.fn(),
}))
jest.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_HTTP_ERROR_FALLBACK;404')
  },
  redirect: jest.fn(),
}))

beforeEach(() => {
  jest.clearAllMocks()
  jest.mocked(findProperty).mockImplementation(async name => ({
    name,
    browsers: {},
  }))
  jest.mocked(relatedProperties).mockResolvedValue([])
})

describe('property page URL parameters', () => {
  test.each([
    ['Array.prototype.%40%40iterator', 'Array.prototype.@@iterator'],
    ['Array.prototype%5B%40%40iterator%5D', 'Array.prototype[@@iterator]'],
    ['Array.prototype.includes', 'Array.prototype.includes'],
    ['Object.percent%25', 'Object.percent%'],
    ['Object.literal%2540', 'Object.literal%40'],
  ])('looks up and links the decoded name for %s', async (param, name) => {
    const params = Promise.resolve({ name: param })
    const page = await PropertyPage({ params })
    expect(findProperty).toHaveBeenCalledWith(name)
    expect(relatedProperties).toHaveBeenCalledWith(name)
    const html = renderToStaticMarkup(page)
    expect(html).toContain('href="/' + name.split('.')[0] + '"')
    expect(html).toContain('href="' + propertyHref(name) + '"')
    const metadata = await generateMetadata({ params })
    expect(metadata.title).toBe(name)
    expect(metadata.alternates?.canonical).toBe(propertyHref(name))
  })

  test.each(['Array%2Fprototype', 'Array%5Cprototype', 'Array%00', '%E0%A4%A'])(
    'rejects invalid decoded parameter %s before accessing the database',
    async name => {
      const params = Promise.resolve({ name })
      await expect(PropertyPage({ params })).rejects.toThrow(
        'NEXT_HTTP_ERROR_FALLBACK;404'
      )
      await expect(generateMetadata({ params })).rejects.toThrow(
        'NEXT_HTTP_ERROR_FALLBACK;404'
      )
      expect(findProperty).not.toHaveBeenCalled()
    }
  )
})
