Client = require('node-rest-client').Client;
apikey = require('./../util/_apikey');
bonogen = require('./../util/_bonogen');
pd = require('pretty-data').pd;
fs = require('fs');
util = require('util');
wait = require('wait.for');

bookingApi = require('./booking.js')
  client: new Client(),
  verbose: true,
  apikey: apikey.getSync(),
  baseUrl: 'http://trigada.paxport.se:8080/openpax2-api/rest'


class Booking
  @get: (id)->
    json = bookingApi.getSync id
    result = new Booking()
    result.json = json
    return result

  json: {}


  create: ->
    raw = fs.readFileSync('scenarios/create-retrieve-booking/booking.xml', { encoding: 'UTF8' });
    bono = bonogen.bonogen(7);
#    todo need replace data in xml from json
    xml = pd.xmlmin(raw).replace('${bono}', bono);
    return bookingApi.postSync(xml)

  passengers: ->
    @json["ns2:Booking"]["PassengerList"]


execFunction =  ->
  booking = Booking.get '28491570'
  console.log(util.inspect(booking, { showHidden: true, depth: null }));

  bookingForCreate = new Booking()
  id = bookingForCreate.create()
  console.log(id)

  console.log(booking.passengers())

wait.launchFiber execFunction;














