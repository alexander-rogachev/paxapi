update departure
set status = 'CNL'
where departure_id  =
(
select l.departure_id
	from departure_group dg
        inner join local_inv_departure l
                on dg.departure_group_id = l.departure_group_id
         where dg.departure_group_id = ${departure_group_id}
 )

