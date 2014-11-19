Client = require('node-rest-client').Client;
util = require('util');
fs = require('fs');
pd = require('pretty-data').pd;
colors = require('colors');
properties = require('./../util/_properties');
apikey = require('./../util/_apikey');
flnogen = require('./../util/_flnogen');
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
      dep_datetime: '2014-12-01T07:45:00Z'
    }

    constructor: (input = null)->
      raw = fs.readFileSync(__dirname+'/../scenarios/create-retrieve-flight/flight.xml', { encoding: 'UTF8' });
      xml = pd.xmlmin(raw)
      if input
        for field, value of input
          xml = xml.replace('${' + field + '}', value)

      def = Flight.getDefParams

      flno = flnogen.flnogen(3, if input?.prefix then input.prefix else def.prefix)
      xml = xml.replace(/\$\{flno\}/g, flno).replace('${prefix}', def.prefix).replace('${dep_datetime}',
        def.dep_datetime);
      parseString(xml, (err, result)=>
        @json = result
      )

    toXML: ->
      js2xmlparser("ns2:FlightSchedule", @json["ns2:FlightSchedule"], {attributeString: "$"})

    id: null
    json: {}

#
#execFunction = ->
#  flight = new Flight()
#
#  id = Flight.create flight
#
#  flight = Flight.get(id)
#  console.log(flight.json["ns2:FlightSchedule"]["SegmentList"][0]["Segment"][0]["FlightId"][0]["DepartureDateTime"][0])
#  flight.json["ns2:FlightSchedule"]["SegmentList"][0]["Segment"][0]["FlightId"][0]["DepartureDateTime"][0] = '2014-12-01T10:45:00Z'
#
#  Flight.update flight
#  flight = Flight.get(id)
#  console.log(flight.json["ns2:FlightSchedule"]["SegmentList"][0]["Segment"][0]["FlightId"][0]["DepartureDateTime"][0])
#
#  Flight.delete id
#
#
#wait.launchFiber execFunction;
#
#


