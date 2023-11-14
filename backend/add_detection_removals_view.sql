drop view if exists detection_removals_view;

create view detection_removals_view as
   select detections.id as det_id, dobor_designation, debris_type_detected,
   island, removals.id as rem_id, contractor_email, date_removed, users.company 
   from detections left join removals on detections.id=removals.detection_id 
   left join users on removals.contractor_email=users.email order by det_id;
