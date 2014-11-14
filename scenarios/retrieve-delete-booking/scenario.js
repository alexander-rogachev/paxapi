var Client = require('node-rest-client').Client;
var apikey = require('./../../util/_apikey');
var colors = require('colors');

var bb = require('./../../api/bookings')(
    {
      client: new Client(),
      verbose: true,
      apikey: apikey.getSync(),
      baseUrl: 'http://trigada.paxport.se:8080/openpax2-api/rest'
    }
);

var b = require('./../../api/booking')(
  {
    client: bb.client,
    verbose: bb.verbose,
    apikey: bb.apikey,
    baseUrl: bb.baseUrl
  }
);
/*
  Scenario: create and retrieve a booking
    Given: booking is created
    When: retrieve the booking by id
    Then: booking is retrieved
 */

console.log('Wanna cancel a booking?'.blue);

bb.get('PD10Y64', '2014-12-01 08:45')
    .then(
    function(data) {
      console.log(data);
      var boid = data;
      console.log('BookingId is :' + boid.blue);

      b.delete(boid)
          .then(
          function (data) {
            console.log('Booking is Cancelled!'.green);
          })
    })
    .fail(function(err) {
      console.log(err.red);
    });
