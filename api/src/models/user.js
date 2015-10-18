var mongoose = require('mongoose'),
    bcrypt = require('bcrypt');

var Schema = mongoose.Schema,
    BCRYPT_SALT_ROUNDS = 10;

/**
 * User Schema.
 */

var UserSchema = new Schema({
      name: { type: String, required: true, unique: true },
      hash: { type: String, required: true },
      created: { type: Date, default: Date.now },
      roles: [String]
    });

/**
 * Statics.
 */

UserSchema.statics.encryptPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, BCRYPT_SALT_ROUNDS, (err, hash) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
};

UserSchema.statics.validatePassword = (password, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, valid) => {
      if (err) {
        reject(err);
      } else {
        resolve(valid);
      }
    });
  });
};

mongoose.model('User', UserSchema, 'users');
