import Koa from 'koa'
import Router from 'koa-router'

import './database'

import Property from './models/property'

const server = new Koa()
const router = new Router()

router.get('/properties', async ctx => {
  const { q } = ctx.query
  const query = q ? { $text: { $search: q } } : {}

  const [properties, count] = await Promise.all([
    Property.find(query)
      .limit(10)
      .exec(),
    Property.count(query).exec(),
  ])

  ctx.body = { properties, count }
})

router.get('/properties/:name', async ctx => {
  const { name } = ctx.params

  const property = await Property.findOne({ name }).exec()

  if (property === null) {
    // Case insensitive query (making use of collation index)
    const suggestions = await Property.find({ name })
      .collation({ locale: 'en', strength: 1 })
      .exec()

    // Even though property is null and suggestion may be empty,
    // return them anyway
    ctx.body = { property, suggestions }
  } else {
    ctx.body = { property }
  }
})

server.use(router.routes())
server.use(router.allowedMethods())

server.listen(process.env.PORT, () => {
  console.log(`Api server listening on port ${process.env.PORT}`)
})
