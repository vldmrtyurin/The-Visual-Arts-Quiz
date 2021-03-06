'use strict';

var express = require('express');
var app = module.exports = express();
var fs = require('fs');
var path = require('path');
var imgPath = path.resolve(__dirname + '/../../public/img/');

app.get('/images-api', function(req, res) {
  scanFolder(imgPath, function(err, data) {
    res.send(data);
  });
});

function scanFolder(dir, callback) {
  var results = [];

  fs.readdir(dir, function(err, list) {
    var pending = list.length;
    if (!pending) {
      return callback(null, results);
    }

    list.forEach(function(file) {
      console.log('for file: ' + file);
      file = path.resolve(dir, file);
      console.log('make newImgPath: ' + file);

      fs.stat(file, function(err, stats) {
        if (stats && stats.isDirectory()) {
          scanFolder(file, function(err, res) {
            res.forEach(function(item) {
              var author = path.basename(item, '.jpg', '.jpeg', '.png', '.bmp');
              var author = author.replace(/_.+/, '');
              var temp = {
                text: author,
                href: '/img/' + path.basename(file) + '/' + path.basename(item)
              }
              results.push(temp);
            });
            if (!--pending) {
            callback(null, results);
            }
          });

        } else {
          results.push(file);
          if (!--pending) {
            callback(null, results);
          }
        }
      });
    });
  });
}
