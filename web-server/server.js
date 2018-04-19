require('dotenv').config()

const http = require('http')
const { URL } = require('url')

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

  let sitemap = null

  router.get('/sitemap.txt', async ctx => {
    if (sitemap === null) {
      sitemap = new Promise((resolve, reject) => {
        const options = new URL(process.env.API_URL)
        options.pathname = '/properties/stream'

        const req = http.request(options, res => {
          let data = 'https://browsersupport.io/\n'

          res.setEncoding('utf8')

          res.on('data', chunk => {
            try {
              const property = JSON.parse(chunk.toString('utf8'))

              data += `https://browsersupport.io/${property.name}\n`
            } catch (e) {
              reject(e)
            }
          })

          res.on('error', e => {
            reject(e)
          })

          res.on('end', () => {
            resolve(data)
          })
        })

        req.on('error', e => {
          reject(e)
        })

        req.end()
      })
    }

    try {
      ctx.body = await sitemap
    } catch (e) {
      sitemap = null
      ctx.status = 500
    }
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
