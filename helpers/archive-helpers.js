var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');
var httpHelpers = require(path.join(__dirname, '../web/http-helpers.js'));

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    let urlArray = data.split('\n');
    callback(urlArray);
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls((array) => {
    callback(array.includes(url));
  });
};

exports.addUrlToList = function(url, callback) {
  // true or a false depending on if its in the archive
  // send them to
    // load page
    // requested page
  fs.appendFile(exports.paths.list, url + '\n', 'utf8', function (err) {
    if (err) {
      console.log(err);
    } else {
      if (callback !== undefined) {  
        callback();
      }                
    }
  });    
};

exports.isUrlArchived = function(url, callback) {
  let isInFolder = fs.existsSync(exports.paths.archivedSites + '/' + url);
  callback(isInFolder);
};

exports.downloadUrls = function(urls) {
  // urls = ['wwww.amazon.com', 'www.google.com', 'www.yahoo.com', 'www.yelp.com'];
  for (let i = 0; i < urls.length; i++) {
    httpHelpers.getAssets('https://' + urls[i]);
  }
};

exports.pullAssets = function(url, res, callback) {
  exports.isUrlArchived(url, (boolean) => {
    if (boolean) {
      fs.readFile(exports.paths.archivedSites + '/' + url, 'utf8', (err, data) => {
        if (err) { 
          throw err; 
        }
        httpHelpers.serveAssets(res, data, callback);
        // res.writeHead(200, headers);
        // res.write(data);
        // res.end();      
      });    
    } else {
      // adding to sites.txt if doesnt exist
      exports.addUrlToList(url);      
      fs.readFile(exports.paths.siteAssets + '/loading.html', 'utf8', (err, data) => {
        if (err) { 
          throw err; 
        }
        res.writeHead(302, httpHelpers.headers);
        res.write(data);
        res.end();
      });
    }
  });
};



