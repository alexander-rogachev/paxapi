var Q = require('q');

module.exports = function(params) {
  var module = {};

  module.verbose = params.verbose;

  module.client = params.client;

  module.apikey = params.apikey;

  module.baseUrl = params.baseUrl;

  /*
   GET /flights/{flightNumber}/{departureDate}
   */
  module.get = function(flno, depdate) {
    return Q.Promise(function(resolve, reject, notify) {

      var args = {
        headers: { "Content-Type": "application/xml", "Authorization": 'Basic ' + module.apikey }
      };
      var url = module.baseUrl + '/flights/' + flno + '/' + depdate;
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
        var flid = data['ns2:Flights']['ns2:FlightReference'][0]['Id'][0];
        resolve(flid);

      });

    });
  };

  /*
   GET /flights/{flightID}/passengers
   */
  module.getPassengerList = function(flid) {
    return Q.Promise(function(resolve, reject, notify) {

      var args = {
        headers: { "Content-Type": "application/xml", "Authorization": 'Basic ' + module.apikey }
      };
      var url = module.baseUrl + '/flights/' + flid + '/passengers';
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
