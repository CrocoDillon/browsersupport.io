import { database, catalogStats, findProperty } from '../src/database.ts'
await (await database()).command({ ping: 1 })
console.log(
  JSON.stringify({
    ...(await catalogStats()),
    trimStart: Boolean(await findProperty('String.prototype.trimStart')),
  })
)
process.exit(0)
