"use strict";
exports.__esModule = true;
var authentication_1 = require("../../schema/authentication");
var email_function_1 = require("../../email-setup/email-function");
var path = require('path');
var request = require('request');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var express = require('express');
exports.auth = express.Router();
var jwt = require('jsonwebtoken');
var passport = require("passport");
var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var jwtOptions = {};
jwtOptions['jwtFromRequest'] = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions['secretOrKey'] = 'tasmanianDevil';
var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
});
passport.use(strategy);
exports.auth.use(passport.initialize());
exports.auth.use(bodyParser.json());
exports.auth.use(bodyParser.urlencoded({ 'extended': 'true' })); // parse userlication/x-www-form-urlencoded
exports.auth.use(bodyParser.json()); // parse userlication/json
exports.auth.use(bodyParser.json({ type: 'userlication/vnd.api+json' })); // parse userlication/vnd.api+json as json
// auth.use(methodOverride());
// auth.use(cors());
exports.auth.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
exports.auth.post('/signup', function (req, res) {
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    var hash = crypto.createHash('sha1').update(current_date + random).digest('hex');
    req.body.hash = hash;
    authentication_1.saveAuthentication(req.body)
        .then(function (resolve) {
        var payload = { id: resolve._id };
        var token = jwt.sign(payload, jwtOptions['secretOrKey']);
        resolve.data.token = token;
        authentication_1.updateTokenAuthentication(resolve)
            .then(function (resolve) {
            var hash = req.app.locals.webUrl + "/auth/confirm?hash=" + resolve.data.hash + "&id=" + resolve.data._id;
            email_function_1.SendingMail(resolve.data.email, "webconference", "Dear User " +
                "Thank you for being a part of Mustakbil.com, Pakistan's leading jobs site." +
                "In order to maintain quality of our services we have adopted various steps to verify contact details of users. Please click the below link to verify your email address." +
                "<a href=" + hash + ">Verify Email</a>");
            res.status(200).json({ message: "save user" });
        }, function (error) {
            res.status(401).json({ message: "User Not Saved" });
        });
    }, function (error) {
        res.status(401).json({ message: "User Not Saved" });
    });
});
exports.auth.get('/confirm', function (req, res) {
    var body = {
        hash: req.query.hash,
        _id: req.query.id
    };
    authentication_1.ConfirmAuthentication(body)
        .then(function (resolve) {
        if (resolve.data != null) {
            authentication_1.updateHashAuthentication(resolve.data)
                .then(function (resolve) {
                res.sendFile(path.join(__dirname, 'redirect.html'));
                // res.status(200).json({ email: resolve.data.email, token: resolve.data.token, isAdmin: resolve.data.isAdmin });
            }, function (error) {
                res.status(200).json({ message: error });
            });
        }
        else if (resolve.data.hash == null) {
            res.status(200).json({ message: 'User Activated!' });
        }
        else {
            res.status(204).json({ message: 'User Not Found!' });
        }
    }, function (error) {
        res.status(401).json({ message: error });
    });
    //res.sendFile(path.join(__dirname,'redirect.html'));
});
exports.auth.post('/confirmPassReq', function (req, res) {
    var current_date = (new Date()).valueOf().toString();
    var random = Math.random().toString();
    var hash = crypto.createHash('sha1').update(current_date + random).digest('hex');
    authentication_1.confirmPasswordReq(req.body, hash)
        .then(function (resolve) {
        if (resolve.data.resetPassReq) {
            var hash = req.app.locals.webUrl + "/auth/confirmPass?chash=" + resolve.data.chash
                + "&id=" + resolve.data._id;
            email_function_1.SendingMail(resolve.data.email, "webconference", "Dear User " +
                "You can change your password using the following link:" +
                "Change my password" +
                "If you did not initiate this request, please ignore this email. Your password will not change until you access the link above and create a new one." +
                "Thank you," +
                "The WebConference Team" +
                "<a href=" + hash + ">ResetPassword</a>");
            res.status(200).json({ data: { user: resolve.data.resetPassReq } });
        }
        else {
            res.status(200).json({ data: { user: resolve.data.resetPassReq } });
        }
    }, function (error) {
        console.log(error);
        res.status(204).json({ data: { user: 'user not found!' } });
    });
});
exports.auth.get('/confirmPass', function (req, res) {
    var object = {
        chash: req.query.chash,
        _id: req.query.id
    };
    authentication_1.confirmPassword(object)
        .then(function (resolve) {
        if (resolve.data != null) {
            res.sendFile(path.join(__dirname, 'resetPassword.html'));
            // res.status(200).json({ data: { user: true } });
        }
        else {
            res.status(200).json({ data: { user: false } });
        }
    }, function (error) {
        res.status(204).json({ message: "User not found" });
    });
});
exports.auth.post('/resetPassword', function (req, res) {
    authentication_1.updateUserPassword(req.body.password, req.body.chash, req.body.id)
        .then(function (resolve) {
        if (resolve) {
            res.status(200).json({ data: { user: true } });
        }
        else {
            res.status(200).json({ data: { user: false } });
        }
    }, function (error) {
        res.status(204).json({ message: "User not found" });
    });
});
