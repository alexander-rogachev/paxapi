Client = require('node-rest-client').Client;
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
  baseUrl: 'http://trigada.paxport.se:8080/openpax2-api/rest'

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
    return result

  @delete: (bid)->
    return bookingApi.deleteSync(bid)


  @create: (booking) ->
    return bookingApi.postSync(booking.xml)

  @update: (id, booking) ->
    return bookingApi.putSync(id, booking.toXML())

  json: {}
  xml: {}
#  TODO need parse from json to xml
  toXML: ->
    js2xmlparser("mes:Booking", @json["mes:Booking"],  {attributeString:"$"})

  passengers: ->
    @json["ns2:Booking"]["PassengerList"]


execFunction = ->
#  booking = new Booking()
#  booking = new Booking({passengerName: 'MyName', passengerSurname: 'Vasya'})
#  console.log(util.inspect(booking, { showHidden: false, depth: null }));
#
#  console.log("*************");
#  console.log(js2xmlparser("mes:Booking", booking.json["mes:Booking"], {attributeString:"$"}));
#
#  id = Booking.create(booking)
#  console.log(id)
#
  booking2 = Booking.get 28491675
  console.log(booking2);

  console.log("-------------------")
  console.log(booking2.json);
  new2 = JSON.stringify(booking2.json)

  console.log(js2xmlparser("person", new2));
  console.log(new2)
  bb = new2["ns2:Booking"]
#  cc = js2xmlparser("aaa", new2["ns2:Booking"],  {attributeString:"$"})
console.log(bb)
#  console.log(js2xmlparser("mes:Booking", new2["ns2:Booking"],  {attributeString:"$"}))
#  booking2.xml = js2xmlparser("mes:Booking", new2["ns2:Booking"],  {attributeString:"$"})
#  console.log(booking2.xml)
#  Booking.create(new2)



#  booking2 = Booking.get(id)
#  console.log(util.inspect(booking2, { showHidden: false, depth: null }));
#
#  Booking.delete(id)


wait.launchFiber execFunction;












