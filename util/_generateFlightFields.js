var flnogen = require('./_flnogen');
require('date-utils');

var flightFields = {
  "prefix":"",
  "flno":"",
  "departureDate":"",
  "departureAirport":"",
  "arrivalDate":"",
  "arrivalAirport":"",
  "serviceType":""
}

//todo get airports from somewhere
//todo get service types from somewhere
exports.get = function(prefix) {
  var depDate = (new Date.tomorrow()).addMonths(Math.floor(Math.random() * 4) + 1);
  flightFields.prefix = prefix;
  flightFields.flno = flnogen.flnogen(3, prefix);
  flightFields.departureAirport = "ARN";
  flightFields.arrivalAirport = "BKK";
  flightFields.serviceType = "C";
  flightFields.departureDate = depDate.toJSON()
  flightFields.arrivalDate = depDate.clone().addHours(Math.floor(Math.random() * 6) + 1).toJSON();

  return flightFields;
};