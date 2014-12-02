BEGIN;

Insert into departure (
    departure_id   /* int4 */,
    departure_airport_id   /* int4 */,
    arrival_airport_id   /* int4 */,
    operating_carrier_code   /* varchar(3) */,
    marketing_carrier_code   /* varchar(3) */,
    flight_no   /* varchar(5) */,
    departure_date_time   /* timestamptz */,
    status   /* varchar(3) */,
    create_date_time   /* timestamptz */,
    carrier_customer_id   /* int4 */,
    last_update_date_time   /* timestamptz */,
    update_version   /* int4 */,
    operational_suffix   /* varchar(1) */)
select nextval('s_departure') as departure_id,
  (select airport_id from airport where airport_code = '${dep_airport_code}') as departure_airport_id,
  (select airport_id from airport where airport_code = '${arr_airport_code}') as arrival_airport_id,
  '${carrier_code}', '${carrier_code}', '${flight_no}', '${departure_date_time}', 'NEW', CURRENT_TIMESTAMP,
  (	select organisation_id
		from carrier_customer as cc inner join carrier as c on cc.main_carrier_id = c.carrier_id
		where carrier_code = '${carrier_code}'),
   CURRENT_TIMESTAMP, 0, '';


Insert into departure_group (
    departure_group_id   /* int4 */)
select nextval('s_departure_group');

Insert into departure_inventory (
    departure_inventory_id   /* serial */)
select nextval('s_departure_inventory');

Insert into local_inv_departure (
		    departure_id   /* int4 */,
		    departure_group_id   /* int4 */,
		    onward_carrier_code   /* varchar(3) */,
		    onward_flight_no   /* varchar(5) */,
		    arrival_date_time   /* timestamptz */,
		    source_file   /* varchar(256) */,
		    aircraft_configuration_id   /* int4 */,
		    onward_operational_suffix   /* varchar(1) */,
		    departure_inventory_id   /* int4 */,
		    last_booking_change   /* timestamptz */)
		select
		    currval('s_departure')   /* departure_id int4 */,
		    currval('s_departure_group')   /* departure_group_id int4 */,
		    null   /* onward_carrier_code varchar(3) */,
		    null   /* onward_flight_no varchar(5) */,
		    '${arrival_date_time}'   /* arrival_date_time timestamptz */,
		    'External change'   /* source_file varchar(256) */,
		    (
		    	select aircraft_configuration_id from aircraft_configuration as conf
		    		inner join aircraft_type as airType
		    			on conf.aircraft_type_id = airType.aircraft_type_id
						inner join carrier_customer as cc
							on airType.carrier_customer_id = cc.organisation_id
						inner join carrier as c
							on cc.main_carrier_id = c.carrier_id
		    	where conf.configuration = '${aircraftConfiguration}' and airType.aircraft_type = '${aircraftType}' and c.carrier_code = '${carrier_code}'
				)   /* aircraft_configuration_id int4 */,
		    null   /* onward_operational_suffix varchar(1) */,
		    356154   /* departure_inventory_id int4 */,
		    null   /* last_booking_change timestamptz */;
COMMIT;

select currval('s_departure_group');