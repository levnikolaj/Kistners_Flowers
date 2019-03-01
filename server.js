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
var stylesheet = fs.readFileSync("public/css/Kistners_CSS_Template.css");
var wedding = fs.readFileSync("src/Wedding_Page.html", {encoding: "utf-8"});
var birthday = fs.readFileSync("src/Birthday_Page.html", {encoding: "utf-8"});
var about_us = fs.readFileSync("src/AboutUs_Page.html", {encoding: "utf-8"});

var server = http.createServer(function(req, res){
  switch(req.url){
    case '/':
    case '/Kistners_HomePage.html':
      serveCachedHomepage(req, res);
      break;
    case '/Kistners_CSS_Template.css':
      serveCachedStylesheet(req, res);
      break;
    case '/Wedding_Page.html':
      res.setHeader('Content-Type', 'text/html');
      res.end(wedding.replace('%1', generateCardHTML(6,9)));
      break;
    case '/Birthday_Page.html':
      res.setHeader('Content-Type', 'text/html');
      res.end(birthday.replace('%1', generateCardHTML(1,4)));
      break;
    case '/AboutUs_Page.html':
      res.setHeader('Content-Type', 'text/html');
      res.end();
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
  var temp_homepage = homepage.replace('%1', generateCardHTML(0,3));
  temp_homepage = temp_homepage.replace('%2', generateCardHTML(3,6));
  res.end(temp_homepage);
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

function generateCardHTML(first, second){
  var allFlowers = recipes.featured(10);
  return allFlowers.slice(first, second).map(function(data) {
    return `<div class="flower_box">
              <img class="flower" src="${data["images"][0]}" alt="some_flower">
              <p class="flower">${data.name}</p>
              <p class="flower">${data.price}</p>
            </div>`;
  }).join('');
}
