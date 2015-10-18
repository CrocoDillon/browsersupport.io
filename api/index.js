'use strict';

var fs = require('fs'),
    path = require('path'),
    koa = require('koa'),
    koaBodyParser = require('koa-bodyparser'),
    mongoose = require('mongoose'),
    httpStatus = require('http-status');

var app = koa(),
    config = require('./config/config')[app.env];

/**
 * Mongoose setup.
 */

// mongoose db connection
function connect() {
  mongoose.connect(config.db, {
    server: {
      socketOptions: {
        keepAlive: 1
      }
    }
  });
}
connect();
mongoose.connection.on('error', (err) => {
  console.error('Mongoose error: ', err);
});
mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose disconnected... reconnecting!');
  connect();
});

// bootstrap models
var models = path.join(__dirname, 'src', 'models');
fs.readdirSync(models).forEach((file) => {
  if (~file.indexOf('.js'))
    require(path.join(models, file));
});

/**
 * Koa setup.
 */

app.port = config.port;

// 404 and 500
app.use(function *(next) {
  try {
    yield next;
  } catch (e) {
    let status = e.status || httpStatus.INTERNAL_SERVER_ERROR,
        body = {
          error: httpStatus[status] || true
        };
    if (app.env === 'development' && e.message && e.message !== body.error) {
      body.message = e.message;
    }
    this.status = status
    this.body = body;
    // emit error for centralized logging
    this.app.emit('error', e, this);
  }
});

// middleware
app.use(koaBodyParser({ jsonLimit: '2mb' }));

// bootstrap routes
require('./config/routes')(app);

var server = app.listen(app.port, () => {
  console.log(`Koa ${app.env} server listening on port ${server.address().port}`);
});
