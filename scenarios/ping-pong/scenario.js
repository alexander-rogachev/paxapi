var Client = require('node-rest-client').Client;
var util = require('util');
var fs = require('fs');
var pd = require('pretty-data').pd;
var colors = require('colors');
var js2xmlparser = require("js2xmlparser");

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
  todo
  Scenario: create and retrieve a booking
    Given: booking is created
    When: retrieve the booking by id
    Then: booking is retrieved
 */

h.ping().then(console.log, console.log);
