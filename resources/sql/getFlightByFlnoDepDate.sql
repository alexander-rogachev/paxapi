select  dg.departure_group_id
from departure as d
	inner join local_inv_departure l
                on d.departure_id = l.departure_id
        inner join departure_group dg
		 on dg.departure_group_id = l.departure_group_id
where d.operating_carrier_code = '${prefix}' and d.flight_no = '${flno}' and d.departure_date_time = '${departureDate}' and d.status = 'NEW'