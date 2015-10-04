var mongoose = require('mongoose');

/**
 * Models.
 */

var Property = mongoose.model('Property');

/**
 * Route handlers.
 */

exports.index = function *(next) {
  yield new Promise((resolve, reject) => {
    Property.find((err, properties) => {
      if (err) {
        reject(err);
        return;
      }

      this.body = properties;
      resolve();
    });
  });
};

exports.create = function *(next) {
  yield new Promise((resolve, reject) => {
    var names = this.request.body.names || [this.request.body.name],
        properties = names.filter((name) => {
          return typeof name === 'string' && name.length > 0;
        }).map((name) => {
          return { name };
        }),
        options = {
          ordered: false // gives us continue on (duplicate key) error
        };

    Property.collection.insertMany(properties, options, (err, result) => {
      var inserted,
          total;

      if (err && err.code !== 11000) {
        // ignore error code 11000, which is a duplicate key error
        reject(err);
        return;
      }

      inserted = typeof result.insertedCount === 'number' ? result.insertedCount : result.nInserted;
      total = properties.length;

      this.body = {
        message: `Inserted ${inserted} out of ${total} properties.`,
        inserted,
        total
      };
      resolve();
    });
  });
};

exports.read = function *(next) {
  yield new Promise((resolve, reject) => {
    Property.findOne({ name: this.params.name }, (err, property) => {
      if (err) {
        reject(err);
        return;
      }

      if (!property) {
        this.body = {
          error: 'Not found... this should be a 404'
        };
      } else {
        this.body = property;
      }
      resolve();
    });
  });
};

exports.update = function *(next) {
  this.body = {
    message: 'Not yet implemented :('
  };
};

exports.delete = function *(next) {
  this.body = {
    message: 'Not yet implemented :('
  };
};
