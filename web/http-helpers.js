var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var http = require('http');
var https = require('https');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {
  // data === html
  var headers = exports.headers;
  headers['Content-Type'] = 'text/html';
  res.writeHead(200, headers);
  res.write(asset);
  res.end();
};


exports.getAssets = function(url, callback) {
  https.get(url, (res) => {
    const statusCode = res.statusCode;
    const contentType = res.headers['content-type'];
    
    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed. \n' + `Status Code: ${statusCode}`);
    } else if (!/^text\/html/.test(contentType)) {
      error = new Error('Invalid content-type. \n' + `Expected text/html but received ${contentType}`); 
    }
    if (error) {
      console.error(error.message);
      res.resume();
      return;
    }
    
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => {
      rawData += chunk;
    });
    res.on('end', () => {
      try {
        fs.writeFile(archive.paths.archivedSites + '/' + url.substring(8), rawData, (err) => {
          if (err) {
            throw err;
          }
          console.log('This file has been saved');
        });
      } catch (e) {
        console.log('error message', e.message);
      }
    });
  }).on('error', (e) => {
    console.log(`Got error: ${e.message}`); 
  });
};






// As you progress, keep thinking about what helper functions you can put here!
