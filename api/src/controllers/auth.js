'use strict';

let fs = require('fs'),
    path = require('path'),
    mongoose = require('mongoose'),
    jwt = require('jsonwebtoken');

let User = mongoose.model('User');

let secret = fs.readFileSync(path.join(__dirname, '../../secret'));

exports.token = function *(next) {
  let name = this.request.body.username,
      password = this.request.body.password;

  yield User.findOne({ name }).then((user) => {
    if (user) {
      return User.validatePassword(password, user.hash).then((valid) => {
        if (valid) {
          let token = jwt.sign({
            name: user.name,
            roles: user.roles
          }, secret);
          this.body = { token };
        } else {
          this.throw(401);
        }
      });
    } else {
      this.throw(401);
    }
  });
};

exports.admin = function *(next) {
  let authorization = this.header.authorization,
      admin = false;

  if (authorization) {
    authorization = authorization.split(/\s/);

    if (authorization.length === 2) {
      let scheme = authorization[0],
          token = authorization[1];

      try {
        let verified = jwt.verify(token, secret, { algorithms: ['HS256'] });

        if (~verified.roles.indexOf('admin')) {
          admin = true;
        }
      } catch (e) {}
    }
  }

  if (admin) {
    yield next;
  } else {
    this.throw(401);
  }
};

exports.drop = function *(next) {
  this.throw(403);
};
