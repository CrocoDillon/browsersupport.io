'use strict';

let mongoose = require('mongoose');

/**
 * Models.
 */

let Property = mongoose.model('Property');

/**
 * Route handlers.
 */

exports.index = function *(next) {
  yield Property.find().limit(20).then((properties) => {
    this.body = properties;
  });
};

exports.create = function *(next) {
  let properties = this.request.body,
      options = {
        ordered: false // gives us continue on (duplicate key) error
      };

  if (!Array.isArray(properties)) {
    properties = [properties];
  }

  yield Property.collection.count().then((beforeCount) => {
    return Property.collection.insertMany(properties, options).then((result) => {
      return Property.collection.count();
    }, (err) => {
      // ignore error code 11000, which is a duplicate key error
      if (err.code === 11000) {
        return Property.collection.count();
      }
      // re-throw any other errors
      throw err;
    }).then((afterCount) => {
      let inserted = afterCount - beforeCount,
          total = properties.length;

      this.status = inserted === 0 ? 200 : 201;
      this.body = {
        message: `Inserted ${inserted} out of ${total} properties.`,
        inserted,
        total
      };
    });
  });
};

exports.read = function *(next) {
  let name = this.params.name;

  yield Property.findOne({ name }).then((property) => {
    if (property) {
      this.body = property;
    } else {
      this.status = 404;
    }
  });
};

exports.update = function *(next) {
  let name = this.params.name,
      requestBody = this.request.body;

  yield Property.findOne({ name }).then((property) => {
    if (property) {
      return Promise.resolve().then(() => {
        switch (this.method) {
        case 'PUT':
          return property.update(requestBody);
          break;
        case 'PATCH':
          return property.patch(requestBody);
          break;
        }
      }).then(() => {
        return Property.findOne({ name });
      }).then((property) => {
        // return the updated resource
        this.body = property;
      });
    } else {
      this.status = 404;
    }
  });
};

exports.delete = function *(next) {
  this.status = 405;
};
