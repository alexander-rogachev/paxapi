{Booking} = require "./booking.coffee"
{Flight} = require "./flight.coffee"
wait = require('wait.for')



execFunction = ->
  #Booking CRUD example
  booking = new Booking()
  id = Booking.create booking

  booking = Booking.get(id)
  console.log(booking.json["ns2:Booking"]["PassengerList"][0]["Passenger"][0]["FirstName"][0])
  booking.json["ns2:Booking"]["PassengerList"][0]["Passenger"][0]["FirstName"][0] = 'Alesha123'
  Booking.update booking

  booking = Booking.get(id)
  console.log(booking.json["ns2:Booking"]["PassengerList"][0]["Passenger"][0]["FirstName"][0])

  Booking.delete id

  #Flight CRUD example
  flight = new Flight()

  id = Flight.create flight

  flight = Flight.get(id)
  console.log(flight.json["ns2:FlightSchedule"]["SegmentList"][0]["Segment"][0]["FlightId"][0]["DepartureDateTime"][0])
  flight.json["ns2:FlightSchedule"]["SegmentList"][0]["Segment"][0]["FlightId"][0]["DepartureDateTime"][0] = '2014-12-01T10:45:00Z'

  Flight.update flight
  flight = Flight.get(id)
  console.log(flight.json["ns2:FlightSchedule"]["SegmentList"][0]["Segment"][0]["FlightId"][0]["DepartureDateTime"][0])

  Flight.delete id

wait.launchFiber execFunction;