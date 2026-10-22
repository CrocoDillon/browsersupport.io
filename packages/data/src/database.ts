import { MongoClient, type Document } from 'mongodb'
import type { Property } from './index.ts'
import { escapeRegex, searchInput, validName } from './validation.ts'
const state = globalThis as typeof globalThis & {
  browsersupportMongo?: Promise<MongoClient>
}
export async function database() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is not configured')
  state.browsersupportMongo ??= new MongoClient(uri, {
    maxPoolSize: 5,
    minPoolSize: 0,
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000,
  })
    .connect()
    .catch(error => {
      state.browsersupportMongo = undefined
      throw error
    })
  return (await state.browsersupportMongo).db(
    process.env.MONGODB_DATABASE || 'browsersupport'
  )
}
export async function properties() {
  return (await database()).collection('properties')
}
export function serializeProperty(doc: Document): Property {
  return {
    name: doc.name,
    created:
      doc.created instanceof Date
        ? doc.created.toISOString()
        : typeof doc.created === 'string'
          ? doc.created
          : undefined,
    browsers: doc.browsers ?? {},
  }
}
export async function findProperty(name: string) {
  const doc = await (
    await properties()
  ).findOne({ name: validName(name) }, { projection: { _id: 0 } })
  return doc ? serializeProperty(doc) : null
}
export async function searchProperties(q: unknown = '', p: unknown = 1) {
  const { query, page, perPage } = searchInput(q, p)
  const filter = query
    ? { name: { $regex: escapeRegex(query), $options: 'i' } }
    : {}
  const collection = await properties()
  const [docs, totalCount] = await Promise.all([
    collection
      .find(filter, { projection: { _id: 0, name: 1 }, maxTimeMS: 5000 })
      .sort({ name: 1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .toArray(),
    collection.countDocuments(filter, { maxTimeMS: 5000 }),
  ])
  return {
    properties: docs.map(doc => ({ name: doc.name as string })),
    page,
    perPage,
    totalCount,
  }
}
export async function suggestions(name: string) {
  return (await properties())
    .find(
      { name: validName(name) },
      {
        projection: { _id: 0, name: 1 },
        collation: { locale: 'en', strength: 1 },
        maxTimeMS: 5000,
      }
    )
    .limit(5)
    .toArray()
}
export async function relatedProperties(name: string) {
  return (await properties())
    .find(
      { name: { $regex: '^' + escapeRegex(validName(name)) + '(?:\\.|\\[)' } },
      { projection: { _id: 0, name: 1 }, maxTimeMS: 5000 }
    )
    .sort({ name: 1 })
    .limit(30)
    .toArray()
}
export async function catalogStats() {
  const collection = await properties()
  return { count: await collection.estimatedDocumentCount() }
}
export async function createIndexes() {
  const collection = await properties()
  await collection.createIndex({ name: 1 }, { unique: true, name: 'name_1' })
  await collection.createIndex(
    { name: 1 },
    { name: 'name_c', collation: { locale: 'en', strength: 1 } }
  )
}
