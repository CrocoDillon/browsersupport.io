import { properties } from '@browsersupport/data/database'
import {
  browserVersion,
  observationBatch,
} from '@browsersupport/data/validation'
import { readJson, failure } from '../json'
export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams
    const { browser, version } = browserVersion(
      params.get('browser'),
      params.get('version')
    )
    const docs = await (
      await properties()
    )
      .find(
        { ['browsers.' + browser + '.' + version]: { $exists: false } },
        { projection: { _id: 0, name: 1 }, maxTimeMS: 5000 }
      )
      .sort({ name: 1 })
      .limit(500)
      .toArray()
    return Response.json(
      { names: docs.map(doc => doc.name) },
      { headers: { 'Cache-Control': 'no-store' } }
    )
  } catch (error) {
    return failure(error)
  }
}
export async function POST(request: Request) {
  try {
    const body = await readJson(request)
    const { browser, version } = browserVersion(body.browser, body.version)
    const batch = observationBatch(body.properties)
    const field = 'browsers.' + browser + '.' + version
    const result = await (
      await properties()
    ).bulkWrite(
      batch.map(({ name, observation }) => ({
        updateOne: {
          filter: { name, [field]: { $exists: false } },
          update: { $set: { [field]: observation } },
        },
      })),
      { ordered: false }
    )
    return Response.json({ updated: result.modifiedCount })
  } catch (error) {
    return failure(error)
  }
}
