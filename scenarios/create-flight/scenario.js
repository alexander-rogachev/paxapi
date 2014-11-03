var Client = require('node-rest-client').Client;
var util = require('util');
var fs = require('fs');
var pd = require('pretty-data').pd;
var colors = require('colors');
var apikey = require('./../../util/_apikey');
var flnogen = require('./../../util/_flnogen');
var b = require('./../../api/flight')(
  {
    client: new Client(),
    verbose: false,
    apikey: apikey.getSync(),
    baseUrl: 'https://staging.paxport.se/openpax2-api/rest'
  }
);

/*
  Scenario: create and retrieve a booking
    Given: booking is created
    When: retrieve the booking by id
    Then: booking is retrieved
 */

console.log('Wanna create a flight?'.blue);
var prefix = 'BLX';
var raw = fs.readFileSync(__dirname + '/flight.xml', { encoding: 'UTF8' });
var xml = pd.xmlmin(raw).replace('${flno}', flnogen.flnogen(3, prefix)).replace('${prefix}', prefix);
b.post(xml)
  .then(
    function(data) {
      console.log('Created!'.green);
      //TODO here we receive an empty data
      console.log(data);
   })
  .fail(function(err) {
    console.log(err.red);
  })
;
