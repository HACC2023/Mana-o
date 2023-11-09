const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const db = require("./queries.js");
const nodemailer = require('nodemailer');

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

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
    res.json({ message: "Welcome to Malama Honua." });
});
app.get("/users", db.getUsers);
app.get("/unapprovedusers", db.getUnapprovedUsers);
app.put("/approveusers", db.approveUsers);
app.get("/detections", db.getDetections);
app.get("/removals", db.getRemovals);
app.post("/users/signup", db.createUser);
app.post("/users/signin", db.signin);
app.post("/users/email", db.checkExist);

app.listen(8080, () => {
    console.log("Server running on port 8080");
});

const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create a transporter object
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: "feimeichen666@gmail.com",
        pass: "tkqi mnzi rptl lbws ",
    },
});

app.get("/rest",(req,res) =>{
    console.log(re.body);
});

// Define a route to send an email
const verificationCodes = {};

app.post("/reset", (req, res) => {
    const verificationCode = generateVerificationCode();
    const { email } = req.body;
    verificationCodes[email] = verificationCode;

    const mailOptions = {
        from: "feimeichen666@gmail.com",
        to: email,
        subject: "Reset Password",
        text: 'Your verification code is:' + verificationCode,
        html: '<p>Your verification code is:</p>' + verificationCode
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).json({ error: "Failed to send email" });
        } else {
            console.log("Email sent: " + info.response);
            res.status(200).json({ message: "Email sent successfully" });
        }
    });
});

app.post("/verify", (req, res) => {
    const { email, code } = req.body;
    console.log(code);
    if (verificationCodes[email] && verificationCodes[email] === code) {
        res.status(200).json({ message: "Verification successful" });
    } else {
        res.status(400).json({ message: "Verification failed" });
    }
});
