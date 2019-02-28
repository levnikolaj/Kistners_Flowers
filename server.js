// no funny buisness
"use strict";

// TODO: JSDoc format above every function

/* require statements */
var http = require('http');
var fs = require('fs');
var recipes = require('./src/recipes');
var serve404 = require('./src/serve-404');

/* global variables */
var port = 2000;

/* prints the requested number of flower recipes from ./data/recipes.json */
// console.log(recipes.featured(10));

var homepage = fs.readFileSync('Kistners_HomePage.html', {encoding: "utf-8"});

var stylesheet = fs.readFileSync("public/css/Kistners_CSS_Template.css", function(err, html){
  if(err){
    console.error(err);
  }
});

var server = http.createServer(function(req, res){
  switch(req.url){
    case '/':
    case '/Kistners_HomePage.html':
      serveCachedHomepage(req, res);
      break;
    case '/Kistners_CSS_Template.css':
      serveCachedStylesheet(req, res);
      break;
    default:
      serveImage(req.url, req, res);
  }
});

server.listen(port, function(){
  console.log("Server is listening on port", port);
});

function serveCachedStylesheet(req, res){
  res.setHeader('Content-Type', 'text/css');
  res.end(stylesheet);
}

function serveCachedHomepage(req, res){
  res.setHeader('Content-Type', 'text/html');
  res.end(homepage.replace('%1', generateCardHTML()));
}

function serveImage(filename, req, res){
  fs.readFile('public/img/' + filename, function(err, data){
    if(err){
      //serve404(req,res);

      res.statusCode = 404;
      res.statusMessage = "Not Found";
      res.end("Not Found");
      return;

    }
    res.setHeader("Content-Type", "image/jpeg");
    res.end(data);
  });
}

function generateCardHTML(){
  var allFlowers = recipes.featured(10);
  return allFlowers.map(function(data) {
    return `<div class="flower_box">
              <img class="flower" src="${data["images"][0]}" alt="some_flower">
              <p class="flower">${data.name}</p>
              <p class="flower">${data.price}</p>
            </div>`;
  }).join('');
}
