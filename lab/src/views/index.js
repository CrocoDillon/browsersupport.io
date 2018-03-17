const fs = require('fs')
const glob = require('glob')
const path = require('path')

const views = glob
  .sync('*.html', {
    cwd: __dirname,
  })
  .reduce((views, name) => {
    const view = name.replace(/\.html$/, '')
    const file = path.join(__dirname, name)

    views[view] = fs.readFileSync(file, {
      encoding: 'utf8',
    })

    return views
  }, {})

const render = (view, params) =>
  views[view].replace(
    /{{(\w+?)}}/g,
    (match, name) => (name in params ? params[name] : match)
  )

module.exports = {
  render,
}
