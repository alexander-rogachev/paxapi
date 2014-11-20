var flnogen = require('./_flnogen');
require('date-utils');

var flightFields = {
  "carrierCode":"",
  "flightNumber":"",
  "departureDate":"",
  "departureAirport":"",
  "arrivalDate":"",
  "arrivalAirport":"",
  "serviceType":""
}

//todo get airports from somewhere
//todo get service types from somewhere
exports.get = function(prefix) {
  var depDate = (new Date.tomorrow()).addMonths(1);
  flightFields.carrierCode = prefix;
  flightFields.flightNumber = flnogen.flnogen(3, prefix);
  flightFields.departureAirport = "ARN";
  flightFields.arrivalAirport = "BKK";
  flightFields.serviceType = "C";
  flightFields.departureDate = depDate.toJSON()
  flightFields.arrivalDate = depDate.clone().addDays(12).toJSON();

  return flightFields;
};