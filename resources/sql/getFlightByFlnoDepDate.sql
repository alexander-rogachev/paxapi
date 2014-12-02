select  d.departure_id
from departure as d
where d.operating_carrier_code = '${prefix}' and d.flight_no = '${flno}' and d.departure_date_time = '${departureDate}' and d.status = 'NEW'