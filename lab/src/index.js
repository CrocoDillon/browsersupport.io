require('dotenv').config()

const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const serve = require('koa-static')

const database = require('./database')
const views = require('./views')

const app = new Koa()
const router = new Router()

app.use(bodyParser({ formLimit: '2mb' }))

router.get('/', ctx => {
  ctx.body = views.render('index')
})

router.get('/detect', ctx => {
  ctx.body = views.render('detect')
})
router.post('/detect', ctx => {
  if (ctx.request.body.secret !== process.env.SECRET) {
    ctx.body = views.render('detect')
    return
  }

  ctx.body = views.render('success', {
    url: '/detect',
    label: 'Detect',
  })
})

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

  ctx.body = views.render('success', {
    url: '/scrape',
    label: 'Scrape',
  })
})

app.use(router.routes())
app.use(router.allowedMethods())

app.use(serve('public'))

const server = app.listen(process.env.PORT, () => {
  console.log('Koa server listening on port ' + server.address().port)
})
