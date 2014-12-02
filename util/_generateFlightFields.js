var flnogen = require('./_flnogen');
require('date-utils');

var flightFields = {
    "prefix": "",
    "flno": "",
    "departureDate": "",
    "departureAirport": "ARN",
    "arrivalDate": "",
    "arrivalAirport": "BKK",
    "serviceType": "C",
    aircraftType: '76W',
    aircraftConfiguration: 'Y291'
}

//todo get airports from somewhere
//todo get service types from somewhere
exports.get = function (prefix, departureDate) {
    var depDate = departureDate ? new Date(departureDate) : Date.tomorrow().addMonths(Math.floor(Math.random() * 4) + 1);
    flightFields.prefix = prefix;
    flightFields.flno = flnogen.flnogen(3, prefix);
    flightFields.departureDate = depDate.toJSON()
    flightFields.arrivalDate = depDate.clone().addHours(Math.floor(Math.random() * 6) + 1).toJSON();

    return flightFields;
};