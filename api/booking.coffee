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

    #  todo need parse from xml to json
    #    @json = parseXML(@xml)
    @xml = xml

    parseString(xml, (err, result)=>
      @json = result
    )

  @get: (id)->
    json = bookingApi.getSync id
    result = new Booking()
    result.json = json
    result.id = id
    return result

  @delete: (bid)->
    return bookingApi.deleteSync(bid)

  @create: (booking) ->
#    if booking.id != null
#      throw new Error("Error. You can't create this booking because ID isn't null")
    return bookingApi.postSync(booking.toXML())

  @update: (booking) ->
    if booking.id == null
      throw new Error("Error. ID is null")
    return bookingApi.putSync(booking.id, booking.toXML())

  id: null
  json: {}

  toXML: ->
    if @id == null
      js2xmlparser("mes:Booking", @json["mes:Booking"],  {attributeString:"$"})
    else
      @json["ns2:Booking"]["$"]["xmlns:mes"] = 'http://api.paxport.se/openpax/messages'
      delete @json["ns2:Booking"]["$"]["xmlns:ns2"]
      js2xmlparser("ns2:Booking", @json["ns2:Booking"], {attributeString:"$"})

  passengers: ->
    @json["ns2:Booking"]["PassengerList"]


execFunction = ->
  booking = new Booking()
  booking = new Booking({passengerName: 'MyName', passengerSurname: 'Vasya'})
#  console.log(booking.xml);
#  console.log("*************");
#  console.log(js2xmlparser("mes:Booking", booking.json["mes:Booking"], {attributeString:"$"}));

  id = Booking.create(booking)
  console.log(id)

  booking2 = Booking.get id
  Booking.create(booking2)
###
#  console.log(util.inspect(booking2, { showHidden: true, depth: null }));
  console.log(booking2.json["ns2:Booking"]["BookingNumber"])
  booking2.json["ns2:Booking"]["BookingNumber"] = "P0101S5"

  Booking.update(booking2)
  booking2 = Booking.get id
  console.log(booking2.json["ns2:Booking"]["BookingNumber"])
  ###
#  booking2 = Booking.get 28491675
#  console.log(booking2);
#
#  console.log("-------------------")
#  console.log(booking2.json);
#  console.log(booking2.json["ns2:Booking"]["$"]["xmlns:ns2"]);
#  booking2.json["ns2:Booking"]["$"]["xmlns:mes"] = 'http://api.paxport.se/openpax/messages'
#  delete booking2.json["ns2:Booking"]["$"]["xmlns:ns2"]
#  console.log booking2.json
#
#  xmlGet = js2xmlparser("mes:Booking", booking2.json["ns2:Booking"], {attributeString:"$"})
#
#  console.log(xmlGet);
#
#  booking2.xml = xmlGet
#  Booking.create(booking2)

#  console.log(new2)
#  bb = new2["ns2:Booking"]
#  cc = js2xmlparser("aaa", new2["ns2:Booking"],  {attributeString:"$"})
#  console.log(bb)
#  console.log(js2xmlparser("mes:Booking", new2["ns2:Booking"],  {attributeString:"$"}))
#  booking2.xml = js2xmlparser("mes:Booking", new2["ns2:Booking"],  {attributeString:"$"})
#  console.log(booking2.xml)
#  Booking.create(new2)



#  booking2 = Booking.get(id)
#  console.log(util.inspect(booking2, { showHidden: false, depth: null }));
#
#  Booking.delete(id)


wait.launchFiber execFunction;












