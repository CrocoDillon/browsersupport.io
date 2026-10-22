import { properties } from '@browsersupport/data/database'
import { InputError, validName } from '@browsersupport/data/validation'
import { readJson, failure } from '../json'
export async function POST(request: Request) {
  try {
    const { names } = await readJson(request)
    if (!Array.isArray(names) || !names.length || names.length > 20000)
      throw new InputError('Submit between 1 and 20,000 names')
    const unique = [...new Set(names.map(validName))]
    const result = await (
      await properties()
    ).bulkWrite(
      unique.map(name => ({
        updateOne: {
          filter: { name },
          update: { $setOnInsert: { name, created: new Date(), browsers: {} } },
          upsert: true,
        },
      })),
      { ordered: false }
    )
    return Response.json({ inserted: result.upsertedCount })
  } catch (error) {
    return failure(error)
  }
}
