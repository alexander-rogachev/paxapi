var Client = require('node-rest-client').Client;

var properties = require('./../../util/_properties');
var apikey = require('./../../util/_apikey');

var bb = require('./../../api/flights')(
    {
        client: new Client(),
        verbose: true, // todo: get verbose from command line args (process.argv[] array contains those) - default true
        apikey: apikey.getSync(),
        baseUrl: properties.getBaseUrl
    }
);

/*
  Scenario: Search a flight
    Given: a flight
    When: searching for it by flno and depdate
    Then: flight is found
    it returns departure_group_id
 */
// todo: flight TST111 is supposed to be in the DB at the time scenario is being run. Test flight should be created and deleted every time scenario is being run. - AR
bb.get('TST111', '2014-12-01 08:45').then(console.log, console.log);