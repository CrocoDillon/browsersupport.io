'use strict';

let mongoose = require('mongoose');

/**
 * Models.
 */

let User = mongoose.model('User');

/**
 * Route handlers.
 */

exports.index = function *(next) {
  yield User.find({}, { hash: 0 }).limit(20).then((users) => {
    this.body = users;
  });
};

exports.create = function *(next) {
  let name = this.request.body.username,
      password = this.request.body.password;

  yield User.encryptPassword(password).then((hash) => {
    let user = new User({ name, hash });
    return user.save();
  }).then(() => {
    return User.findOne({ name });
  }).then((user) => {
    this.body = user;
  });
};

exports.read = function *(next) {
  let name = this.params.name;

  yield User.findOne({ name }, { hash: 0 }).then((user) => {
    if (user) {
      this.body = user;
    } else {
      this.throw(404);
    }
  });
};

exports.update = function *(next) {
  this.throw(405);
};

exports.delete = function *(next) {
  this.throw(405);
};
