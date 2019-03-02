// no funny buisness
"use strict";

/* require statements */
var http = require('http');
var fs = require('fs');
var recipes = require('./src/recipes');
var serve404 = require('./src/serve-404');

/* global variables */
var port = 2000;

/* Cached html & style sheet pages */
var homepage = fs.readFileSync('Kistners_HomePage.html', {encoding: "utf-8"});
var stylesheet = fs.readFileSync("public/css/Kistners_CSS_Template.css");
var wedding = fs.readFileSync("src/Wedding_Page.html", {encoding: "utf-8"});
var birthday = fs.readFileSync("src/Birthday_Page.html", {encoding: "utf-8"});
var about_us = fs.readFileSync("src/AboutUs_Page.html", {encoding: "utf-8"});
var daily_exp = fs.readFileSync("src/DailyExpression_Page.html", {encoding: "utf-8"});
var gardner = fs.readFileSync("src/GardenParadise_Page.html", {encoding: "utf-8"});
var new_baby = fs.readFileSync("src/NewBaby_Page.html", {encoding: "utf-8"});

/* Creates the server. Will respond to incoming requests. */
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
      res.end(about_us);
      break;
    case '/DailyExpression_Page.html':
      res.setHeader('Content-Type', 'text/html');
      res.end(daily_exp);
      break;
    case '/GardenParadise_Page.html':
      res.setHeader('Content-Type', 'text/html');
      res.end(gardner);
      break;
    case '/NewBaby_Page.html':
      res.setHeader('Content-Type', 'text/html');
      var temp_baby = new_baby.replace('%1', generateCardHTML(0,1));
      temp_baby = temp_baby.replace('%2', generateCardHTML(2,3));
      res.end(temp_baby);
      break;
    default:
      serveImage(req.url, req, res);
  }
});

/* Server call to listen to the port defined above. */
server.listen(port, function(){
  console.log("Server is listening on port", port);
});

/** @function serveCachedStylesheet
 * Function is called when the stylesheet is requested by
 * page.
 * @param {http.IncomingRequest} req - the request object
 * @param {http.ServerRespone} res - the response object
 */
function serveCachedStylesheet(req, res){
  res.setHeader('Content-Type', 'text/css');
  res.end(stylesheet);
}

/** @function serveCachedHomepage
 * Serves the cached homapage file. Inserts into special
 * characters the return from generateCardHTML.
 * @param {http.IncomingRequest} req - the request object
 * @param {http.ServerRespone} res - the response object
 */
function serveCachedHomepage(req, res){
  res.setHeader('Content-Type', 'text/html');
  var temp_homepage = homepage.replace('%1', generateCardHTML(0,3));
  temp_homepage = temp_homepage.replace('%2', generateCardHTML(3,6));
  res.end(temp_homepage);
}

/** @function serveImage
 * Functon is called when an image is requested.
 * Function returns the image data.
 * @param {ImageRequest} filename - image filename
 * @param {http.IncomingRequest} req - the request object
 * @param {http.ServerRespone} res - the response object
 */
function serveImage(filename, req, res){
  fs.readFile('public/img/' + filename, function(err, data){
    if(err){
      res.statusCode = 404;
      res.statusMessage = "Not Found";
      res.end("Not Found");
      return;
    }
    res.setHeader("Content-Type", "image/jpeg");
    res.end(data);
  });
}

/** @function generateCardHTML
 * Function is called when wanting to display flower on the page.
 * The return from this should be insert into the html page requesting
 * the flowers.
 * @param {integer} first - starting index of flowers to display
 * @param {integer} second - ending index of flowers to dispolay
 */
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
