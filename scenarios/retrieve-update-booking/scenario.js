var Client = require('node-rest-client').Client;

var fs = require('fs');
var pd = require('pretty-data').pd;
var colors = require('colors');

var properties = require('./../../util/_properties');
var apikey = require('./../../util/_apikey');
var generatePerson = require('./../../util/_generatePerson');
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
  Scenario: retrieve and update a booking
    Given: retrieve the booking by bono and depdate
    When: update the booking by id
    Then: booking is updated
 */

console.log('Wanna create a booking?'.blue);
var bono = 'CN4KXDS';
bb.get(bono, '2014-12-01 08:45')
    .then(
    function(data) {
      console.log(data);
      var boid = data;
      console.log('BookingId is :' + boid.blue);

        var raw = fs.readFileSync(__dirname + '/newBooking.xml', { encoding: 'UTF8' });
        var person = generatePerson.get();
        var xml = pd.xmlmin(raw).replace('${bono}', bono).replace(/\$\{passengerName\}/g, person.firstName).replace(/\$\{passengerSurname\}/g, person.lastName).replace(/\$\{sex\}/g, person.sex);

        b.put(boid, xml)
          .then(
          function (data) {
            console.log('Updated!'.green);
          })
    })
    .fail(function(err) {
      console.log(err.red);
    });
