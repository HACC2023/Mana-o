drop view if exists detection_storage_view;

create view detection_storage_view as
    select detections.id as det_id, dobor_designation, debris_type_detected, island,
    storage.id as st_id, storage.location, date_wet_mass_measured, wet_mass,
    date_dry_mass_measured, dry_mass, disposal_method, users.email from 
    detections left join storage on detections.id=storage.detection_id left join
    users on storage.contractor_email=users.email order by det_id;
