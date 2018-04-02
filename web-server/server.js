require('dotenv').config()

const Koa = require('koa')
const Router = require('koa-router')
const next = require('next')
const httpProxy = require('http-proxy')

const proxy = httpProxy.createProxyServer()

const app = next({ dev: process.env.NODE_ENV !== 'production' })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  router.get('/api/*', ctx => {
    return new Promise(resolve => {
      ctx.req.url = ctx.req.url.replace(/^\/api/, '')

      proxy.web(ctx.req, ctx.res, { target: process.env.API_URL }, e => {
        const status = {
          ECONNREFUSED: 503,
          ETIMEOUT: 504,
        }[e.code]

        if (status) ctx.status = status

        resolve()
      })
    })
  })

  router.get('/', async ctx => {
    await app.render(ctx.req, ctx.res, '/index', ctx.query)
    ctx.respond = false
  })

  router.get('/sitemap', async ctx => {
    await app.render(ctx.req, ctx.res, '/sitemap', ctx.query)
    ctx.respond = false
  })

  router.get('/:name', async ctx => {
    const { name } = ctx.params
    const query = {
      ...ctx.query,
      name,
    }

    await app.render(ctx.req, ctx.res, '/property', query)
    ctx.respond = false
  })

  router.get('*', async ctx => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.use(async (ctx, next) => {
    ctx.status = 200
    await next()
  })

  server.use(router.routes())
  server.use(router.allowedMethods())

  server.listen(process.env.PORT, () => {
    console.log(`Web server listening on port ${process.env.PORT}`)
  })
})
