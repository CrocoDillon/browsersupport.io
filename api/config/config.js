module.exports = {
  test: {
    port: process.env.PORT || '3000',
    db: 'mongodb://db:27017/test'},
  development: {
    port: process.env.PORT || '3000',
    db: 'mongodb://db:27017/test'},
  production: {
    port: process.env.PORT || '3000',
    db: 'mongodb://db:27017/browsersupport'
  }
};
