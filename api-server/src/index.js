import Koa from 'koa'
import Router from 'koa-router'

import './database'

import Property from './models/property'

const server = new Koa()
const router = new Router()

// TODO: Limit the maximum page for search queries because they eat RAM
const safePositiveIntegerRe = /^[1-9][0-9]{0,12}$/

router.get('/properties', async ctx => {
  const { q, page: sPage } = ctx.query

  const query = q ? { $text: { $search: JSON.stringify(q) } } : {}
  const page = safePositiveIntegerRe.test(sPage) ? parseInt(sPage, 10) : 1
  const perPage = 30

  const [properties, totalCount] = await Promise.all([
    Property.find(query, { name: 1 })
      .sort({ name: 1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .exec(),
    Property.count(query).exec(),
  ])

  ctx.body = { properties, page, perPage, totalCount }
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
