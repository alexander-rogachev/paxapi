var Client = require('node-rest-client').Client;

var apikey = require('./../../util/_apikey');

var bono = 'ZY987654';
var departure = '2014-11-07 12:30';

var h = require('./../../api/bookings')(
    {
        client: new Client(),
        verbose: true, // todo: get verbose from command line args (process.argv[] array contains those) - default true
        apikey: apikey.getSync(),
        baseUrl: 'https://staging.paxport.se/openpax2-api/rest'
    }
);

/*
 Scenario: get booking references
 Given: bono: ZY987654, departure: 2014-11-07 12:30
 When: send request
 Then: get response with data
 */
h.get(bono, departure).then(function(data) {
    console.log(data);
}, console.log);