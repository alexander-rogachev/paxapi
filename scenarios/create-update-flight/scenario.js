var Client = require('node-rest-client').Client;
var util = require('util');
var fs = require('fs');
var pd = require('pretty-data').pd;
var colors = require('colors');
var properties = require('./../../util/_properties');
var apikey = require('./../../util/_apikey');
var flgen = require('./../../util/_generateFlightFields');

var f = require('./../../api/flight.js')(
  {
    client: new Client(),
    verbose: true,
    apikey: apikey.getSync(),
    baseUrl: properties.getBaseUrl
  }
);

/*
 Scenario: create and update a flight
 Given: flight is created
 When: update the flight by id
 Then: flight is updated
 */

console.log('Wanna create a flight?'.blue);
var raw = fs.readFileSync(__dirname + '/flight.xml', { encoding: 'UTF8' });
var prefix = 'TST';
var flFields = flgen.get(prefix);
var xml = pd.xmlmin(raw).replace(/\$\{flno\}/g, flFields.flightNumber).replace('${prefix}', prefix).replace('${departureDate}', flFields.departureDate).replace('${arrivalDate}', flFields.arrivalDate)
    .replace(/\$\{departureAirport\}/g, flFields.departureAirport).replace('${arrivalAirport}', flFields.arrivalAirport).replace('${serviceType}', flFields.serviceType);

//New depDate should be in 14-15 day from old depDate, but not later then arrivalDate
var newDepDate = (new Date(flFields.departureDate)).addDays(-5).toJSON();
var xml_update = pd.xmlmin(raw).replace(/\$\{flno\}/g, flFields.flightNumber).replace('${prefix}', prefix).replace('${departureDate}', newDepDate).replace('${arrivalDate}', flFields.arrivalDate)
    .replace(/\$\{departureAirport\}/g, flFields.departureAirport).replace('${arrivalAirport}', flFields.arrivalAirport).replace('${serviceType}', flFields.serviceType);

f.post(xml)
  .then(
    function(data) {
      console.log('Created!'.green);
      var flid = {
        id: data,
        number: flFields.flightNumber,
        departing: flFields.departureDate
      };
      console.log(flid);

      console.log("Let's make sure it's there!!".blue);
      f.get(data).then(
          function(data) {
            console.log("It's there!".green);
            console.log(util.inspect(data, { showHidden: true, depth: null }));
            f.put(flid.id, xml_update)
                .then(
                function(data) {
                  console.log('Updated!'.green);
                  f.get(flid.id).then(
                      function(data) {
                        console.log("Updated booking's there!".green);
                        console.log(util.inspect(data, { showHidden: true, depth: null }));
                      })
                })
          },
          console.log
      );
    })
    .fail(function(err) {
      console.log(err.red);
    })
;
