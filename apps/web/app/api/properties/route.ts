import { searchProperties } from '@browsersupport/data/database'
import { InputError } from '@browsersupport/data/validation'
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  try {
    return Response.json(
      await searchProperties(params.get('q'), params.get('page')),
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
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
