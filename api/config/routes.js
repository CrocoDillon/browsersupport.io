'use strict';

var router = require('koa-router')();

/**
 * Controllers.
 */

var index      = require('../src/controllers/index'),
    auth       = require('../src/controllers/auth'),
    browsers   = require('../src/controllers/browsers'),
    users      = require('../src/controllers/users'),
    properties = require('../src/controllers/properties');

/**
 * Public routes.
 */

router.get('/', index.index);

router.post('/token', auth.token);

router.post('/users', users.create);

router.get('/properties', properties.index);
router.get('/properties/:name', properties.read);

/**
 * Authenticated routes.
 */

router.get('/users', auth.admin, users.index);
router.get('/users/:name', auth.admin, users.read);

router.post('/properties', auth.admin, properties.create);
router.put('/properties/:name', auth.admin, properties.update);
router.patch('/properties/:name', auth.admin, properties.update);

/**
 * Unused routes.
 */

router.get('/browsers', auth.drop, browsers.index);

router.put('/users/:name', auth.drop, users.update);
router.patch('/users/:name', auth.drop, users.update);
router.delete('/users/:name', auth.drop, users.delete);

router.delete('/properties/:name', auth.drop, properties.delete);

module.exports = function (app) {
  app.use(router.routes());
  app.use(router.allowedMethods());
};
