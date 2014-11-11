var Q = require('q');

module.exports = function(params) {
  var module = {};

  module.verbose = params.verbose;

  module.client = params.client;

  module.apikey = params.apikey;

  module.baseUrl = params.baseUrl;

  /*
  GET /help/ping
  Answers "pong" if server is available.

  todo: error codes DK
   */
  module.ping = function() {
    return Q.Promise(function(resolve, reject, notify) {

      var args = {
        headers: { "Content-Type": "application/xml", "Authorization": 'Basic ' + module.apikey }
      };
      var url = module.baseUrl + '/help/ping';
      if (module.verbose) {
        console.log('GET ' + url + ' ...');
      }
      module.client.get(url, args, function(data, response) {

        if (response.statusCode === 401) {
          reject("401 - API key required");
          return;
        } else if (response.statusCode !== 200) {
          reject(response.statusCode + " - Something went wrong... :-(");
          return;
        }
        resolve(data);

      });

    });
  };

  /*
   GET /help/ping_dependencies
   Returns code 200 (OK) if all backend systems are available and 503 (Service not available) if any system could not be contacted.
   */
  module.ping_dependencies = function() {
//    todo:
  };

  /*
   GET /help/version
   Returns server version information and other metadata attributes.
   */
  //todo IL
  module.version = function() {
    return Q.Promise(function(resolve, reject, notify) {

      var args = {
        headers: { "Content-Type": "application/xml", "Authorization": 'Basic ' + module.apikey }
      };
      var url = module.baseUrl + '/help/version';
      if (module.verbose) {
        console.log('GET ' + url + ' ...');
      }
      module.client.get(url, args, function(data, response) {

        if (response.statusCode === 401) {
          reject("401 - API key required");
          return;
        } else if (response.statusCode !== 200) {
          reject(response.statusCode + " - Something went wrong... :-(");
          return;
        }
        resolve(data);

      });

    });
  };

  return module;
};
