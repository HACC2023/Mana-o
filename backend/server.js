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

app.post("/reset", (req, res) => {
    const { email } = req.body;
    console.log(email);

    db.checkExist(email, function(exists) {
        if (exists) {
            const verificationCode = generateVerificationCode();
            verificationCodes[email] = verificationCode;
            console.log(verificationCode);
            const mailOptions = {
                from: "feimeichen666@gmail.com",
                to: email,
                subject: "Reset Password",
                text: 'Your verification code is: ' + verificationCode,
                html: '<p>Your verification code is: ' + verificationCode + '</p>'
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ error: "Failed to send email" });
                }

                if (info && info.response) {
                    console.log("Email sent: " + info.response);
                    res.status(200).json({ message: "Email sent successfully" });
                } else {
                    console.log("Email sent, but no info.response available");
                    res.status(200).json({ message: "Email sent successfully" });
                }
            });
        } else {
            console.log("Email not found");
            res.status(400).json({ message: "Email not found" });
        }
    });
});


// Define a route to send an email
const verificationCodes = {};

app.post("/reset", (req, res) => {
    const { email } = req.body;
    console.log(email);

    db.checkExist(email, function(exists) {
        if (exists) {
            const verificationCode = generateVerificationCode();
            verificationCodes[email] = verificationCode;

            const mailOptions = {
                from: "feimeichen666@gmail.com",
                to: email,
                subject: "Reset Password",
                text: 'Your verification code is: ' + verificationCode,
                html: '<p>Your verification code is: ' + verificationCode + '</p>'
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ error: "Failed to send email" });
                }

                if (info && info.response) {
                    console.log("Email sent: " + info.response);
                    res.status(200).json({ message: "Email sent successfully" });
                } else {
                    console.log("Email sent, but no info.response available");
                    res.status(200).json({ message: "Email sent successfully" });
                }
            });
        } else {
            res.status(400).json({ message: "Email not found" });
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

app.post("/changepassword", (req, res) => {
    const { email, newPassword } = req.body;
    console.log(email);
    console.log(newPassword)

    db.updatePassword(email, newPassword, (success, error) => {
        if (success) {
            res.status(200).json({ message: "Password updated successfully" });
        } else {
            res.status(500).json({ error: "An error occurred" });
        }
    });
});

app.post("/sendEmailToApprovedUsers", (req, res) => {
    const { approvedUserEmails } = req.body;
    if (approvedUserEmails.length > 0) {
        const mailOptions = {
            from: "feimeichen666@gmail.com",
            to: approvedUserEmails,
            subject: "Your Approval Confirmation",
            text: "You have been approved as a user.",
            html: "<p>You have been approved as a user.</p>",
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ error: "Failed to send email" });
            }

            if (info && info.response) {
                console.log("Email sent: " + info.response);
                res.status(200).json({ message: "Email sent successfully" });
            } else {
                console.log("Email sent, but no info.response available");
                res.status(200).json({ message: "Email sent successfully" });
            }
        });
    } else {
        res.status(400).json({ message: "No approved users found" });
    }
});
