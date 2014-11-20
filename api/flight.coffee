Client = require('node-rest-client').Client;
util = require('util');
fs = require('fs');
pd = require('pretty-data').pd;
colors = require('colors');
properties = require('./../util/_properties');
apikey = require('./../util/_apikey');
flgen = require('./../util/_generateFlightFields');
parseString = require('xml2js').parseString;
js2xmlparser = require("js2xmlparser");

flightApi = require('./../api/flight')
  client: new Client(),
  verbose: true,
  apikey: apikey.getSync(),
  baseUrl: properties.getBaseUrl

exports.Flight =
  class Flight
    @delete: (id)->
      return flightApi.deleteSync(id)

    @create: (flight) ->
      if flight.id != null
        throw new Error("Error. You can't create this flight because ID isn't null")
      return flightApi.postSync(flight.toXML())

    @get: (id) ->
      json = flightApi.getSync id
      result = new Flight()
      result.json = json
      result.id = id
      return result

    @update: (flight) ->
      if flight.id == null
        throw new Error("Error. Object flight has id equals null")
      return flightApi.putSync(flight.id, flight.toXML())

    @getDefParams = {
      prefix: 'TST'
    }

    constructor: (input = null)->
      raw = fs.readFileSync(__dirname + '/../resources/xml/flight.xml', { encoding: 'UTF8' });
      xml = pd.xmlmin(raw)
      if input
        for field, value of input

          xml = xml.replace('${' + field + '}', value)

      def = Flight.getDefParams

      flFields = flgen.get(if input?.prefix then input.prefix else def.prefix);
      xml = xml.replace(/\$\{flno\}/g, flFields.flightNumber).replace('${prefix}',
        flFields.carrierCode).replace('${departureDate}', flFields.departureDate).replace('${arrivalDate}',
        flFields.arrivalDate).replace(/\$\{departureAirport\}/g, flFields.departureAirport).replace('${arrivalAirport}',
        flFields.arrivalAirport).replace('${serviceType}', flFields.serviceType);


      parseString(xml, (err, result)=>
        @json = result
      )

    id: null
    json: {}

    toXML: ->
      js2xmlparser("ns2:FlightSchedule", @json["ns2:FlightSchedule"], {attributeString: "$"})

    carrierCode: (carrierCode) ->
      if carrierCode
        @json["ns2:FlightSchedule"]["SegmentList"][0]["Segment"][0]["FlightId"][0]["CarrierCode"][0] = carrierCode
      else return @json["ns2:FlightSchedule"]["SegmentList"][0]["Segment"][0]["FlightId"][0]["CarrierCode"][0]

    flightNumber: (flightNumber) ->
      if flightNumber
        @json["ns2:FlightSchedule"]["FlightNumber"][0] = flightNumber
        @json["ns2:FlightSchedule"]["SegmentList"][0]["Segment"][0]["FlightId"][0]["FlightNumber"][0] = flightNumber
      else return @json["ns2:FlightSchedule"]["FlightNumber"][0]

    departureDateTime: (departureDateTime) ->
      if departureDateTime
        @json["ns2:FlightSchedule"]["SegmentList"][0]["Segment"][0]["FlightId"][0]["DepartureDateTime"][0] = departureDateTime
      else return @json["ns2:FlightSchedule"]["SegmentList"][0]["Segment"][0]["FlightId"][0]["DepartureDateTime"][0]

    departureAirport: (departureAirport) ->
      if departureAirport
        @json["ns2:FlightSchedule"]["SegmentList"][0]["Segment"][0]["DepartureAirport"][0]["Code"][0] = departureAirport
      else return @json["ns2:FlightSchedule"]["SegmentList"][0]["Segment"][0]["DepartureAirport"][0]["Code"][0]

    arrivalTime: (arrivalTime) ->
      if arrivalTime
        @json["ns2:FlightSchedule"]["SegmentList"][0]["Segment"][0]["ArrivalTime"][0] = arrivalTime
      else return @json["ns2:FlightSchedule"]["SegmentList"][0]["Segment"][0]["ArrivalTime"][0]

    arrivalAirport: (arrivalAirport) ->
      if arrivalAirport
        @json["ns2:FlightSchedule"]["SegmentList"][0]["Segment"][0]["ArrivalAirport"][0]["Code"][0] = arrivalAirport
      else return @json["ns2:FlightSchedule"]["SegmentList"][0]["Segment"][0]["ArrivalAirport"][0]["Code"][0]

    serviceType: (serviceType) ->
      if serviceType
        @json["ns2:FlightSchedule"]["ServiceType"][0] = serviceType
      else return @json["ns2:FlightSchedule"]["ServiceType"][0]






