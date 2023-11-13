drop table if exists detections cascade;
drop table if exists reporters cascade;
drop table if exists detection_reporter cascade;
drop table if exists removals cascade;
drop table if exists removal_contractor cascade;
drop table if exists transports cascade;
drop table if exists storage cascade;
drop table if exists transport_storage;
drop table if exists users cascade;
drop table if exists roles cascade;
drop table if exists user_role cascade;

create table detections(
   id serial,
   removal_id int unique,
   dobor_designation text,
   debris_type_detected text,
   debris_container text,
   boat_claim text,
   biofouling_level numeric(2),
   general_debris_location text,
   latitude numeric(12,7),
   longitude numeric(12,7),
   island text,
   nearest_landmark text,
   debris_relative_location text,
   debris_description text,
   debris_image_filenames text,
   date_detected timestamp default NOW(),
   geographic_region text,
   scientific_organization text,
   scientific_documenter text,
   scientific_debris_type text,
   debris_primary_material text,
   dfad_part text,
   documentation_notes text,
   photographer_name text,
   animals_present boolean,
   animals_present_description text,
   debris_length numeric(10,2),
   debris_width numeric(10,2),
   debris_average_height numeric(10,2),
   debris_max_height numeric(10,2),
   debris_circumference numeric(10,2),
   debris_dimension_comments text,
   primary key (id)
);
   
create table users(
   id serial,
   first_name text,
   last_name text,
   company text,
   email text unique,
   password text,
   phone_number text,
   approved boolean default false,
   primary key (id)
);

create table removals(
   id serial,
   detection_id int unique references detections(id),
   contractor_email text references users(email),
   date_removed date default null,
   time_removed time default null,
   latitude numeric(12,7) default null,
   longitude numeric(12,7) default null,
   general_location text,
   environment text,
   visual_estimate numeric,
   wildlife_entanglement text,
   number_people_involved int,
   fisherman_time_lost numeric(4,1) default null,
   removal_technique text,
   removal_photos_exist text,
   primary key (id)
);
   
create table reporters (
   id serial,
   last_name text,
   first_name text,
   email text unique,
   address text,
   city text,
   state text,
   zipcode text,
   phone_number text,
   primary key (id)
);


create table removal_contractor(
   contractor_id int references users(id),
   removal_id int references removals(id),
   primary key (contractor_id, removal_id)
);

create table detection_reporter(
   detection_id int references detections(id),
   reporter_id int references reporters(id),
   primary key (detection_id, reporter_id)
);

create table transports(
   id serial,
   detection_id int references detections(id),
   contractor_email text references users(email),
   date_transported date default null,
   primary key (id)
);

create table storage(
   id serial,
   contractor_email text references users(email),
   location text,
   date_stored date default null,
   date_moved_indoors date default null,
   time_moved_indoors time default null,
   weight numeric(15,2),
   date_wet_mass_measured date default null,
   wet_mass_organization_name text,
   person_measuring_wet_mass text,
   scale_type text,
   number_days_before_wet_mass int,
   degree_of_saturation int,
   saturation_description text,
   wet_mass numeric(15,2),
   date_dry_mass_measured date default null,
   dry_mass_organization_name text,
   number_days_before_dry_mass int,
   dry_mass numeric(15,2),
   dry_mass_comments text,
   estimated_nonmeasured_dry_mass numeric(15,2),
   gear_shape text,
   estimated_surface_area numeric(15,2),
   estimated_acres numeric(15,7),
   
   primary key (id)
);

create table transport_storage(
   transport_id int references transports(id),
   storage_id int references storage(id)
);
    
create table roles(
    id serial,
    role text,
    primary key (id)
);    
create table user_role(
    user_id int references users(id),
    role_id int references roles(id),
    primary key (user_id, role_id)
);
   
