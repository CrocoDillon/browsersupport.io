require('dotenv').config()

const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const serve = require('koa-static')

const database = require('./database')
const views = require('./views')

const usage = require('../../alt-ww.json')

const app = new Koa()
const router = new Router()

app.use(bodyParser({ formLimit: '2mb' }))

router.get('/', ctx => {
  ctx.body = views.render('index')
})

router.get('/detect', ctx => {
  const ua = ctx.headers['user-agent']

  ctx.body = views.render('detect-1', {
    ua,
    browsers: Object.keys(usage.data)
      .map(browser => `<li><a href="/detect/${browser}">${browser}</a></li>`)
      .join('\n    '),
  })
})

router.get('/detect/:browser', ctx => {
  const ua = ctx.headers['user-agent']
  const { browser } = ctx.params

  ctx.body = views.render('detect-2', {
    ua,
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
  const ua = ctx.headers['user-agent']
  const { browser, version } = ctx.params

  const remaining = await database.countProperties(browser, version)
  const total = await database.countProperties()

  const view = remaining > 0 ? 'detect-3' : 'detect-4'

  ctx.body = views.render(view, {
    ua,
    browser,
    version,
    remaining,
    total,
  })
})

// router.post('/detect/:browser/:version', ctx => {
//   const { browser, version } = ctx.params

//   if (ctx.request.body.secret !== process.env.SECRET) {
//     ctx.body = views.render('detect')
//     return
//   }

//   ctx.body = views.render('detect-success')
// })

router.get('/scrape', ctx => {
  ctx.body = views.render('scrape')
})

router.post('/scrape', async ctx => {
  if (ctx.request.body.secret !== process.env.SECRET) {
    ctx.body = views.render('scrape')
    return
  }

  const properties = JSON.parse(ctx.request.body.properties)

  await database.addProperties(properties)

  ctx.body = views.render('scrape-success')
})

app.use(router.routes())
app.use(router.allowedMethods())

app.use(serve('public'))

const server = app.listen(process.env.PORT, () => {
  console.log('Koa server listening on port ' + server.address().port)
})
