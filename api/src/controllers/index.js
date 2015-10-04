/**
 * Route handlers.
 */

exports.index = function *(next) {
  this.body = {
    message: 'Hi!'
  };
};
