import { properties } from '@browsersupport/data/database'
export async function GET() {
  try {
    const cursor = (await properties())
      .find({}, { projection: { _id: 0, name: 1 }, maxTimeMS: 10000 })
      .sort({ name: 1 })
      .limit(50000)
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async pull(controller) {
        try {
          const doc = await cursor.next()
          if (doc)
            controller.enqueue(
              encoder.encode(JSON.stringify({ name: doc.name }) + '\n')
            )
          else {
            await cursor.close()
            controller.close()
          }
        } catch (error) {
          await cursor.close()
          controller.error(error)
        }
      },
      async cancel() {
        await cursor.close()
      },
    })
    return new Response(stream, {
      headers: {
        'Content-Type': 'application/x-ndjson',
        'Cache-Control': 'public, s-maxage=3600',
      },
    })
  } catch {
    return Response.json(
      { error: 'The archive is temporarily unavailable' },
      { status: 503 }
    )
  }
}
