const pg = require("pg");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

const connection = new pg.Pool({
   host: '127.0.0.1',
   user: 'taryn',
   password: 'tarynpass',
   database: 'honua'
});

function createUser(request, response) {
   const first_name = request.body.firstName;
   const last_name = request.body.lastName;
   const phone_number = request.body.phoneNumber;
   const email = request.body.email;
   const password = request.body.password;
   let company = request.body.company;
   let sql = "select addUser(" + "'" + first_name + "','" + last_name + 
      "','" + company.trim() + "','" + email + "','" + password + "','" + 
      phone_number + "')";
   connection.query(sql, function(err, results) {
      if (results.rows[0].adduser > 0) {
         response.status(201).send('User created\n');
      }
      else {
         response.status(400).json({ message: 'email exists' });
      }
   });
}

function addDetection(request, response) {
   const debris_type = request.body.debris_type_detected;
   const debris_container = request.body.debris_container;
   const boat_claim = request.body.boat_claim;
   const bio_level = request.body.bio_level;
   const gen_debris_loc = request.body.gen_debris_location;
   let lat_long = request.body.lat_long;
   const island = request.body.island;
   const near_landmark = request.body.near_landmark;
   const debris_desc = request.body.debris_desc;
   const image_filenames = request.body.image_filenames;
   const last_name = request.body.last_name;
   const first_name = request.body.first_name;
   const email = request.body.email;
   const address = request.body.address;
   const city = request.body.city;
   const state = request.body.state;
   const zip = request.body.zip;
   const phone = request.body.phone;
   let tokens = lat_long.split(" ");
   if (tokens.length !== 2){
      lat_long = '0 0';
   }
   else if (isNaN(tokens[0]) || isNaN(tokens[1])) {
      lat_long = '0 0';
   }
   let sql = "select add_detection('" + debris_type + "','" +
      debris_container + "','" + boat_claim + "'," + bio_level +
      ",'" + gen_debris_loc + "','" + lat_long + "','" + island + 
      "','" + near_landmark + "','" + debris_desc + "','" + 
      image_filenames + "','" + last_name + "','" + first_name + 
      "','" + email + "','" + address + "','" + city + "','" + 
      state + "','" + zip + "','" + phone + "')"
   console.log(sql);
   connection.query(sql, function(err, results) {
      if(err) {
         console.log(err);
      }
      console.log("results: " + results);
   });
}

function signin(request, response) {
   const supplied_pass = request.body.password;
   const email = request.body.email;
   let sql = "select check_id(" + "'" + email + "','" + supplied_pass + 
      "')";
   connection.query(sql, function(err, results) {
      if (results.rows[0].check_id > 0) {
         let sql2 = "select * from users where email='" + email + "'";
         connection.query(sql2,function(err, results2) {
            const token = jwt.sign(
               { id: results2.rows[0].id},
               config.secret,
               {
                  algorithm: 'HS256',
                  allowInsecureKeySizes: true,
                  expiresIn: 86400, // 24 hours
               }
            );
            const id = results2.rows[0].id;
            let sql3 = "select * from user_roles_view where uid=" + id;
            connection.query(sql3, function(err, results3) {
               let added_roles = [];
               for (let i = 0; i < results3.rows.length; i++) {
                  added_roles.push(results3.rows[i].role);
               }
               response.status(200).send({
                  id: id,
                  first_name: results2.rows[0].first_name,
                  last_name: results2.rows[0].last_name,
                  phone_number: results2.rows[0].phone_number,
                  email: results2.rows[0].email,
                  roles: added_roles,
                  accessToken: token
               });
            });
         });
      }
      else {
         response.status(400).json({ message: 'invalid email or password' });
      }
   });
}

function getUsers(request, response) {
   let sql = 'SELECT\n' +
       '  users.id AS id,\n' +
       '  first_name,\n' +
       '  last_name,\n' +
       '  company,\n' +
       '  email,\n' +
       '  phone_number,\n' +
       '  ARRAY_AGG(roles.role) AS roles\n' +
       'FROM\n' +
       '  users\n' +
       'JOIN\n' +
       '  user_role ON users.id = user_role.user_id\n' +
       'JOIN\n' +
       '  roles ON user_role.role_id = roles.id\n' +
       'WHERE\n' +
       '  approved = true\n' +
       'GROUP BY\n' +
       '  users.id, first_name, last_name, company, email, phone_number;';
   connection.query(sql, function(err, results) {
      response.status(200).json(results.rows);
   });
}

function getUnapprovedUsers(request, response) {
   let sql = 'select id, first_name, last_name, company, email,' +
      'phone_number, approved from users where approved=false';
   connection.query(sql, function(err, results) {
      response.status(200).json(results.rows);
   });
}

function getDetections(request, response) {
   let sql = 'select * from detections';
   connection.query(sql, function(err, results) {
      response.status(200).json(results.rows);
   });
}

function getReporters(request, response) {
   let sql = 'select * from reporters';
   connection.query(sql, function(err, results) {
      response.status(200).json(results.rows);
   });
}

function getRemovals(request, response) {
   let sql = 'select * from reporters';
   connection.query(sql, function(err, results) {
      response.status(200).json(results.rows);
   });
}
function approveUsers(request, response) {
   const user_ids = request.body.approvedUserIds;
   let sql = 'select update_approved_users(array[' +user_ids +'])';
   connection.query(sql, function(err, results) {
      response.status(201).send({message: 'users updated'});
   });
}

function checkExist(email, callback) {
   const sql = 'SELECT email FROM users WHERE email = $1';

   connection.query(sql, [email], function(err, results) {
      if (err) {
         console.error(err);
         callback(false, err);
      } else {
         const exists = results.rows.length > 0;
         callback(exists, null);
      }
   });
}
function updatePassword(email, newPassword, callback) {
   const sql = 'SELECT update_password($1, $2)';
   connection.query(sql, [email, newPassword], (error, results) => {
      if (error) {
         console.error(error);
         callback(false, error);
      } else {

         const resultCode = results.rows[0].update_password;
         if (resultCode === 1) {
            callback(true, null);
         } else if (resultCode === -1) {
            callback(false, 'User not found or not approved');
         } else {
            console.log("good!");
            callback(false, 'Password update failed');
         }
      }
   });
}


module.exports = { createUser, signin, getUsers, getUnapprovedUsers,
   getDetections, getReporters, getRemovals, approveUsers, checkExist, updatePassword, addDetection };
