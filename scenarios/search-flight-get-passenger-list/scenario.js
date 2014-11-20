var Client = require('node-rest-client').Client;

var properties = require('./../../util/_properties');
var apikey = require('./../../util/_apikey');
var util = require('util');
var colors = require('colors');

var ff = require('./../../api/flights')(
    {
        client: new Client(),
        verbose: true, // todo: get verbose from command line args (process.argv[] array contains those) - default true
        apikey: apikey.getSync(),
        baseUrl: properties.getBaseUrl
    }
);

/*
  Scenario: Search a flight and get the passenger list
    Given: a flight
    When: searching for it by flno and depdate
    Then: get the passenger list from it
    it returns passenger list
 */
// todo: flight TST111 is supposed to be in the DB at the time scenario is being run. Test flight should be created and deleted every time scenario is being run. - AR
console.log('Wanna find a flight?'.blue);
ff.get('TST111', '2014-12-01 08:45')
    .then(function(data) {
        console.log(data);

        console.log("Let's get passenger list!!".blue);

        ff.getPassengerList(data).then(
            function(data) {
                console.log("It's there!".green);
                console.log(util.inspect(data, { showHidden: true, depth: null }));
            },
            console.log
        );
    })
    .fail(function(err) {
        console.log(err.red);
    })
;