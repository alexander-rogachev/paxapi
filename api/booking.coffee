Client = require('node-rest-client').Client;
apikey = require('./../util/_apikey');
bonogen = require('./../util/_bonogen');
pd = require('pretty-data').pd;
fs = require('fs');
util = require('util');
wait = require('wait.for');
generatePerson = require('./../util/_generatePerson');

bookingApi = require('./booking.js')
  client: new Client(),
  verbose: true,
  apikey: apikey.getSync(),
  baseUrl: 'http://trigada.paxport.se:8080/openpax2-api/rest'

class Booking
  constructor: (input) ->
#    todo: new generates fake data if data doesn't come as parameters

  @get: (id)->
    json = bookingApi.getSync id
    result = new Booking()
    result.json = json
    return result

  json: {}

#  todo: create should just persist the booking (the booking is created by new)
  create: ->
    raw = fs.readFileSync('scenarios/create-retrieve-booking/booking.xml', { encoding: 'UTF8' });
    person = generatePerson.get();
    bono = bonogen.bonogen(7);
    xml = pd.xmlmin(raw).replace('${bono}', bono).replace(/\$\{passengerName\}/g, person.firstName).replace(/\$\{passengerSurname\}/g, person.lastName).replace('${genderCode}', person.sex.charAt(0).toUpperCase())
      .replace(/\$\{sex\}/g, person.sex).replace(/\$\{street\}/g, person.street).replace(/\$\{city\}/g, person.city).replace(/\$\{state\}/g, person['state']).replace(/\$\{zipCode\}/g, person.zipCode);

    #    todo need replace data in xml from json
    return bookingApi.postSync(xml)

  passengers: ->
    @json["ns2:Booking"]["PassengerList"]


execFunction =  ->
  booking = Booking.get '28491570'
  console.log(util.inspect(booking, { showHidden: true, depth: null }));

  bookingToCreate = new Booking()
  id = bookingToCreate.create()
  console.log(id)

  console.log(booking.passengers())

wait.launchFiber execFunction;














