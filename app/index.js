var fs = require('fs'),
    path = require('path'),
    koa = require('koa'),
    koaBodyParser = require('koa-bodyparser'),
    koaStatic = require('koa-static');

var app = koa(),
    config = require('./config/config');

/**
 * Koa setup.
 */

app.port = config.port;

// middleware
app.use(koaBodyParser({ jsonLimit: '2mb' }));

// bootstrap routes
require('./config/routes')(app);

app.use(koaStatic('public'));

// 404 and 500
// TODO

var server = app.listen(app.port, () => {
  console.log('Koa server listening on port ' + server.address().port);
});
