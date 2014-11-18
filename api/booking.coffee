Client = require('node-rest-client').Client;
properties = require('./../util/_properties');
apikey = require('./../util/_apikey');
bonogen = require('./../util/_bonogen');
pd = require('pretty-data').pd;
fs = require('fs');
util = require('util');
wait = require('wait.for');
generatePerson = require('./../util/_generatePerson');
parseString = require('xml2js').parseString;
js2xmlparser = require("js2xmlparser");

bookingApi = require('./booking.js')
  client: new Client(),
  verbose: true,
  apikey: apikey.getSync(),
  baseUrl: properties.getBaseUrl

mappingFields =
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

class Booking

  constructor: (input = null) ->
    raw = fs.readFileSync('scenarios/create-retrieve-booking/booking.xml', { encoding: 'UTF8' });
    person = generatePerson.get();
    bono = bonogen.bonogen(7);
    xml = pd.xmlmin(raw).replace('${bono}', bono)

    if input
      for field, value of input
        expr = new RegExp('\\$\\{' + field + '\\}', "g");
        xml = xml.replace(expr, value)

    for field, value of mappingFields
      expr = new RegExp('\\$\\{' + field + '\\}', "g");
      xml = xml.replace(expr, if !value.func then person[value.field] else value.func(person[value.field]))

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

  passengers: ->
    @json["ns2:Booking"]["PassengerList"]


execFunction = ->
  booking = new Booking({passengerName: 'MyName', passengerSurname: 'Vasya'})

  id = Booking.create booking

  booking = Booking.get(id)
  console.log(booking.json["ns2:Booking"]["PassengerList"][0]["Passenger"][0]["FirstName"][0])
  booking.json["ns2:Booking"]["PassengerList"][0]["Passenger"][0]["FirstName"][0] = 'Alesha123'
  Booking.update booking

  booking = Booking.get(id)
  console.log(booking.json["ns2:Booking"]["PassengerList"][0]["Passenger"][0]["FirstName"][0])

  Booking.delete id


wait.launchFiber execFunction;












