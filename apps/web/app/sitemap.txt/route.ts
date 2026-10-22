import { properties } from '@browsersupport/data/database'
import { propertyHref } from '@browsersupport/data'
export const dynamic = 'force-dynamic'
export async function GET() {
  const collection = await properties()
  const names = await collection
    .find({}, { projection: { _id: 0, name: 1 }, maxTimeMS: 10000 })
    .sort({ name: 1 })
    .limit(49998)
    .toArray()
  return new Response(
    [
      'https://browsersupport.io/',
      'https://browsersupport.io/about',
      ...names.map(
        item => 'https://browsersupport.io' + propertyHref(item.name)
      ),
    ].join('\n') + '\n',
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    }
  )
}
