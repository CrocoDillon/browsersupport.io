import { findProperty, suggestions } from '@browsersupport/data/database'
import { InputError } from '@browsersupport/data/validation'
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params
    const property = await findProperty(name)
    return Response.json(
      property
        ? { property }
        : { property: null, suggestions: await suggestions(name) },
      {
        headers: {
          'Cache-Control':
            'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    )
  } catch (error) {
    if (error instanceof InputError)
      return Response.json({ error: error.message }, { status: 400 })
    return Response.json(
      { error: 'The archive is temporarily unavailable' },
      { status: 503 }
    )
  }
}
