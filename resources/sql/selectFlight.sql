select
        operating_carrier_code as prefix,  operating_carrier_code || flight_no as flno,
        to_char(departure_date_time AT TIME ZONE 'UTC', 'YYYY-MM-DD') || 'T' || to_char(departure_date_time AT TIME ZONE 'UTC', 'HH24:MI:SS') || 'Z' as departureDate,
        (select airport_code from airport where airport_id = d.departure_airport_id) as departureAirport,
        (select airport_code from airport where airport_id = d.arrival_airport_id) as arrivalAirport,
         to_char(l.arrival_date_time AT TIME ZONE 'UTC', 'YYYY-MM-DD') || 'T' || to_char(l.arrival_date_time AT TIME ZONE 'UTC', 'HH24:MI:SS') || 'Z' as arrivalDate,
        'C' as serviceType,
        airType.aircraft_type as aircraftType,
        conf.configuration as aircraftConfiguration
from departure as d
        inner join local_inv_departure l
                on d.departure_id = l.departure_id
        inner join aircraft_configuration as conf
                on l.aircraft_configuration_id = conf.aircraft_configuration_id
        inner join aircraft_type as airType
                on airType.aircraft_type_id = conf.aircraft_type_id
where d.departure_id = ${departure_id}