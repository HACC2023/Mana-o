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
app.use(express.urlencoded({extended: true}));

// allow for use of middleware
app.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

app.get("/", (req, res) => {
    res.json({message: "Welcome to Malama Honua."});
});
app.get("/users", db.getUsers);
app.get("/unapprovedusers", db.getUnapprovedUsers);
app.put("/approveusers", db.approveUsers);
app.get("/detections", db.getDetections);
app.get("/removals", db.getRemovals);
app.post("/users/signup", db.createUser);
app.post("/users/signin", db.signin);
app.post("/detections", db.addDetection);

const server = app.listen(8080, () => {
    console.log("Server running on port 8080");
});

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors:{
        origin: "http://localhost:8081",
    },
})

io.on("connection", (socket) => {
    console.log(`A user connected": ${socket.id}`);

    socket.on("join room", (room) => {
        // Join the specified room
        socket.join(room);
        console.log(`User with ID: ${socket.id} joined room: ${room}`);
    });

    socket.on("chat message", (data) => {
        console.log(data);
        console.log("Received message from client:", data.message);
        // Broadcast the message to all connected clients, including the sender
        socket.to(data.room).emit("receive message", data);
        //socket.emit("reveive message", message);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
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
        user: "manao.malamahonua@gmail.com",
        pass: "ygoy vdwy ibmf gatr",
    },
});

// Define a route to send an email
const verificationCodes = {};

app.post("/reset", (req, res) => {
    const {email} = req.body;

    db.checkExist(email, function (exists) {
        if (exists) {
            const verificationCode = generateVerificationCode();
            verificationCodes[email] = verificationCode;

            const mailOptions = {
                from: "manao.malamahonua@gmail.com",
                to: email,
                subject: "Reset Password",
                text: 'Your verification code is: ' + verificationCode,
                html: '<p>Your verification code is: ' + verificationCode + '</p>'
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({error: "Failed to send email"});
                }

                if (info && info.response) {
                    console.log("Email sent: " + info.response);
                    res.status(200).json({message: "Validation code has been sent to your email"});
                } else {
                    console.log("Email sent, but no info.response available");
                    res.status(200).json({message: "Validation code has been sent to your email"});
                }
            });
        } else {
            res.status(400).json({message: "Email not found"});
        }
    });
});


app.post("/verify", (req, res) => {
    const {email, code} = req.body;
    console.log(code);
    if (verificationCodes[email] && verificationCodes[email] === code) {
        res.status(200).json({message: "Verification successful"});
    } else {
        res.status(400).json({message: "Verification failed"});
    }
});

app.post("/changepassword", (req, res) => {
    const {email, newPassword} = req.body;

    db.updatePassword(email, newPassword, (success, error) => {
        if (success) {
            res.status(200).json({message: "Password updated successfully"});
        } else {
            res.status(500).json({error: "An error occurred"});
        }
    });
});


app.post("/sendEmailToApprovedUsers", (req, res) => {
    const {approvedUserEmails} = req.body;
    if (approvedUserEmails.length > 0) {
        approvedUserEmails.forEach((email) => {
            const mailOptions = {
                from: 'feimeichen666@gmail.com',
                to: email,
                subject: 'Your Approval Confirmation',
                text: 'You have been approved as a user.',
                html: '<p>You have been approved as a user.</p>',
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({error: "Failed to send email"});
                }

                if (info && info.response) {
                    console.log(`Email sent to ${email}: ${info.response}`);
                    res.status(200).json({message: "Email sent successfully"});
                } else {
                    console.log(`Email sent to ${email}, but no info.response available`);
                    res.status(200).json({message: "Email sent successfully"});
                }
            });
        });
    } else {
        res.status(400).json({message: "No approved users found"});
    }
});

app.post("/sendRegisterEmail", (req, res) => {
    const {email} = req.body;
    const mailOptions = {
        from: 'feimeichen666@gmail.com',
        to: email,
        subject: 'Your Registration Confirmation',
        html: `
            <p>Thank you for registering!</p>
            <p>Your registration has been received. Our team will review your information, and if approved, you will receive a confirmation email within 7 days.</p>
            <p>Thank you for choosing our service!</p>
        `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).json({error: "Failed to send email"});
        }

        if (info && info.response) {
            console.log(`Email sent to ${email}: ${info.response}`);
            res.status(200).json({message: "Email sent successfully"});
        } else {
            console.log(`Email sent to ${email}, but no info.response available`);
            res.status(200).json({message: "Email sent successfully"});
        }
    });
});


