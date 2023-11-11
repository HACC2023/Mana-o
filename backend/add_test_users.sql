select addUser('Taryn', 'Takebayashi', 'none', 'tarynet@hawaii.edu', 
   'tarynpass', '000-111-2222');
update users set approved = true where id=1;
insert into user_role (user_id, role_id) values (1,1);

select addUser('Jane', 'Doe', 'ABC Company', 'tetaryn@gmail.com',
   'janey', '000-123-4567');
select addUser('John', 'Smith', 'Aloha Divers', 'taryn.takebayashi@gmail.com', 
   'johnny', '000-234-5678');
