
import { updateUserProfile, updateUserPassword, updateUser, userDelete, confirmPassword, confirmPasswordReq, findEmailExist, ConfirmAuthentication, updateHashAuthentication, saveAuthentication, findAuthentication, findAllUsers, updateTokenAuthentication, findUser, userActiveStatus, findEmailUser } from '../../schema/authentication'
import { SendingMail } from '../../email-setup/email-function'


import { Response, Express, Request } from 'express'
let path = require('path');


let request = require('request');
var bodyParser = require('body-parser');
const crypto = require('crypto');


let express = require('express');
export var auth = express.Router();


var jwt = require('jsonwebtoken');
var passport = require("passport");
var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {}
jwtOptions['jwtFromRequest'] = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions['secretOrKey'] = 'tasmanianDevil';

var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {

});

passport.use(strategy);

auth.use(passport.initialize());




auth.use(bodyParser.json());
auth.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse userlication/x-www-form-urlencoded
auth.use(bodyParser.json());                                     // parse userlication/json
auth.use(bodyParser.json({ type: 'userlication/vnd.api+json' })); // parse userlication/vnd.api+json as json
// auth.use(methodOverride());
// auth.use(cors());
auth.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



auth.post('/signup', (req, res) => {


    let current_date = (new Date()).valueOf().toString();
    let random = Math.random().toString();
    let hash = crypto.createHash('sha1').update(current_date + random).digest('hex');
    req.body.hash = hash;
    saveAuthentication(req.body)
        .then((resolve) => {
            var payload = { id: resolve._id };
            var token = jwt.sign(payload, jwtOptions['secretOrKey']);
            resolve.data.token = token;
            updateTokenAuthentication(resolve)
                .then((resolve) => {

                    var hash =  req.app.locals.webUrl+"/auth/confirm?hash=" + resolve.data.hash + "&id=" + resolve.data._id;

                    SendingMail(resolve.data.email,
                        "webconference",
                        "Dear User " +
                        "Thank you for being a part of Mustakbil.com, Pakistan's leading jobs site." +
                        "In order to maintain quality of our services we have adopted various steps to verify contact details of users. Please click the below link to verify your email address." +
                        "<a href=" + hash + ">Verify Email</a>"

                    )
                    res.status(200).json({ message: "save user" });
                }, (error) => {
                    res.status(401).json({ message: "User Not Saved" });
                })
        }, (error) => {
            res.status(401).json({ message: "User Not Saved" });
        })



})


auth.get('/confirm', (req, res: Response) => {

    let body = {
        hash: req.query.hash,
        _id: req.query.id
    }

    ConfirmAuthentication(body)
        .then((resolve) => {

            if (resolve.data != null) {

                updateHashAuthentication(resolve.data)
                    .then((resolve) => {
                        res.sendFile(path.join(__dirname, 'redirect.html'));
                        // res.status(200).json({ email: resolve.data.email, token: resolve.data.token, isAdmin: resolve.data.isAdmin });
                    }, (error) => {
                        res.status(200).json({ message: error });
                    })
            }
            else if (resolve.data.hash == null) {
                res.status(200).json({ message: 'User Activated!' });
            }
            else {
                res.status(204).json({ message: 'User Not Found!' });
            }
        }, (error) => {
            res.status(401).json({ message: error });
        })
    //res.sendFile(path.join(__dirname,'redirect.html'));
})




auth.post('/confirmPassReq', (req, res: Response) => {

    let current_date = (new Date()).valueOf().toString();
    let random = Math.random().toString();
    let hash = crypto.createHash('sha1').update(current_date + random).digest('hex');

    confirmPasswordReq(req.body, hash)
        .then((resolve) => {
            if (resolve.data.resetPassReq) {
                var hash =  req.app.locals.webUrl+"/auth/confirmPass?chash=" + resolve.data.chash
                    + "&id=" + resolve.data._id;

                SendingMail(resolve.data.email,
                    "webconference",
                    "Dear User " +
                    "You can change your password using the following link:" +
                    "Change my password" +
                    "If you did not initiate this request, please ignore this email. Your password will not change until you access the link above and create a new one." +
                    "Thank you," +
                    "The WebConference Team" +
                    "<a href=" + hash + ">ResetPassword</a>"

                )

                res.status(200).json({ data: { user: resolve.data.resetPassReq } });
            }
            else {
                res.status(200).json({ data: { user: resolve.data.resetPassReq } });
            }

        }, (error) => {

            console.log(error);
            res.status(204).json({ data: { user: 'user not found!' } });
        })


})



auth.get('/confirmPass', (req, res: Response) => {

    let object = {
        chash: req.query.chash,
        _id: req.query.id
    }

    confirmPassword(object)
        .then((resolve) => {

            if (resolve.data != null) {
                res.sendFile(path.join(__dirname, 'resetPassword.html'));
                // res.status(200).json({ data: { user: true } });
            }
            else {
                res.status(200).json({ data: { user: false } });
            }
        }, (error) => {
            res.status(204).json({ message: "User not found" });
        })
})

auth.post('/resetPassword', (req, res) => {
    updateUserPassword(req.body.password, req.body.chash, req.body.id)
        .then((resolve) => {

            if (resolve) {
                res.status(200).json({ data: { user: true } });
            }
            else {
                res.status(200).json({ data: { user: false } });
            }
        }, (error) => {
            res.status(204).json({ message: "User not found" });
        })

})
