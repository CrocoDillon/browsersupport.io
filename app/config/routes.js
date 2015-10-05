var router = require('koa-router')();

/**
 * Controllers.
 */

var index           = require('../src/controllers/index'),
    scrapeAndDetect = require('../src/controllers/scrapeAndDetect');

/**
 * Routes.
 */

router.get('/', index.index);

router.get('/scrape', scrapeAndDetect.scrape);
router.post('/scrape', scrapeAndDetect.scrapePost);
router.get('/detect', scrapeAndDetect.detect);

module.exports = function (app) {
  app.use(router.routes());
  app.use(router.allowedMethods());
};
