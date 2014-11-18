var Client = require('node-rest-client').Client;
var properties = require('./../../util/_properties');
var apikey = require('./../../util/_apikey');
var colors = require('colors');
var fs = require('fs');
var flnogen = require('./../../util/_flnogen');
var pd = require('pretty-data').pd;

var f = require('./../../api/flight')(
    {
        client: new Client(),
        verbose: true,
        apikey: apikey.getSync(),
        baseUrl: properties.getBaseUrl
    }
);

/*
 Scenario: create and cancel a flight
 Given: create the flight
 When: cancel flight by id
 Then: flight is cancelled
 */

console.log('Wanna cancel a flight?'.blue);

var raw = fs.readFileSync(__dirname + '/flight.xml', { encoding: 'UTF8' });
var prefix = 'TST';
var flno = flnogen.flnogen(3, prefix);
var dep_datetime = '2014-12-01T07:45:00Z';
var xml = pd.xmlmin(raw).replace(/\$\{flno\}/g, flno).replace('${prefix}', prefix).replace('${dep_datetime}', dep_datetime);
console.log(xml)
f.post(xml)
    .then(
    function (data) {
        console.log('Created!'.green);
        var flid = {
            id: data,
            number: flno,
            departing: dep_datetime
        };
        console.log(flid);

        f.delete(flid.id)
            .then(
            function (data) {
                console.log('Booking is Cancelled!'.green);
            })
    })
    .fail(function () {
        console.log(err.red);
    });
