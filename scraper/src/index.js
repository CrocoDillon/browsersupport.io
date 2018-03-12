const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')
const serve = require('koa-static')

const app = new Koa()
const router = new Router()

app.use(bodyParser({ jsonLimit: '2mb' }))

router.post('/', ctx => {
  const file = path.join(__dirname, '../result.json')

  let result = fs.readFileSync(file, { encoding: 'utf8' })
  result = JSON.parse(result)
  result = result.concat(ctx.request.body)
  result = new Set(result) // Remove duplicates
  result = Array.from(result)
  result.sort()

  fs.writeFileSync(file, JSON.stringify(result, null, 2), {
    encoding: 'utf8',
  })

  ctx.body = 'Done!'
})

app.use(router.routes())
app.use(router.allowedMethods())

app.use(serve('public'))

const server = app.listen(3000, () => {
  console.log('Koa server listening on port ' + server.address().port)
})
