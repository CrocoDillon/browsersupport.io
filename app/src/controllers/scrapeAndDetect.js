var http = require('http');

var config = require('../../config/config'),
    api = config.api;

/**
 * Route handlers.
 */

exports.scrape = function *(next) {
  this.body = `\
<html>
  <head>
    <meta charset="utf-8">
    <title>Scraping this browser...</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body>
    <script src="/js/scrape.js"></script>
    <script src="/js/json2.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
    <script>window.sendDataToServer();</script>
  </body>
</html>`;
};

exports.scrapePost = function *(next) {
  var properties = this.request.body || [],
      data = JSON.stringify(properties);
  yield new Promise((resolve, reject) => {
    var result = '',
        request = http.request({
          method: 'POST',
          protocol: api.protocol,
          hostname: api.hostname,
          port: api.port,
          path: '/properties',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
          }
        }, (response) => {
          response.setEncoding('utf8');
          response.on('data', (chunk) => {
            result += chunk;
          });
          response.on('end', () => {
            result = JSON.parse(result);
            this.body = `Stored ${result.inserted} new (out of ${result.total} total) properties! :)`;
            resolve();
          })
        });
    request.on('error', function(e) {
      reject(e);
    });
    request.write(data);
    request.end();
  });
};

exports.detect = function *(next) {
  this.body = 'Not yet implemented :(';
};
