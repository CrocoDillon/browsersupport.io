'use strict';

let api = require('../api');

/**
 * Route handlers.
 */

exports.scrape = function *(next) {
  switch (this.method) {
    case 'GET':
      this.body = `\
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Scraping this browser...</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body>
    <script src="/js/scrape.js"></script>
    <script src="/js/vendor/json2.js"></script>
    <script src="/js/vendor/jquery.js"></script>
    <script>window.sendDataToServer();</script>
  </body>
</html>`;
      break;
    case 'POST':
      let properties = this.request.body || [];
      yield api.request('POST', '/properties', properties).then((response) => {
        this.body = `Stored ${response.inserted} new (out of ${response.total} total) properties! :)`;
      });
      break;
  }
};

exports.detect = function *(next) {
  this.body = 'Not yet implemented :(';
};
