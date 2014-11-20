{Booking} = require "./booking.coffee"
{Flight} = require "./flight.coffee"
wait = require('wait.for')
util = require('util');

#aa = {passengers: [{passengerName: "A123"},{passengerSurname: "b123"}]}
#console.log(aa.passengers[1])


execFunction = ->
  flight1 = new Flight()
  flight2 = new Flight()

  Flight.create flight1
  Flight.create flight2

  booking = new Booking()

  booking.setFlight flight1
  booking.addFlight flight2

  booking.addPassenger({count: 2})
  booking.addPassenger(passengers: [
    {passengerName: "Vasya", passengerSurname: "Potapov"}
  ])
  Booking.create booking
  console.log(util.inspect(booking, { showHidden: true, depth: null }));



wait.launchFiber execFunction;