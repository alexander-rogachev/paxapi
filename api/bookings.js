module.exports = function(params) {
  var module = {};

  /*
  GET /bookings/{bookingNumber}/{departureDate}

   Searches for bookings  using the given path parameters. A booking reference
   only provides basic information about a booking, such as ID, carrier name
   and tour operator name. Further booking details can be obtained by following
   the self link also provided in the reference.

   bookingNumber - The tour operator alpha-numeric booking number
   departureDate - The departure date in format: YYYY-mm-dd

   Specific error codes:
   none

   Sample Booking Reference List XML (what comes in the response).

   <?xml version="1.0" encoding="UTF-8" standalone="yes"?>
   <ns3:BookingReferenceList xmlns:types="http://api.paxport.se/openpax/types" xmlns="http://api.paxport.se/openpax/events" xmlns:ns3="http://api.paxport.se/openpax/messages">
     <types:bookingReference>
       <types:id>0</types:id>
       <types:link title="Booking details" rel="self" href="http://api.paxport.se/openpax2-api/rest/boookings/0/detail"/>
       <types:tourOperatorName>Apollo</types:tourOperatorName>
       <types:carrierName>Novair</types:carrierName>
     </types:bookingReference>
     <types:bookingReference>
       <types:id>1</types:id>
       <types:link title="Booking details" rel="self" href="http://api.paxport.se/openpax2-api/rest/boookings/1/detail"/>
       <types:tourOperatorName>Apollo</types:tourOperatorName>
       <types:carrierName>Novair</types:carrierName>
     </types:bookingReference>
     <types:bookingReference>
       <types:id>2</types:id>
       <types:link title="Booking details" rel="self" href="http://api.paxport.se/openpax2-api/rest/boookings/2/detail"/>
       <types:tourOperatorName>Apollo</types:tourOperatorName>
       <types:carrierName>Novair</types:carrierName>
     </types:bookingReference>
     <types:bookingReference>
       <types:id>3</types:id>
       <types:link title="Booking details" rel="self" href="http://api.paxport.se/openpax2-api/rest/boookings/3/detail"/>
       <types:tourOperatorName>Apollo</types:tourOperatorName>
       <types:carrierName>Novair</types:carrierName>
     </types:bookingReference>
   </ns3:BookingReferenceList>
   */
  module.get = function(bono, depdate) {
//    todo: AR
  };

  return module;
};
