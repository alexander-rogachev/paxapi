Client = require('node-rest-client').Client;
properties = require('./../util/_properties');
apikey = require('./../util/_apikey');
bonogen = require('./../util/_bonogen');
pd = require('pretty-data').pd;
fs = require('fs');
util = require('util');
generatePerson = require('./../util/_generatePerson');
parseString = require('xml2js').parseString;
js2xmlparser = require("js2xmlparser");

bookingApi = require('./booking.js')
  client: new Client(),
  verbose: true,
  apikey: apikey.getSync(),
  baseUrl: properties.getBaseUrl

mappingToPerson =
  passengerName:
    field: 'firstName'
  passengerSurname:
    field: 'lastName'
  genderCode:
    field: 'sex'
    func: (value)->
      value.charAt(0).toUpperCase()
  sex:
    field: 'sex'
  street:
    field: 'street'
  city:
    field: 'city'
  state:
    field: 'state'
  zipCode:
    field: 'zipCpde'

mappingToFlight =
  prefix: "carrierCode"
  flno: "flightNumber"
  departureDate: "departureDateTime"
  departureAirport: "departureAirport"
  arrivalDate: "arrivalTime"
  arrivalAirport: "arrivalAirport"
  serviceType: "serviceType"


exports.Booking =
  class Booking

    @getDefParams = {
      prefix: 'TST',
      flno: 'TST111',
      departureDate: '2014-12-01T07:45:00Z',
      departureAirport: 'ARN',
      arrivalDate: '2014-12-01T10:45:00Z',
      arrivalAirport: 'BKK',
      serviceType: 'C'
    }

    constructor: (input = null) ->
      raw = fs.readFileSync(__dirname + '/../resources/xml/booking.xml', { encoding: 'UTF8' });
      person = generatePerson.get();
      bono = bonogen.bonogen(7);

      xml = pd.xmlmin(raw).replace('${bono}', bono);

      if input then xml = @replaceInputParams(xml, input)
      xml = @replaceWithRandom(xml, person);

      for field, value of Booking.getDefParams
        xml = xml.replace(new RegExp('\\$\\{' + field + '\\}', "g"), value)

      parseString(xml, (err, result)=>
        @json = result
      )

    @get: (id)->
      json = bookingApi.getSync id
      result = new Booking()
      result.json = json
      result.id = id
      return result

    @delete: (id)->
      return bookingApi.deleteSync(id)

    @create: (booking) ->
      if booking.id != null
        throw new Error("Error. You can't create this booking because ID isn't null")
      return bookingApi.postSync(booking.toXML())

    @update: (booking) ->
      if booking.id == null
        throw new Error("Error. Object booking has id equals null")
      return bookingApi.putSync(booking.id, booking.toXML())

    id: null
    json: {}

    toXML: ->
      js2xmlparser("ns2:Booking", @json["ns2:Booking"], {attributeString: "$"})

    replaceWithRandom: (xml, randomData) ->
      for field, value of mappingToPerson
        expr = new RegExp('\\$\\{' + field + '\\}', "g");
        xml = xml.replace(expr, if !value.func then randomData[value.field] else value.func(randomData[value.field]))
      return xml

    replaceInputParams: (xml, params) ->
      for field, value of params
        expr = new RegExp('\\$\\{' + field + '\\}', "g");
        xml = xml.replace(expr, value)
      return xml

    addPassenger: (params) ->
      if !@json? then throw new Error("Object with Booking type has empty json field")

      raw = fs.readFileSync(__dirname + '/../resources/xml/passengerTemplate.xml', { encoding: 'UTF8' });
      xmlOriginal = pd.xmlmin(raw)

      #Create random passengers
      if params?.count and params.count > 0
        for num in [0..params.count - 1]
          person = generatePerson.get();
          xml = @replaceWithRandom(xmlOriginal, person)
          parseString(xml, (err, result)=>
            @passengers().push(result["Passenger"])
          )

      else if params?.passengers and params.passengers.length > 0
        for pass in params.passengers
          xml = @replaceInputParams(xmlOriginal, pass)
          person = generatePerson.get();
          xml = @replaceWithRandom(xml, person)
          parseString(xml, (err, result)=>
            @passengers().push(result["Passenger"])
          )

    setFlight: (flight) ->
      console.log(util.inspect(@json, { showHidden: true, depth: null }));

      @json["ns2:Booking"]["FlightList"][0]["Flight"] = []

      raw = fs.readFileSync(__dirname + '/../resources/xml/flightTemplate.xml', { encoding: 'UTF8' });
      xml = pd.xmlmin(raw)
      for key, value of mappingToFlight
        xml = xml.replace('${' + key + '}', flight[value]())
      flightJson = {}
      parseString(xml, (err, result)->
        flightJson = result
      )

      @flights().push flightJson["Flight"]
      console.log(util.inspect(@json, { showHidden: true, depth: null }));

    addFlight: (flight) ->

    passengers: ->
      @json["ns2:Booking"]["PassengerList"][0]["Passenger"]

    flights: ->
      return @json["ns2:Booking"]["FlightList"][0]["Flight"]





