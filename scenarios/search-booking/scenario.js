var Client = require('node-rest-client').Client;

var apikey = require('./../../util/_apikey');

var bb = require('./../../api/bookings')(
    {
        client: new Client(),
        verbose: true, // todo: get verbose from command line args (process.argv[] array contains those) - default true
        apikey: apikey.getSync(),
        baseUrl: 'http://trigada.paxport.se:8080/openpax2-api/rest'
    }
);

/*
  Scenario: Search a booking
    Given: a booking
    When: searching for it by bono and depdate
    Then: booking is found
 */
// todo: booking PD10Y64 is supposed to be in the DB at the time scenario is being run. Test booking should be created and deleted every time scenario is being run. - AR
bb.get('PD10Y64', '2014-12-01 08:45').then(console.log, console.log);