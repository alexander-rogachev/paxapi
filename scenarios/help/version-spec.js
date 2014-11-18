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

describe("version", function() {
  it("should respond with server version and other metadata attributes", function(done) {
    h.version().then(function(data) {
      console.log(data);
      done();
    }, console.log);
  });
});
