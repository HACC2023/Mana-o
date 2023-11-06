create or replace function checkForEmail(_email text)
   returns integer as
   $$
      declare 
         rec record;
      begin
         select into rec * from users where email=_email;
         if not found then
            return 0;
         else
            return rec.id;
         end if;
      end;
   $$
   language 'plpgsql';
   
create or replace function addUser(_fn text, _ln text, _company text, 
   _email text, _pass text, _phone text)
   returns integer as
   $$
      declare
         rec record;
         _uid integer;
         _salt text;
         _hash text;
         _approved bool;
         _sql text;
         _role_id integer;
      begin
         _uid := checkForEmail(_email);
         if (_uid > 0) then
            return -1;
         else
            _salt := gen_salt('bf', 8);
            _hash := crypt(_pass, _salt);
            _approved := false;
            _sql := 'insert into users (first_name, last_name, company, 
               email, password, phone_number, approved) values ' ||
               '(' || quote_literal(_fn) || ',' || quote_literal(_ln) 
               || ',' || quote_literal(_company) || ',' || 
               quote_literal(_email) || ',' || quote_literal(_hash) 
               || ',' || quote_literal(_phone) || ',' 
               || _approved || ')';
            execute _sql;
            _uid = currval('users_id_seq');
            insert into user_role (user_id, role_id) values (_uid, 2);
            return _uid;
         end if;
      end;
   $$
   language 'plpgsql';
   
create or replace function check_id(_email text, _pass text)
   returns integer as
   $$
      declare
         rec record;
         rec2 record;
         _matches bool;
      begin
         select into rec * from users where email=_email and approved=true;
         if found then
            if rec.approved = true then
               select into rec2 * from users where email=_email and 
                  rec.password = crypt(_pass, rec.password);
               if found then
                  return rec.id;
               else
                  return -2;
               end if;
            end if;
         else
            return -1;
         end if;
         
      end;
   $$
   language 'plpgsql';
