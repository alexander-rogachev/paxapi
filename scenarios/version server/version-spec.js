var Client = require('node-rest-client').Client;
var should = require('chai').should();

var apikey = require('./../../util/_apikey');

var h = require('./../../api/help')(
  {
    client: new Client(),
    verbose: true, // todo: get verbose from command line args (process.argv[] array contains those) - default true
    apikey: apikey.getSync(),
    baseUrl: 'http://trigada.paxport.se:8080/openpax2-api/rest'
  }
);

/*
  Scenario: Returns server version information and other metadata attributes
    Given: nothing
    When: Get
    Then: Post server version
 */

describe("version", function() {
  it("should respond with server version and other metadata attributes", function(done) {
    h.version().then(function(data) {
      console.log(data);
      expect(data).toEqual(data);
      done();
    }, console.log);
  });
});
