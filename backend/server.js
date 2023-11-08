const express = require("express");
const cors = require("cors");
const db = require("./queries.js");

const app = express();

app.use(cors());
app.use(express.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true}));

// allow for use of middleware
app.use(function(req, res, next) {
   res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
   );
   next();
});

app.get("/", (req, res) => {
   res.json({ message: "Welcome to Malama Honua."});   
});
app.get("/users", db.getUsers);
app.get("/unapprovedusers", db.getUnapprovedUsers);
app.get("/detections", db.getDetections);
app.get("/removals", db.getRemovals);
app.post("/users/signup", db.createUser);
app.post("/users/signin", db.signin);
app.listen(8080, () => {
   console.log("Server running on port 8080");
});