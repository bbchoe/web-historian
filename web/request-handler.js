const path = require('path');
const archive = require('../helpers/archive-helpers');
const fs = require('fs');
// require more modules/folders here!

const defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'accept-charset': 'utf-8'
};

let headers = defaultCorsHeaders;

exports.handleRequest = function (req, res) {
  console.log('SERVING TYPE', req.method, 'FROM URL', req.url);
  
  if (req.method === 'GET') {
    if (req.url === '/') {
  // if GET request for index.html, then do stuff to send back index.html
      fs.readFile(archive.paths.siteAssets + '/index.html', 'utf8', (err, data) => {
        if (err) { 
          throw err; 
        }
        // package up a response
        headers['Content-Type'] = 'text/html';
        res.writeHead(200, headers);
        res.write(data);
        res.end();
      });
    } else {
      res.writeHead(404, headers);
      res.end();
    }
  } else if (req.method === 'POST') {
    let url = '';
    req.on('data', (chunk) => {
      url += chunk;
    });
    req.on('end', () => {
      url = url.slice(4);
      // figure out a way to append URL into the sites.txt
      archive.addUrlToList(url);
      res.writeHead(302, headers);
      res.end();
    });
  }
  
  // res.end(archive.paths.list);
};
