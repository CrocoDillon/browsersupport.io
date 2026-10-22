import { createIndexes } from '../src/database.ts'
await createIndexes()
console.log('Property indexes are ready')
process.exit(0)
