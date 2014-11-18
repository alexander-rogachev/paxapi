var Client = require('node-rest-client').Client;
var properties = require('./../../util/_properties');
var apikey = require('./../../util/_apikey');
var colors = require('colors');

var bb = require('./../../api/bookings')(
    {
      client: new Client(),
      verbose: true,
      apikey: apikey.getSync(),
      baseUrl: properties.getBaseUrl
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
  Scenario: retrieve and cancel a booking
    Given: retrieve the booking by bono and depdate
    When: cancel booking by id
    Then: booking is cancelled
 */

console.log('Wanna cancel a booking?'.blue);

bb.get('PD10Y64', '2014-12-01')
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
