"use strict";
//import { request } from 'https';
exports.__esModule = true;
var authentication_1 = require("../../schema/authentication");
var post_1 = require("../../schema/post");
var email_function_1 = require("../../email-setup/email-function");
var express = require('express');
exports.user = express.Router();
var path = require('path');
var request = require('request');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var passport = require("passport");
var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var jwtOptions = {};
jwtOptions['jwtFromRequest'] = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions['secretOrKey'] = 'tasmanianDevil';
var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    console.log('payload received', jwt_payload);
});
passport.use(strategy);
exports.user.use(passport.initialize());
exports.user.use(bodyParser.json());
exports.user.use(bodyParser.urlencoded({ 'extended': 'true' })); // parse userlication/x-www-form-urlencoded
exports.user.use(bodyParser.json()); // parse userlication/json
exports.user.use(bodyParser.json({ type: 'userlication/vnd.api+json' })); // parse userlication/vnd.api+json as json
// user.use(methodOverride());
// user.use(cors());
exports.user.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
exports.user.all('/*', function (req, res, next) {
    next();
});
exports.user.post('/deleteUsers/', function (req, res) {
    var token = req.get('Authorization');
    req.query.token = token.replace("Bearer", "").replace(/ /g, '');
    authentication_1.findUser(req.query)
        .then(function (resolve) {
        if (resolve.data != null) {
            if (resolve.data.isAdmin) {
                authentication_1.userDelete(req.body)
                    .then(function (resolve) {
                    res.status(200).json({ data: { user: resolve.data } });
                }, function (error) {
                    res.status(200).json({ data: { user: 'user not found' } });
                });
            }
            else {
                res.status(404).json({ data: { user: 'user not found' } });
            }
        }
        else {
            res.status(204).json({ data: { user: 'user not found' } });
        }
    });
});
exports.user.post('/emailExist', function (req, res) {
    authentication_1.findEmailExist(req.body)
        .then(function (resolve) {
        if (resolve.data != null) {
            res.status(200).json({ data: { user: true } });
        }
        else {
            res.status(200).json({ data: { user: false } });
        }
    }, function (error) {
        res.status(204).json({ message: "Email not found" });
    });
});
exports.user.get('/userExist', function (req, res) {
    var user = { username: req.query.username };
    authentication_1.findEmailUser(user)
        .then(function (resolve) {
        if (resolve.data != null) {
            res.status(200).json({ data: { user: resolve.data } });
        }
        else {
            res.status(200).json({ data: { user: false, message: 'User Not Found!' } });
        }
    }, function (error) {
        res.status(204).json({ message: "User not found" });
    });
});
exports.user.post('/updateProfile', function (req, res) {
    var token = req.get('Authorization');
    req.body.token = token.replace("Bearer", "").replace(/ /g, '');
    authentication_1.updateUserProfile(req.body, req.body.token)
        .then(function (resolve) {
        if (resolve.data != null) {
            res.status(200).json({ data: { user: resolve.data } });
        }
        else {
            res.status(200).json({ data: { user: 0, message: 'User Not Found!' } });
        }
    }, function (error) {
        res.status(204).json({ message: "User not found" });
    });
});
exports.user.get('/emailUser', function (req, res) {
    var user = { username: req.query.username };
    authentication_1.findEmailUser(user)
        .then(function (resolve) {
        if (resolve.data != null) {
            res.status(200).json({ data: { user: resolve.data } });
        }
        else {
            res.status(200).json({ data: { user: "User not found" } });
        }
    }, function (error) {
        res.status(204).json({ message: "User not found" });
    });
});
exports.user.post('/authenticate', function (req, res) {
    authentication_1.findEmailExist(req.body)
        .then(function (resolve) {
        if (resolve.data != null) {
            authentication_1.findAuthentication(req.body)
                .then(function (resolve) {
                if (resolve.data != null) {
                    res.status(200).json({ user: resolve.data, expire: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) });
                }
                else {
                    res.status(200).json({ data: { user: null }, message: "password or email did not match" });
                }
            }, function (error) {
                res.status(204).json({ message: "User not found" });
            });
        }
        else {
            res.status(200).json({ data: { user: false }, message: "User not found" });
        }
    }, function (error) {
        res.status(204).json({ message: "User not found" });
    });
});
exports.user.get("/secret", passport.authenticate('jwt', { session: false }), function (req, res) {
    res.json({ message: "Success! You can not see this without a token" });
});
/*
user.get("/secretDebug",
    function (req, res, next) {
        console.log(req.get('Authorization'));
        next();
    }, function (req, res) {
        res.json("debugging");
    });

 */
exports.user.get('/F', function (req, res) {
    var token = req.get('Authorization');
    req.query.token = token.replace("Bearer", "").replace(/ /g, '');
    authentication_1.findUser(req.query)
        .then(function (resolve) {
        if (resolve.data != null) {
            if (resolve.data.isAdmin) {
                authentication_1.findAllUsers({})
                    .then(function (resolve) {
                    res.status(200).json({ users: resolve });
                }, function (error) {
                    res.status(200).json({ message: "error" });
                });
            }
            else {
                res.status(404).json({ message: "permission denied" });
            }
        }
        else {
            res.status(200).json({ data: { user: null }, message: "password or username did not match" });
        }
    }, function (error) {
        res.status(200).json({ message: "User not found" });
    });
});
exports.user.get('/users', function (req, res) {
    var token = req.get('Authorization');
    req.query.token = token.replace("Bearer", "").replace(/ /g, '');
    authentication_1.findUser(req.query)
        .then(function (resolve) {
        res.status(200).json({ users: resolve });
    }, function (error) {
        res.status(200).json({ message: "error" });
    });
});
exports.user.get('/user', function (req, res) {
    ///removing header
    /*   let token = req.get('Authorization');
      req.query.token = token.replace("Bearer", "").replace(/ /g, '');
   */
    authentication_1.findUser({ _id: req.query.userid })
        .then(function (resolve) {
        res.status(200).json({ users: resolve });
    }, function (error) {
        res.status(200).json({ message: "error" });
    });
});
exports.user.put('/users', function (req, res) {
    var object = {
        data: req.body
    };
    var token = req.get('Authorization');
    req.query.token = token.replace("Bearer", "").replace(/ /g, '');
    authentication_1.findUser(req.query)
        .then(function (resolve) {
        if (resolve.data != null) {
            if (resolve.data.isAdmin) {
                authentication_1.updateUser(object.data)
                    .then(function (resolve) {
                    res.status(200).json({ users: resolve });
                }, function (error) {
                    res.status(200).json({ message: "error" });
                });
            }
            else {
                res.status(404).json({ message: "permission denied" });
            }
        }
        else {
            res.status(200).json({ message: "User Not Found" });
        }
    });
});
exports.user.get('/getActiveStatus', function (req, res) {
    var token = req.get('Authorization');
    req.query.token = token.replace("Bearer", "").replace(/ /g, '');
    authentication_1.userActiveStatus(req.query)
        .then(function (resolve) {
        res.status(200).json({ users: resolve });
    }, function (error) {
        console.log(error);
        res.status(200).json({ message: "error" });
    });
});
exports.user.get('/resendEmailToken', function (req, res) {
    var token = req.get('Authorization');
    req.query.token = token.replace("Bearer", "").replace(/ /g, '');
    authentication_1.resendEmailToken(req.query._id, req.query.token)
        .then(function (resolve) {
        if (resolve.data) {
            var hash = req.app.locals.webUrl + "/auth/confirm?hash=" + resolve.data.hash + "&id=" + resolve.data._id;
            email_function_1.SendingMail(resolve.data.email, "webconference", "Dear User " +
                "Thank you for being a part of Mustakbil.com, Pakistan's leading jobs site." +
                "In order to maintain quality of our services we have adopted various steps to verify contact details of users. Please click the below link to verify your email address." +
                "<a href=" + hash + ">Verify Email</a>");
            res.status(200).json({ users: resolve });
        }
        else {
            res.status(200).json({ users: null }, { message: 'user not found' });
        }
    }, function (error) {
        console.log(error);
        res.status(200).json({ message: "error" });
    });
});
exports.user.get('/UserProfile', function (req, res) {
    authentication_1.getUserProfile(req.query)
        .then(function (resolve) {
        if (resolve.data != null) {
            res.status(200).json({ users: resolve });
        }
        else {
            res.status(200).json({ user: 0, message: "User Not Found" });
        }
    });
});
exports.user.get('/SingleUser', function (req, res) {
    authentication_1.getSingleUser(req.query)
        .then(function (resolve) {
        if (resolve.data != null) {
            res.status(200).json({ users: resolve });
        }
        else {
            res.status(200).json({ user: 0, message: "User Not Found" });
        }
    });
});
exports.user.post('/updateOtherInfo', function (req, res) {
    authentication_1.updateOtherInfo(req.query._id, req.body.data)
        .then(function (resolve) {
        if (resolve.data != null) {
            res.status(200).json({ users: resolve });
        }
        else {
            res.status(200).json({ user: 0, message: "Info Not Save" });
        }
    });
});
exports.user.post('/SavePost', function (req, res) {
    var token = req.get('Authorization');
    req.body.token = token.replace("Bearer", "").replace(/ /g, '');
    req.body.postedBy = req.query._id;
    post_1.savepost(req.body)
        .then(function (resolve) {
        if (resolve.data != null) {
            res.status(200).json({ data: { user: resolve.data } });
        }
        else {
            res.status(200).json({ data: { user: 0, message: 'Post Not Saved' } });
        }
    }, function (error) {
        res.status(204).json({ message: "Post Not Found" });
    });
});
exports.user.get('/UserPost', function (req, res) {
    var token = req.get('Authorization');
    req.body.token = token.replace("Bearer", "").replace(/ /g, '');
    post_1.getUserPost(req.query._id)
        .then(function (resolve) {
        if (resolve.data != null) {
            res.status(200).json({ data: { user: resolve.data } });
        }
        else {
            res.status(200).json({ data: { user: 0, message: 'Post Not Saved' } });
        }
    }, function (error) {
        res.status(204).json({ message: "Post Not Found" });
    });
});
exports.user.get('/AllJustPostedJob', function (req, res) {
    var token = req.get('Authorization');
    req.body.token = token.replace("Bearer", "").replace(/ /g, '');
    post_1.getJustPostedJob()
        .then(function (resolve) {
        if (resolve.data != null) {
            res.status(200).json({ data: { user: resolve.data } });
        }
        else {
            res.status(200).json({ data: { user: 0, message: 'Post Not Found' } });
        }
    }, function (error) {
        res.status(204).json({ message: "Post Not Found" });
    });
});
exports.user.get('/getServiceProvider', function (req, res) {
    var token = req.get('Authorization');
    req.body.token = token.replace("Bearer", "").replace(/ /g, '');
    authentication_1.getServiceProvider()
        .then(function (resolve) {
        if (resolve.data != null) {
            res.status(200).json({ data: { user: resolve.data } });
        }
        else {
            res.status(200).json({ data: { user: 0, message: 'Post Not Saved' } });
        }
    }, function (error) {
        res.status(204).json({ message: "Post Not Found" });
    });
});
exports.user.get('/toHire', function (req, res) {
    var token = req.get('Authorization');
    req.body.token = token.replace("Bearer", "").replace(/ /g, '');
    var q = req.query.exprty;
    var b = q.indexOf('=');
    var _id = q.substring(b + 1, q.length);
    var c = q.indexOf('?');
    var experty = q.substring(0, c);
    post_1.getToHire(_id, experty)
        .then(function (resolve) {
        if (resolve.data != null) {
            res.status(200).json({ data: { user: resolve.data } });
        }
        else {
            res.status(200).json({ data: { user: 0, message: 'Post Not Saved' } });
        }
    }, function (error) {
        res.status(204).json({ message: "Post Not Found" });
    });
});
exports.user.post('/ConfirmHire', function (req, res) {
    var token = req.get('Authorization');
    req.body.token = token.replace("Bearer", "").replace(/ /g, '');
    authentication_1.updateUserStatus(req.body)
        .then(function (resolve) {
        if (resolve.data != null) {
            post_1.ConfirmHire(req.query._id, req.body)
                .then(function (resolve) {
                if (resolve.data != null) {
                    res.status(200).json({ data: { user: resolve.data } });
                }
                else {
                    res.status(200).json({ data: { user: 0, message: 'Post Not Saved' } });
                }
            }, function (error) {
                res.status(204).json({ message: "Post Not Found" });
            });
        }
        else {
            res.status(200).json({ data: { user: 0, message: 'Post Not Saved' } });
        }
    }, function (error) {
        res.status(204).json({ message: "Post Not Found" });
    });
});
exports.user.post('/SaveReview', function (req, res) {
    var token = req.get('Authorization');
    req.body.token = token.replace("Bearer", "").replace(/ /g, '');
    post_1.CompleteJob(req.body)
        .then(function (resolve) {
        if (resolve.data != null) {
            res.status(200).json({ data: { user: resolve.data } });
        }
        else {
            res.status(200).json({ data: { user: 0, message: 'Post Not Saved' } });
        }
    }, function (error) {
        res.status(204).json({ message: "Post Not Found" });
    });
});
exports.user.post('/profile', function (req, res) {
    var token = req.get('Authorization');
    req.body.token = token.replace("Bearer", "").replace(/ /g, '');
    post_1.WorkerProfile(req.body)
        .then(function (resolve) {
        if (resolve.data != null) {
            res.status(200).json({ data: { user: resolve.data } });
        }
        else {
            res.status(200).json({ data: { user: 0, message: 'Post Not Saved' } });
        }
    }, function (error) {
        res.status(204).json({ message: "Post Not Found" });
    });
});
exports.user.get('/getUserData', function (req, res) {
    var q = req.query.id;
    var b = q.indexOf('=');
    var _id = q.substring(b + 1, q.length);
    var c = q.indexOf('?');
    var userid = q.substring(0, c);
    console.log(userid, _id);
    authentication_1.getHiringUser(userid)
        .then(function (resolve) {
        if (resolve.data != null) {
            res.status(200).json({ data: { user: resolve.data } });
        }
        else {
            res.status(200).json({ data: { user: 0, message: 'User Not Saved' } });
        }
    }, function (error) {
        res.status(204).json({ message: "User Not Found" });
    });
});
