var router = require('koa-router')();

/**
 * Controllers.
 */

var index      = require('../src/controllers/index'),
    browsers   = require('../src/controllers/browsers'),
    properties = require('../src/controllers/properties');

/**
 * Routes.
 */

router.get('/', index.index);

router.get('/browsers', browsers.index);

router.get('/properties', properties.index);
router.post('/properties', properties.create);
router.get('/properties/:name', properties.read);
router.put('/properties/:name', properties.update);
router.patch('/properties/:name', properties.update);
router.delete('/properties/:name', properties.delete);

module.exports = function (app) {
  app.use(router.routes());
  app.use(router.allowedMethods());
};
