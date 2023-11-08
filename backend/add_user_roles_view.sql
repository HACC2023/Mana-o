drop view if exists user_roles_view;

create view user_roles_view as
   select users.id as uid, roles.id as rid, roles.role from 
   users join user_role on users.id=user_role.user_id join
   roles on user_role.role_id=roles.id;
