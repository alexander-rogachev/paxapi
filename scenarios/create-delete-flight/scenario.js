var Client = require('node-rest-client').Client;
var properties = require('./../../util/_properties');
var apikey = require('./../../util/_apikey');
var colors = require('colors');
var fs = require('fs');
var flgen = require('./../../util/_generateFlightFields');
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
var flFields = flgen.get(prefix);
var xml = pd.xmlmin(raw).replace(/\$\{flno\}/g, flFields.flno).replace('${prefix}', prefix).replace('${departureDate}', flFields.departureDate).replace('${arrivalDate}', flFields.arrivalDate)
    .replace(/\$\{departureAirport\}/g, flFields.departureAirport).replace('${arrivalAirport}', flFields.arrivalAirport).replace('${serviceType}', flFields.serviceType);

console.log(xml)
f.post(xml)
    .then(
    function (data) {
        console.log('Created!'.green);
        var flid = {
            id: data,
            number: flFields.flightNumber,
            departing: flFields.departureDate
        };
        console.log(flid);

        f.delete(flid.id)
            .then(
            function (data) {
                console.log('Flight is Cancelled!'.green);
            })
    })
    .fail(function () {
        console.log(err.red);
    });
