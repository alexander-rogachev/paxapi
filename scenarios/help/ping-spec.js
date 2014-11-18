var Client = require('node-rest-client').Client;

var properties = require('./../../util/_properties');
var apikey = require('./../../util/_apikey');

var h = require('./../../api/help')(
  {
    client: new Client(),
    verbose: true, // todo: get verbose from command line args (process.argv[] array contains those) - default true
    apikey: apikey.getSync(),
    baseUrl: properties.getBaseUrl
  }
);

/*
  Scenario: ping - pong
    Given: nothing
    When: ping
    Then: pong!
 */

describe("ping", function() {
  it("should respond with pong", function(done) {
    h.ping().then(function(data) {
      console.log(data);
      expect(data).toEqual("pong!");
      done();
    }, console.log);
  });
});
