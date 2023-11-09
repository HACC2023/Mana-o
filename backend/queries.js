const pg = require("pg");
//const bcrypt = require("bcrypt");
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
   let sql = 'select id, first_name, last_name, company, email, ' + 
      'phone_number from users where approved=true';
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

// function checkExist(request, response) {
//    let sql = 'SELECT email FROM users WHERE approved = true';
//    connection.query(sql, function(err, results) {
//       response.status(200).json(results.rows);
//    });
// }


module.exports = { createUser, signin, getUsers, getUnapprovedUsers,
   getDetections, getReporters, getRemovals, approveUsers };
