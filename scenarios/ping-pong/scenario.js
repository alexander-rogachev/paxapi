var Client = require('node-rest-client').Client;

var apikey = require('./../../util/_apikey');

var h = require('./../../api/help')(
  {
    client: new Client(),
    verbose: true,
    apikey: apikey.getSync(),
    baseUrl: 'https://staging.paxport.se/openpax2-api/rest'
  }
);

/*
  Scenario: ping - pong
    Given: nothing
    When: ping
    Then: pong!
 */

h.ping().then(console.log, console.log);
