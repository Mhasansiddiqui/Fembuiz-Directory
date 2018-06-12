"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var q = require("q");
var Schema = mongoose.Schema;
var Post = new mongoose.Schema({
    business_type: { type: String },
    state: { type: String },
    country: { type: String },
    zip: { type: String },
    budget: { type: String },
    phoneNumber: { type: String },
    duration: { type: String },
    jobDescription: { type: String },
    josStatus: { "default": 'just_posted', type: String },
    postedBy: { type: Schema.Types.ObjectId, ref: 'authentication' }
});
var postModel = mongoose.model('post', Post);
exports.savepost = function (object) {
    var deffered = q.defer();
    var savepostModel = new postModel(object);
    savepostModel.save(function (err, success) {
        if (!err) {
            deffered.resolve({ status: true, data: success });
        }
        else {
            deffered.reject({ status: false, data: err });
        }
    });
    return deffered.promise;
};
exports.getUserPost = function (_id) {
    var deffered = q.defer();
    postModel
        .find({ postedBy: _id }, {}, function (err, success) {
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
exports.getJustPostedJob = function () {
    var deffered = q.defer();
    postModel
        .find({ josStatus: 'just_posted' }, {})
        .populate('postedBy')
        .exec(function (err, success) {
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
exports.getToHire = function (_id, b) {
    var deffered = q.defer();
    postModel
        .find({ postedBy: _id, business_type: b })
        .exec(function (err, success) {
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
