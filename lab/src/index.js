require('dotenv').config()

const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const serve = require('koa-static')
const Parser = require('ua-parser-js')

const database = require('./database')
const views = require('./views')

const usage = require('../../alt-ww.json')

const app = new Koa()
const router = new Router()

const parseUseragent = ctx => {
  const useragent = ctx.headers['user-agent']
  const { name, version } = new Parser(useragent).getBrowser()

  return {
    useragent,
    browserName: name,
    browserVersion: version,
  }
}

app.use(bodyParser({ formLimit: '2mb', jsonLimit: '2mb' }))

router.get('/', ctx => {
  ctx.body = views.render('index')
})

router.get('/detect', ctx => {
  ctx.body = views.render('detect-1', {
    ...parseUseragent(ctx),
    browsers: Object.keys(usage.data)
      .map(browser => `<li><a href="/detect/${browser}">${browser}</a></li>`)
      .join('\n    '),
  })
})

router.get('/detect/:browser', ctx => {
  const { browser } = ctx.params

  ctx.body = views.render('detect-2', {
    ...parseUseragent(ctx),
    browser,
    versions: Object.keys(usage.data[browser])
      .map(
        version =>
          `<li><a href="/detect/${browser}/${version}">${version}</a></li>`
      )
      .join('\n    '),
  })
})

router.get('/detect/:browser/:version', async ctx => {
  const { browser, version } = ctx.params

  const remaining = await database.countProperties(browser, version)
  const total = await database.countProperties()

  const view = remaining > 0 ? 'detect-3' : 'detect-4'

  ctx.body = views.render(view, {
    ...parseUseragent(ctx),
    browser,
    version,
    remaining,
    total,
  })
})

router.get('/scrape', ctx => {
  ctx.body = views.render('scrape')
})

router.post('/scrape', async ctx => {
  if (ctx.request.body.secret !== process.env.SECRET) {
    ctx.status = 401
    ctx.body = views.render('scrape')
    return
  }

  const properties = JSON.parse(ctx.request.body.properties)

  await database.addProperties(properties)

  ctx.body = views.render('scrape-success')
})

router.get('/api/:browser/:version/properties', async ctx => {
  const { browser, version } = ctx.params

  const properties = await database.getProperties(browser, version)

  ctx.body = properties.map(({ name }) => name)
})

router.post('/api/:browser/:version/properties', async ctx => {
  if (ctx.request.body.secret !== process.env.SECRET) {
    ctx.status = 401
    return
  }

  const { browser, version } = ctx.params
  const { properties } = ctx.request.body

  await database.updateProperties(browser, version, properties)

  ctx.status = 204
})

app.use(router.routes())
app.use(router.allowedMethods())

app.use(serve('public'))

const server = app.listen(process.env.PORT, () => {
  console.log('Koa server listening on port ' + server.address().port)
})
