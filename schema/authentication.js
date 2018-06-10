"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var q = require("q");
var Schema = mongoose.Schema;
var Authentication = new mongoose.Schema({
    username: String,
    password: String,
    roll: String,
    email: String,
    isAdmin: Boolean,
    date: { type: Date, "default": Date.now },
    isActivated: { type: Boolean, "default": false },
    hash: String,
    token: String,
    resetPassReq: { type: Boolean, "default": false },
    chash: { type: String, "default": null },
    isLogin: { type: Boolean, "default": false },
    business_name: { type: String },
    business_type: { type: String },
    gender: { type: String },
    category: { type: String },
    Accessories: { type: String },
    town_city: { type: String },
    state: { type: String },
    about: { type: String },
    phoneNumber: { type: String },
    membershipLevel: { type: Number },
    country: { type: String },
    zip: { type: String }
});
var authenticationModel = mongoose.model('authentication', Authentication);
exports.saveAuthentication = function (object) {
    var deffered = q.defer();
    var saveAuthenticationModel = new authenticationModel(object);
    saveAuthenticationModel.save(function (err, success) {
        if (!err) {
            deffered.resolve({ status: true, data: success });
        }
        else {
            deffered.reject({ status: false, data: err });
        }
    });
    return deffered.promise;
};
exports.findAuthentication = function (object) {
    var deffered = q.defer();
    authenticationModel
        .findOne({ email: object.email, password: object.password }, '_id token isAdmin', function (err, success) {
        if (!err) {
            deffered.resolve({ status: true, data: success });
        }
        else {
            deffered.reject({ status: false, data: err });
        }
    });
    return deffered.promise;
};
exports.findEmailExist = function (object) {
    var deffered = q.defer();
    authenticationModel
        .findOne({ email: object.email }, function (err, success) {
        if (!err) {
            console.log(success);
            deffered.resolve({ status: true, data: success });
        }
        else {
            deffered.reject({ status: false, data: err });
        }
    });
    return deffered.promise;
};
exports.findEmailUser = function (object) {
    var deffered = q.defer();
    console.log(object);
    authenticationModel
        .findOne({ username: object.username }, function (err, success) {
        if (!err) {
            console.log(success);
            deffered.resolve({ status: true, data: success });
        }
        else {
            deffered.reject({ status: false, data: err });
        }
    });
    return deffered.promise;
};
exports.ConfirmAuthentication = function (object) {
    var deffered = q.defer();
    authenticationModel
        .findOne({
        hash: object.hash,
        _id: object._id
    }, function (err, success) {
        if (!err) {
            console.log(success);
            deffered.resolve({ status: true, data: success });
        }
        else {
            deffered.reject({ status: false, data: err });
        }
    });
    return deffered.promise;
};
exports.confirmPassword = function (object) {
    var deffered = q.defer();
    authenticationModel
        .findOne({
        chash: object.chash,
        _id: object._id
    }, function (err, success) {
        if (!err) {
            console.log(success);
            deffered.resolve({ status: true, data: success });
        }
        else {
            deffered.reject({ status: false, data: err });
        }
    });
    return deffered.promise;
};
exports.findAllUsers = function (object) {
    var deffered = q.defer();
    authenticationModel
        .find({}, function (err, success) {
        if (!err) {
            deffered.resolve({ status: true, data: success });
        }
        else {
            deffered.reject({ status: false, data: err });
        }
    });
    return deffered.promise;
};
exports.findUser = function (object) {
    var deffered = q.defer();
    authenticationModel
        .findOne(object, function (err, success) {
        if (!err) {
            deffered.resolve({ status: true, data: success });
        }
        else {
            deffered.reject({ status: false, data: err });
        }
    });
    return deffered.promise;
};
exports.updateTokenAuthentication = function (object) {
    var deffered = q.defer();
    authenticationModel.findOneAndUpdate({ '_id': object.data._id }, { $set: { token: object.data.token } }, { "new": true }, function (err, success) {
        if (!err) {
            deffered.resolve({ status: true, data: success });
        }
        else {
            deffered.reject({ status: false, data: err });
        }
    });
    return deffered.promise;
};
exports.updateOtherInfo = function (_id, object) {
    var deffered = q.defer();
    authenticationModel.findOneAndUpdate({ '_id': _id }, { $set: { business_type: object.business_type, state: object.state, zip: object.zip, country: object.country, phoneNumber: object.phoneNumber } }, { "new": true }, function (err, success) {
        if (!err) {
            deffered.resolve({ status: true, data: success });
        }
        else {
            deffered.reject({ status: false, data: err });
        }
    });
    return deffered.promise;
};
exports.updateHashAuthentication = function (object) {
    var deffered = q.defer();
    authenticationModel.findOneAndUpdate({ '_id': object._id }, { $set: { isActivated: true, hash: null } }, { "new": true }, function (err, success) {
        if (!err) {
            deffered.resolve({ status: true, data: success });
        }
        else {
            deffered.reject({ status: false, data: err });
        }
    });
    return deffered.promise;
};
exports.confirmPasswordReq = function (object, chash) {
    var deffered = q.defer();
    console.log(object, chash);
    authenticationModel.findOneAndUpdate({ 'email': object.email }, { $set: { resetPassReq: true, chash: chash } }, { "new": true }, function (err, success) {
        if (!err) {
            console.log(object, success);
            deffered.resolve({ status: true, data: success });
        }
        else {
            deffered.reject({ status: false, data: err });
        }
    });
    return deffered.promise;
};
exports.userActiveStatus = function (object) {
    var deffered = q.defer();
    authenticationModel
        .findOne(object, function (err, success) {
        if (!err) {
            deffered.resolve({ status: true, data: success });
        }
        else {
            deffered.reject({ status: false, data: err });
        }
    });
    return deffered.promise;
};
exports.userDelete = function (object) {
    var deffered = q.defer();
    authenticationModel
        .findByIdAndRemove({ _id: object.id }, function (err, success) {
        if (!err) {
            deffered.resolve({ status: true, data: success });
        }
        else {
            deffered.reject({ status: false, data: err });
        }
    });
    return deffered.promise;
};
exports.updateUser = function (object) {
    var deffered = q.defer();
    authenticationModel.findOneAndUpdate({ '_id': object._id }, { $set: { username: object.username, isAdmin: object.isAdmin, email: object.email } }, { "new": true }, function (err, success) {
        if (!err) {
            deffered.resolve({ status: true, data: success });
        }
        else {
            deffered.reject({ status: false, data: err });
        }
    });
    return deffered.promise;
};
exports.updateUserProfile = function (object, token) {
    var deffered = q.defer();
    authenticationModel.findOneAndUpdate({ 'token': token }, { $set: object }, { "new": true }, function (err, success) {
        if (!err) {
            deffered.resolve({ status: true, data: success });
        }
        else {
            deffered.reject({ status: false, data: err });
        }
    });
    return deffered.promise;
};
exports.updateUserPassword = function (password, chash, _id) {
    var deffered = q.defer();
    authenticationModel.findOneAndUpdate({ 'chash': chash, '_id': _id }, { $set: { password: password } }, { "new": true }, function (err, success) {
        if (!err) {
            deffered.resolve({ status: true, data: success });
        }
        else {
            deffered.reject({ status: false, data: err });
        }
    });
    return deffered.promise;
};
exports.resendEmailToken = function (_id, token) {
    var deffered = q.defer();
    authenticationModel.findOne({ _id: _id, token: token }, function (err, success) {
        if (!err) {
            deffered.resolve({ status: true, data: success });
        }
        else {
            deffered.reject({ status: false, data: err });
        }
    });
    return deffered.promise;
};
exports.getUserProfile = function (object) {
    var deffered = q.defer();
    authenticationModel
        .findOne({ username: object.username }, function (err, success) {
        if (!err) {
            console.log(success);
            deffered.resolve({ status: true, data: success });
        }
        else {
            deffered.reject({ status: false, data: err });
        }
    });
    return deffered.promise;
};
exports.getSingleUser = function (object) {
    var deffered = q.defer();
    authenticationModel
        .findOne({ _id: object._id }, function (err, success) {
        if (!err) {
            console.log(success);
            deffered.resolve({ status: true, data: success });
        }
        else {
            deffered.reject({ status: false, data: err });
        }
    });
    return deffered.promise;
};
