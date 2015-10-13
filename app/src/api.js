'use strict';

let http = require('http');

let config = require('../config/config'),
    protocol = config.api.protocol,
    hostname = config.api.hostname,
    port = config.api.port;

exports.request = function (method, path, body, headers) {
  headers = headers || {};
  Object.assign(headers, {
    'Accept': 'application/json'
  });
  return new Promise((resolve, reject) => {
    if (body) {
      body = JSON.stringify(body);
      Object.assign(headers, {
        'Content-Type': 'application/json',
        'Content-Length': body.length
      });
    }

    let data = '',
        request = http.request({
          method,
          protocol,
          hostname,
          port,
          path,
          headers
        }, (response) => {
          response.setEncoding('utf8');
          response.on('data', (chunk) => {
            data += chunk;
          });
          response.on('end', () => {
            data = JSON.parse(data);
            resolve(data);
          });
        });
    request.on('error', (e) => {
      reject(e);
    });
    request.write(body);
    request.end();
  });
};
