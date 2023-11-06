const pg = require("pg");


const connection = new pg.Pool({
   host: '127.0.0.1',
   user: 'taryn',
   password: 'tarynpass',
   database: 'honua'
});

function createUser(request, response) {
   const firstName = request.body.firstName;
   const lastName = request.body.lastName;
   const phoneNumber = request.body.phoneNumber;
   const email = request.body.email;
   const password = request.body.password;
   let company = request.body.company;
   console.log("first name:" + firstName);
   console.log(company);
   let sql = "select addUser(" + "'" + firstName + "','" + lastName + 
      "','" + company.trim() + "','" + email + "','" + password + "','" + 
      phoneNumber + "')";
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
         response.status(200).send({
            message: "authenticated"
         });
      }
      else {
         response.status(400).json({ message: 'invalid email or password' });
      }
   });
}

function getUsers(request, response) {
   let sql = 'select first_name, last_name, company, email, ' + 
      'phone_number from users where approved=true';
   connection.query(sql, function(err, results) {
      response.status(200).json(results.rows);
   });
}

function getUnapprovedUsers(request, response) {
   let sql = 'select first_name, last_name, company, email,' +
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
module.exports = { createUser, signin, getUsers, getUnapprovedUsers,
   getDetections, getReporters, getRemovals };
