create or replace function split_string(_text text)
   returns bool as
   $$
      declare
         rec record;
         _vals text[];
         _val text;
      begin
         _vals := string_to_array(_text, ',');
         foreach _val in array _vals loop
            raise notice '%',_val;
         end loop;
         return true;
      end;
   $$
   language 'plpgsql';
   
create or replace function make_dobor_designation(_island text)
   returns text as
   $$
      declare
         _dob_designation text;
         _dob_parts text[];
         _dob_number integer;
         rec record;
      begin
         if _island = 'Offshore' then
            _dob_designation := 'NPG';
         elsif _island = 'Midway Atoll' then
            _dob_designation := 'MID';
         elsif _island = 'Oahu' then
            _dob_designation := 'OAH';
         elsif _island = 'Big Island' then
            _dob_designation := 'HAW';
         elsif _island = 'Kauai' then
            _dob_designation := 'KAU';
         elsif _island = 'Maui' then
            _dob_designation := 'MAU';
         elsif _island = 'Molokai' then
            _dob_designation := 'MOL';
         elsif _island = 'Lanai' then
            _dob_designation := 'LAN';
         end if;
         select into rec * from detections where dobor_designation 
            like _dob_designation || '%' order by dobor_designation desc 
            limit 1;
         if not found then
            _dob_designation := _dob_designation || '_' || '1';
         else
            _dob_parts := string_to_array(rec.dobor_designation,'_');
            _dob_number := cast(_dob_parts[2] as integer) + 1;
            _dob_number := cast(_dob_number as text);
            _dob_designation := _dob_designation || '_' || _dob_number;
         end if;
         return _dob_designation;
      end;
   $$
   language 'plpgsql';
   
create or replace function add_detection(_email text, _debris_type text, 
   _debris_container text, _boat_claim text, _biofouling_level numeric(2), 
   _gen_debris_loc text, _island text, _near_landmark text)
   returns bool as
   $$
      declare
         rec1 record;
         rec2 record;
         _reporter_id integer;
         _dob_desig text;
         _detection_id integer;
         _debris_types text[];
         _deb_type text;
         _new_reporter bool;
      begin
         select into rec1 * from reporters where email=_email;
         if not found then
            insert into reporters (email) values (_email);
            _reporter_id := currval('reporters_id_seq');
            _new_reporter = true;
         else
            _reporter_id := rec1.id;
            _new_reporter = false;
         end if;
         _debris_types := string_to_array(_debris_type, ',');
         foreach _deb_type in array _debris_types loop
            _dob_desig := make_dobor_designation(_island);
            insert into detections (dobor_designation, debris_type_detected, 
               debris_container, boat_claim, biofouling_level,
               general_debris_location,island, nearest_landmark) values 
               (_dob_desig, _deb_type,_debris_container, _boat_claim, 
                _biofouling_level, _gen_debris_loc, _island, _near_landmark);
            _detection_id := currval('detections_id_seq');
            insert into detection_reporter (detection_id, reporter_id) values 
               (_detection_id, _reporter_id);
         end loop;
         return _new_reporter;
      end;
   $$
   language 'plpgsql';
   create or replace function update_approved_users(_ids integer[])
      returns boolean as
      $$
         declare
            _uid integer;
         begin
            foreach _uid in array _ids loop
               update users set approved = true where id=_uid;
            end loop;
            return true;
         end;
      $$
      language 'plpgsql';
   
