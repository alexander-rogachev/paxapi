var Q = require('q');

module.exports = function(params) {
  var module = {};

  module.verbose = params.verbose;

  module.client = params.client;

  module.apikey = params.apikey;

  module.baseUrl = params.baseUrl;

  /*
  GET /bookings/{bookingId}/detail
   */
  module.get = function(bid) {
    return Q.Promise(function(resolve, reject, notify) {

      var args = {
        headers: { "Content-Type": "application/xml", "Authorization": 'Basic ' + module.apikey }
      };
      var url = module.baseUrl + '/bookings/' + bid + '/detail';
      if (module.verbose) {
        console.log('GET ' + url + ' ...');
      }
      module.client.get(url, args, function(data, response) {

        if (response.statusCode === 401) {
          reject("401 - API key required");
          return;
        } else if (response.statusCode !== 200) {
          reject("Something went wrong... :-(");
          return;
        }
        resolve(data);

      });

    });
  };

  /*
  POST /bookings/
   */
  module.post = function(bxml) {
    return Q.Promise(function(resolve, reject, notify) {

      var args = {
        data: bxml,
        headers: { "Content-Type": "application/xml", "Authorization": 'Basic ' + module.apikey }
      };
      var url = module.baseUrl + '/bookings';
      if (module.verbose) {
        console.log('POST ' + url + ' with XML ...');
      }
      module.client.post(url, args, function(data, response) {

        if (response.statusCode === 401) {
          reject("401 - API key required");
          return;
        } else if (response.statusCode !== 201) {
          reject("Something went wrong... :-(");
          return;
        }
        var boid = response.headers.location.substring(response.headers.location.lastIndexOf('/') + 1);
        resolve(boid.replace('#', ''));

      });

    });
  };

  /*
  DELETE /bookings/{bookingId}
   */
  module.delete = function(bid) {
//    todo:
  };

  /*
  PUT /bookings/{bookingId}
   */
  module.put = function(bid, bxml) {
//    todo:
  };

  return module;
};
