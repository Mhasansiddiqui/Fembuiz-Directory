
//import { request } from 'https';

import { getUserProfile, resendEmailToken,getServiceProvider ,updateUserProfile, updateUser, getSingleUser, userDelete, confirmPassword, confirmPasswordReq, findEmailExist, ConfirmAuthentication, updateHashAuthentication, saveAuthentication, findAuthentication, findAllUsers, updateTokenAuthentication, findUser, userActiveStatus, findEmailUser, updateOtherInfo } from '../../schema/authentication'
import { savepost, getToHire,getUserPost, getJustPostedJob } from '../../schema/post'
import { SendingMail } from '../../email-setup/email-function'

import { json } from 'body-parser';

let express = require('express');

export var user = express.Router();

let path = require('path');
let request = require('request');
var bodyParser = require('body-parser');
const crypto = require('crypto');
var jwt = require('jsonwebtoken');
var passport = require("passport");
var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {}
jwtOptions['jwtFromRequest'] = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions['secretOrKey'] = 'tasmanianDevil';

var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    console.log('payload received', jwt_payload);
});

passport.use(strategy);

user.use(passport.initialize());




user.use(bodyParser.json());
user.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse userlication/x-www-form-urlencoded
user.use(bodyParser.json());                                     // parse userlication/json
user.use(bodyParser.json({ type: 'userlication/vnd.api+json' })); // parse userlication/vnd.api+json as json
// user.use(methodOverride());
// user.use(cors());
user.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

import { Response, Express, Request } from 'express'
user.all('/*', (req: Request, res: Response, next) => {

    next();
});


user.post('/deleteUsers/', (req, res: Response) => {

    let token = req.get('Authorization');
    req.query.token = token.replace("Bearer", "").replace(/ /g, '');

    findUser(req.query)
        .then((resolve) => {
            if (resolve.data != null) {
                if (resolve.data.isAdmin) {
                    userDelete(req.body)
                        .then((resolve) => {
                            res.status(200).json({ data: { user: resolve.data } });
                        }, (error) => {
                            res.status(200).json({ data: { user: 'user not found' } });
                        })
                }
                else {
                    res.status(404).json({ data: { user: 'user not found' } });
                }
            }
            else {
                res.status(204).json({ data: { user: 'user not found' } });
            }

        })
})

user.post('/emailExist', (req, res) => {
    findEmailExist(req.body)
        .then((resolve) => {
            if (resolve.data != null) {
                res.status(200).json({ data: { user: true } });
            }
            else {
                res.status(200).json({ data: { user: false } });
            }
        }, (error) => {
            res.status(204).json({ message: "Email not found" });
        })
})




user.get('/userExist', (req, res) => {

    let user = { username: req.query.username };


    findEmailUser(user)
        .then((resolve) => {
            if (resolve.data != null) {
                res.status(200).json({ data: { user: resolve.data } });
            }
            else {
                res.status(200).json({ data: { user: false, message: 'User Not Found!' } });
            }
        }, (error) => {
            res.status(204).json({ message: "User not found" });
        })
})

user.post('/updateProfile', (req, res) => {

    let token = req.get('Authorization');
    req.body.token = token.replace("Bearer", "").replace(/ /g, '');
    updateUserProfile(req.body, req.body.token)
        .then((resolve) => {
            if (resolve.data != null) {
                res.status(200).json({ data: { user: resolve.data } });
            }
            else {
                res.status(200).json({ data: { user: 0, message: 'User Not Found!' } });
            }
        }, (error) => {
            res.status(204).json({ message: "User not found" });
        })
})



user.get('/emailUser', (req, res) => {

    let user = { username: req.query.username };

    findEmailUser(user)
        .then((resolve) => {
            if (resolve.data != null) {
                res.status(200).json({ data: { user: resolve.data } });
            }
            else {
                res.status(200).json({ data: { user: "User not found" } });
            }
        }, (error) => {
            res.status(204).json({ message: "User not found" });
        })
})

user.post('/authenticate', (req, res) => {


    findEmailExist(req.body)
        .then((resolve) => {
            if (resolve.data != null) {

                findAuthentication(req.body)
                    .then((resolve) => {
                        if (resolve.data != null) {
                            res.status(200).json({ user: resolve.data, expire: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) });
                        }

                        else {
                            res.status(200).json({ data: { user: null }, message: "password or email did not match" });
                        }
                    }, (error) => {
                        res.status(204).json({ message: "User not found" });
                    })

            }
            else {
                res.status(200).json({ data: { user: false }, message: "User not found" });
            }
        }, (error) => {
            res.status(204).json({ message: "User not found" });
        })

})



user.get("/secret", passport.authenticate('jwt', { session: false }), function (req, res) {
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


user.get('/F', (req, res) => {


    let token = req.get('Authorization');
    req.query.token = token.replace("Bearer", "").replace(/ /g, '');

    findUser(req.query)
        .then((resolve) => {
            if (resolve.data != null) {
                if (resolve.data.isAdmin) {
                    findAllUsers({})
                        .then((resolve) => {
                            res.status(200).json({ users: resolve });
                        }, (error) => {
                            res.status(200).json({ message: "error" });
                        })
                }
                else {
                    res.status(404).json({ message: "permission denied" });
                }
            }
            else {
                res.status(200).json({ data: { user: null }, message: "password or username did not match" });
            }
        }, (error) => {
            res.status(200).json({ message: "User not found" });
        })
})

user.get('/users', (req, res) => {


    let token = req.get('Authorization');
    req.query.token = token.replace("Bearer", "").replace(/ /g, '');

    findUser(req.query)
        .then((resolve) => {
            res.status(200).json({ users: resolve });
        }, (error) => {
            res.status(200).json({ message: "error" });
        })
})


user.get('/user', (req, res) => {
    ///removing header
    /*   let token = req.get('Authorization');
      req.query.token = token.replace("Bearer", "").replace(/ /g, '');
   */
    findUser({ _id: req.query.userid })
        .then((resolve) => {
            res.status(200).json({ users: resolve });
        }, (error) => {
            res.status(200).json({ message: "error" });
        })
})

user.put('/users', (req, res) => {


    let object = {
        data: req.body
    }

    let token = req.get('Authorization');
    req.query.token = token.replace("Bearer", "").replace(/ /g, '');

    findUser(req.query)
        .then((resolve) => {
            if (resolve.data != null) {
                if (resolve.data.isAdmin) {
                    updateUser(object.data)
                        .then((resolve) => {

                            res.status(200).json({ users: resolve });
                        }, (error) => {
                            res.status(200).json({ message: "error" });
                        })
                }
                else {
                    res.status(404).json({ message: "permission denied" });
                }
            }
            else {

                res.status(200).json({ message: "User Not Found" });
            }
        })
})



user.get('/getActiveStatus', (req, res) => {

    let token = req.get('Authorization');
    req.query.token = token.replace("Bearer", "").replace(/ /g, '');
    userActiveStatus(req.query)
        .then((resolve) => {
            res.status(200).json({ users: resolve });
        }, (error) => {
            console.log(error)
            res.status(200).json({ message: "error" });
        })
})

user.get('/resendEmailToken', (req, res) => {

    let token = req.get('Authorization');
    req.query.token = token.replace("Bearer", "").replace(/ /g, '');
    resendEmailToken(req.query._id, req.query.token)
        .then((resolve) => {
            if (resolve.data) {

                var hash = req.app.locals.webUrl + "/auth/confirm?hash=" + resolve.data.hash + "&id=" + resolve.data._id;

                SendingMail(resolve.data.email,
                    "webconference",
                    "Dear User " +
                    "Thank you for being a part of Mustakbil.com, Pakistan's leading jobs site." +
                    "In order to maintain quality of our services we have adopted various steps to verify contact details of users. Please click the below link to verify your email address." +
                    "<a href=" + hash + ">Verify Email</a>"

                )
                res.status(200).json({ users: resolve });
            }
            else {
                res.status(200).json({ users: null }, { message: 'user not found' });
            }

        }, (error) => {
            console.log(error)
            res.status(200).json({ message: "error" });
        })
})

user.get('/UserProfile', (req, res) => {

    getUserProfile(req.query)
        .then((resolve) => {
            if (resolve.data != null) {
                res.status(200).json({ users: resolve });
            }
            else {
                res.status(200).json({ user: 0, message: "User Not Found" });
            }
        })
})

user.get('/SingleUser', (req, res) => {

    getSingleUser(req.query)
        .then((resolve) => {
            if (resolve.data != null) {
                res.status(200).json({ users: resolve });
            }
            else {
                res.status(200).json({ user: 0, message: "User Not Found" });
            }
        })
})


user.post('/updateOtherInfo', (req, res) => {


    console.log('here is up data', req.query._id, req.body.data)
    updateOtherInfo(req.query._id, req.body.data)
        .then((resolve) => {
            if (resolve.data != null) {
                res.status(200).json({ users: resolve });
            }
            else {
                res.status(200).json({ user: 0, message: "Info Not Save" });
            }
        })
})

user.post('/SavePost', (req, res) => {

    let token = req.get('Authorization');
    req.body.token = token.replace("Bearer", "").replace(/ /g, '');

    req.body.postedBy = req.query._id;

    savepost(req.body)
        .then((resolve) => {
            if (resolve.data != null) {
                res.status(200).json({ data: { user: resolve.data } });
            }
            else {
                res.status(200).json({ data: { user: 0, message: 'Post Not Saved' } });
            }
        }, (error) => {
            res.status(204).json({ message: "Post Not Found" });
        })
})

user.get('/UserPost', (req, res) => {

    let token = req.get('Authorization');
    req.body.token = token.replace("Bearer", "").replace(/ /g, '');

    getUserPost(req.query._id)
        .then((resolve) => {
            if (resolve.data != null) {
                res.status(200).json({ data: { user: resolve.data } });
            }
            else {
                res.status(200).json({ data: { user: 0, message: 'Post Not Saved' } });
            }
        }, (error) => {
            res.status(204).json({ message: "Post Not Found" });
        })
})

user.get('/AllJustPostedJob', (req, res) => {

    let token = req.get('Authorization');
    req.body.token = token.replace("Bearer", "").replace(/ /g, '');

    getJustPostedJob()
        .then((resolve) => {
            if (resolve.data != null) {
                res.status(200).json({ data: { user: resolve.data } });
            }
            else {
                res.status(200).json({ data: { user: 0, message: 'Post Not Found' } });
            }
        }, (error) => {
            res.status(204).json({ message: "Post Not Found" });
        })
})

user.get('/getServiceProvider', (req, res) => {

    let token = req.get('Authorization');
    req.body.token = token.replace("Bearer", "").replace(/ /g, '');

    getServiceProvider()
        .then((resolve) => {
            if (resolve.data != null) {
                res.status(200).json({ data: { user: resolve.data } });
            }
            else {
                res.status(200).json({ data: { user: 0, message: 'Post Not Saved' } });
            }
        }, (error) => {
            res.status(204).json({ message: "Post Not Found" });
        })
})

user.get('/toHire',(req, res) => {

    let token = req.get('Authorization');
    req.body.token = token.replace("Bearer", "").replace(/ /g, '');

    
    getToHire(req.query._id)
        .then((resolve) => {
            if (resolve.data != null) {
                res.status(200).json({ data: { user: resolve.data } });
            }
            else {
                res.status(200).json({ data: { user: 0, message: 'Post Not Saved' } });
            }
        }, (error) => {
            res.status(204).json({ message: "Post Not Found" });
        })
})
