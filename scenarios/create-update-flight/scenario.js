var Client = require('node-rest-client').Client;
var util = require('util');
var fs = require('fs');
var pd = require('pretty-data').pd;
var colors = require('colors');
var properties = require('./../../util/_properties');
var apikey = require('./../../util/_apikey');
var flnogen = require('./../../util/_flnogen');
var f = require('./../../api/flight')(
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
var flno = flnogen.flnogen(3, prefix);
var dep_datetime = '2014-12-01T07:45:00Z';
var xml = pd.xmlmin(raw).replace('${flno}', flno).replace('${prefix}', prefix).replace('${dep_datetime}', dep_datetime);

var dep_datetime = '2014-12-01T15:45:00Z';
var xml_update = pd.xmlmin(raw).replace('${flno}', flno).replace('${prefix}', prefix).replace('${dep_datetime}', dep_datetime);


f.post(xml)
  .then(
    function(data) {
      console.log('Created!'.green);
      var flid = {
        id: data,
        number: flno,
        departing: dep_datetime
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
