
/** @function serve404
 * Helper function for serving 404 error code
 * @param {http.IncomingRequest} req - the request object
 * @param {http.ServerRespone} res - the response object
 */
function serve404(req, res){
  console.warn("404 Not Found", req.method, req.url);
  res.statusCode = 404;
  res.statusMessage = "Not Found";
  res.end();
}

// export serve404
module.export = serve404;
