import mongoose = require('mongoose');
import q = require('q');
import { Stream } from 'stream';

let Schema = mongoose.Schema;

var Post = new mongoose.Schema({

    business_type: { type: String },
    state: { type: String },
    country: { type: String },
    zip: { type: String },
    budget: { type: String },
    phoneNumber: { type: String },
    duration: { type: String },
    jobDescription: { type: String },
    josStatus: { default: 'just_posted', type: String },
    hireBy: { type: Schema.Types.ObjectId, ref: 'authentication' },
    postedBy: { type: Schema.Types.ObjectId, ref: 'authentication' },
    userHired: { type: Schema.Types.ObjectId, ref: 'authentication' },
    noOfStars: { default: '0', type: String },
    comments: { type: String }

})

let postModel = mongoose.model('post', Post);

export let savepost = function (object) {
    let deffered = q.defer();
    let savepostModel = new postModel(object);
    savepostModel.save((err, success) => {
        if (!err) {
            deffered.resolve({ status: true, data: success });
        }
        else {
            deffered.reject({ status: false, data: err })
        }

    })
    return deffered.promise;
}


export let getUserPost = function (_id) {

    let deffered = q.defer();

    postModel
        .find({ postedBy: _id }, {}, (err, success) => {

            if (!err) {
                deffered.resolve({ status: true, data: success });
            }
            else {
                deffered.reject({ status: false, data: err })
            }

        });
    return deffered.promise;
}




export let getJustPostedJob = function () {

    let deffered = q.defer();

    postModel
        .find({ josStatus: 'just_posted' }, {})
        .populate('postedBy')
        .exec((err, success) => {

            if (!err) {
                deffered.resolve({ status: true, data: success });
            }
            else {
                deffered.reject({ status: false, data: err })
            }
        })

    return deffered.promise;
}

export let getToHire = function (_id, b) {
    let deffered = q.defer();
    postModel
        .find({ postedBy: _id, business_type: b })
        .exec((err, success) => {

            if (!err) {
                deffered.resolve({ status: true, data: success });
            }
            else {
                deffered.reject({ status: false, data: err })
            }
        })
    return deffered.promise;
}

export let ConfirmHire = function (_id, object) {
    let deffered = q.defer();
    postModel.findOneAndUpdate(
        { '_id': object._id },
        {
            $set: {
                hireBy: _id,
                josStatus: object.josStatus,
                userHired : object.userHired
            }
        },
        { new: true },
        (err, success) => {
            if (!err) {
                deffered.resolve({ status: true, data: success });
            }
            else {
                deffered.reject({ status: false, data: err })
            }

        });
    return deffered.promise;
}


export let CompleteJob = function (object) {
    let deffered = q.defer();

    console.log(object.userHired, object.userStatus)
    postModel.findOneAndUpdate(
        { '_id': object.postid },
        { $set: { noOfStars: object.noOfStars, comments: object.comments, josStatus: object.josStatus } },
        { new: true },
        (err, success) => {
            if (!err) {
                deffered.resolve({ status: true, data: success });
            }
            else {
                deffered.reject({ status: false, data: err })
            }

        });
    return deffered.promise;
}


export let WorkerProfile = function (object) {
    let deffered = q.defer();

    postModel.find(
        { 'userHired': object.id }
        , {},
        (err, success) => {
            if (!err) {
                deffered.resolve({ status: true, data: success });
            }
            else {
                deffered.reject({ status: false, data: err })
            }

        });
    return deffered.promise;
}


