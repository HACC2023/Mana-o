const express = require("express");
const cors = require("cors");
const db = require("./queries.js")

const app = express();

/*
    The Node service must run on a different port than the React application.
    Allows requests from the React app running at port 8081. Must change to deployment url later.
*/
let corsOptions = {
    origin: "http://locahost:8081"
}

const {checkEmailExists} = require("./middleware/checkEmailExists.js");

app.use(cors(corsOptions));
app.use(express.json);
app.use(express.urlencoded({extended:true}));

app.use(function(req,res,next){
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token,Origin,Content-Type,Accept"
    );
    next();
});

app.get("/", (req,res) => {
    res.json({message: "Welcome to Malama Honua Backend."});
})
app.listen(8080, () => {
    console.log("Server running on Port 8080")
})


