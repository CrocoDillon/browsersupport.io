var fs = require('fs'),
    path = require('path'),
    koa = require('koa'),
    koaBodyParser = require('koa-bodyparser'),
    mongoose = require('mongoose');

var app = koa(),
    config = require('./config/config');

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

// middleware
app.use(koaBodyParser());

// bootstrap routes
require('./config/routes')(app);

// 404 and 500
// TODO

var server = app.listen(app.port, () => {
  console.log('Koa server listening on port ' + server.address().port);
});
