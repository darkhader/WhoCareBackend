const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session')
const app = express();
var request = require('request');
const fs = require('fs')
const https = require('https')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
    secret: "keybroadhero",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: false,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}))
app.use(cors({
    origin: ["https://localhost:3000"
    ], credentials: true
}));

var anaRouter = express.Router();
var userRouter = express.Router();
anaRouter.route('/anaRoute')
    .post(function (req, res) {
        console.log("req", JSON.stringify(req.body));
        request({
            method: 'GET',
            body: JSON.stringify(req.body),
            uri: 'https://reader_habit.ngrok.io/v1/facebook/user/network',
            headers: {
                'Authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NjMxMjY3MjgsImlhdCI6MTU3NjcyNjcyMywic3ViIjoiZ3Vlc3QifQ.iHeDDkHYeNUXyKaUg6mGzdWzSpLXXmCUlLhz9TDzhrg',
                "Content-Type": "application/json"


            }
        }, function (error, response, body) {


            console.log("body", body);

            if (!error && response.statusCode == 200) {
                res.json({ success: 1,body });
            }
            else {
                console.log("error", error);

            }
        })
    });
userRouter.route('/userRoute')
    .post(function (req, res) {
        request({
            method: 'GET',
            body: JSON.stringify(req.body),
            uri: 'reader_habit.ngrok.io/v1/facebook/user/profile',
            headers: {
                'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NjMxMjY3MjgsImlhdCI6MTU3NjcyNjcyMywic3ViIjoiZ3Vlc3QifQ.iHeDDkHYeNUXyKaUg6mGzdWzSpLXXmCUlLhz9TDzhrg',
                "Content-Type": "application/json"
            }
        }, function (error, response, body) {


            console.log("body", body);

    
            if (!error && response.statusCode == 200) {
                res.json({ success: 1,body });
            }
            else {
                console.log("error", error);

            }
        })
    });

app.use('/api', anaRouter);
// Middleware
const port = process.env.PORT || 9999;
https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}, app)
    .listen(port, function () {
        console.log("Listen at port " + port)
    })
