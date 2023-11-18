drop function if exists add_detection;
drop function if exists make_dobor_designation;
drop function if exists update_detection;
drop function if exists update_approved_users;
drop function if exists add_removal;
drop function if exists update_removal;

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
   
create or replace function add_detection(_debris_type text, 
   _debris_container text, _boat_claim text, _biofouling_level numeric(2), 
   _gen_debris_loc text, _lat_long text, _island text, _near_landmark text,
   _debris_desc text, _image_filenames text, _ln text, _fn text, 
   _email text, _address text, _city text, _state text, _zip text, 
   _phone text)
   returns bool as
   $$
      declare
         rec1 record;
         rec2 record;
         _reporter_id integer;
         _dob_desig text;
         _detection_id integer;
         _detection_latitude numeric(15,7);
         _detection_longitude numeric(15,7);
         _lat_longs text[];
         _debris_types text[];
         _deb_type text;
         _new_reporter bool;
      begin
         select into rec1 * from reporters where email=_email;
         if not found then
            insert into reporters (last_name, first_name, email, address, 
               city, state, zipcode, phone_number) values 
               (_ln, _fn, _email, _address, _city, _state, _zip, _phone);
            _reporter_id := currval('reporters_id_seq');
            _new_reporter = true;
         else
            _reporter_id := rec1.id;
            _new_reporter = false;
         end if;
         perform(replace(_boat_claim,'''',''''''));
         _lat_longs := string_to_array(_lat_long, ' ');
         _detection_latitude := _lat_longs[1]::decimal;
         _detection_longitude := _lat_longs[2]::decimal;
         _debris_types := string_to_array(_debris_type, ',');
         _dob_desig := make_dobor_designation(_island);
         foreach _deb_type in array _debris_types loop
            insert into detections (dobor_designation, debris_type_detected, 
               debris_container, boat_claim, biofouling_level,
               general_debris_location,latitude, longitude, island, 
               nearest_landmark,debris_relative_location) values 
               (_dob_desig, _deb_type,_debris_container, _boat_claim, 
                _biofouling_level, _gen_debris_loc, _detection_latitude,
                _detection_longitude, _island, _near_landmark, _debris_desc);
            _detection_id := currval('detections_id_seq');
            insert into detection_reporter (detection_id, reporter_id) values 
               (_detection_id, _reporter_id);
         end loop;
         return _new_reporter;
      end;
   $$
   language 'plpgsql';

   create or replace function add_removal(_detect_id integer, _email text, _date_rem date,
    _lat numeric(12,7), _long numeric(12,7), _gen_loc text, _enviro text, 
    _vis_est numeric, _wild_entangle text, _num_people integer,
    _fishtime_lost numeric(4,1),_rem_tech text, _rem_photos_exist text)
    returns integer as
    $$
        declare
            rec record;
            _removal_id integer;
            _sql text;
        begin
            select * into rec from removals where detection_id=_detect_id;
            if found then
                _removal_id = rec.id;
                perform update_removal(_removal_id,_detect_id, _email, _date_rem,
                    _lat, _long, _gen_loc, _enviro, _vis_est, _wild_entangle,
                    _num_people, _fishtime_lost, _rem_tech, _rem_photos_exist);
            else 
                execute format('insert into removals (detection_id, contractor_email,'
                    ' date_removed, latitude, longitude, general_location, '
                    'environment, visual_estimate, wildlife_entanglement, '
                    'number_people_involved, fisherman_time_lost, removal_technique, '
                    'removal_photos_exist) values ($1, $2, $3, $4, $5, $6, '
                    '$7, $8, $9, $10, $11, $12, $13)') using _detect_id, _email, 
                    _date_rem, _lat, _long, _gen_loc, _enviro, _vis_est, 
                    _wild_entangle, _num_people, _fishtime_lost, _rem_tech,
                    _rem_photos_exist;
                _removal_id := currval('removals_id_seq');
                update detections set removal_id=_removal_id where id=_detect_id;
            end if;
         return _removal_id;
      end;
   $$
   language 'plpgsql';
   
   create or replace function update_removal(_removal_id integer,_detect_id integer, 
    _email text, _date_rem date, _lat numeric(12,7), _long numeric(12,7), 
    _gen_loc text, _enviro text, _vis_est numeric, _wild_entangle text, 
    _num_people integer, _fishtime_lost numeric(4,1),_rem_tech text, 
    _rem_photos_exist text)
    returns boolean as
    $$
        begin
            execute format('update removals set contractor_email=$1,'
                'date_removed=$2, latitude=$3, longitude=$4,'
                'general_location=$5, environment=$6, visual_estimate=$7,'
                'wildlife_entanglement=$8, number_people_involved=$9,'
                'fisherman_time_lost=$10, removal_technique=$11,'
                'removal_photos_exist=$12 where id=$13') using _email, _date_rem,
                _lat, _long, _gen_loc, _enviro, _vis_est, _wild_entangle,
                _num_people, _fishtime_lost, _rem_tech, _rem_photos_exist, _removal_id;
            return true;
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
   create or replace function update_detection(_id integer, _dobor text,
      _debrisType text, _debrisContainer text, _boatClaim text,
      _biofoulingLevel text, _genDebrisLoc text, _latitude numeric,
      _longitude numeric, _island text, _nearestLandmark text,
      _debrisRelLoc text,
      _debrisDesc text, _debrisImages text, _geoRegion text,
      _sciOrg text, _sciDocumenter text, _sciDebrisType text,
      _debrisPrimeMat text, _dfadPart text, _documentNotes text,
      _photographerName text, _animalsPresent text, _animalsPresentDesc text,
      _debrisLength numeric, _debrisWidth numeric, _debrisAvgHeight numeric,
      _debrisMaxHeight numeric, _debrisCircumferenece numeric,
      _debrisDimComments text)
      returns void as
      $$
         begin
            update detections set dobor_designation=_dobor,
               debris_type_detected=_debrisType,
               debris_container=_debrisContainer,
               boat_claim = _boatClaim,
               biofouling_level = _biofoulingLevel,
               general_debris_location = _genDebrisLoc,
               latitude = _latitude,
               longitude = _longitude,
               island = _island,
               nearest_landmark = _nearestLandmark,
               debris_relative_location = _debrisRelLoc,
               debris_description = _debrisDesc,
               debris_image_filenames = _debrisImages,
               geographic_region = _geoRegion,
               scientific_organization = _sciOrg,
               scientific_documenter = _sciDocumenter,
               scientific_debris_type = _sciDebrisType,
               debris_primary_material = _debrisPrimeMat,
               dfad_part = _dfadPart,
               documentation_notes = _documentNotes,
               photographer_name = _photographerName,
               animals_present = _animalsPresent,
               animals_present_description = _animalsPresentDesc,
               debris_length = _debrisLength,
               debris_width = _debrisWidth,
               debris_average_height = _debrisAvgHeight,
               debris_max_height = _debrisMaxHeight,
               debris_circumference = _debrisCircumferenece,
               debris_dimension_comments = _debrisDimComments
               where id = _id;
         end;
      $$
      language 'plpgsql';

