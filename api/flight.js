var Q = require('q');

module.exports = function(params) {
  var module = {};

  module.verbose = params.verbose;

  module.client = params.client;

  module.apikey = params.apikey;

  module.baseUrl = params.baseUrl;

  /*
  POST /flights
   Creates a new flight
   */
  module.post = function(fxml) {
    return Q.Promise(function(resolve, reject, notify) {

      var args = {
        data: fxml,
        headers: { "Content-Type": "application/xml", "Authorization": 'Basic ' + module.apikey }
      };
      var url = module.baseUrl + '/flights/';
      if (module.verbose) {
        console.log('POST ' + url + ' with XML ...');
      }
      module.client.post(url, args, function(data, response) {

        if (response.statusCode === 401) {
          reject("401 - API key required");
          return;
        } else if (response.statusCode !== 201) {
          reject(response.statusCode + " - Something went wrong... :-(");
          return;
        }
        var flid = response.headers.location.substring(response.headers.location.lastIndexOf('/') + 1);
        resolve(flid.replace('#', ''));

      });

    });
  };

  /*
  GET /flights/{flightId}
   */
  module.get = function(fid) {
    return Q.Promise(function(resolve, reject, notify) {

      var args = {
        headers: { "Content-Type": "application/xml", "Authorization": 'Basic ' + module.apikey }
      };
      var url = module.baseUrl + '/flights/' + fid + '/';
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
  PUT /flights/{flightId}
   */
  module.put = function(fid, fxml) {
    return Q.Promise(function(resolve, reject, notify) {

      var args = {
        data: fxml,
        headers: { "Content-Type": "application/xml", "Authorization": 'Basic ' + module.apikey }
      };
      var url = module.baseUrl + '/flights/' + fid + '/';
      if (module.verbose) {
        console.log('PUT ' + url + ' with XML ...');
      }
      module.client.put(url, args, function(data, response) {

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
  DELETE /flights/{flightId}
   */
  module.delete = function(fid) {
    return Q.Promise(function(resolve, reject, notify) {

      var args = {
        headers: { "Content-Type": "application/xml", "Authorization": 'Basic ' + module.apikey }
      };
      var url = module.baseUrl + '/flights/' + fid + '/';
      if (module.verbose) {
        console.log('DELETE ' + url + ' ...');
      }
      module.client.delete(url, args, function(data, response) {

        if (response.statusCode === 401) {
          reject("401 - API key required");
          return;
        } else if (response.statusCode === 404) {
          reject("404 - Flight not found");
          return;
        } else if (response.statusCode !== 204) {
          reject(response.statusCode + " - Something went wrong... :-(");
          return;
        }
        resolve(data);

      });

    });
  };

  return module;
};
