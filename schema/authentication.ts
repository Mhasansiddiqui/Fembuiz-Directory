import mongoose = require('mongoose');
import q = require('q');
import { Stream } from 'stream';

let Schema = mongoose.Schema;

var Authentication = new mongoose.Schema({

    username: String,
    password: String,
    roll: String,
    email: String,
    isAdmin: Boolean,
    date: { type: Date, default: Date.now },
    isActivated: { type: Boolean, default: false },
    hash: String,
    token: String,
    resetPassReq: { type: Boolean, default: false },
    chash: { type: String, default: null },
    isLogin: { type: Boolean, default: false },
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
    zip: { type: String },
    userStatus: { default: 'not_hired', type: String },


})



let authenticationModel = mongoose.model('authentication', Authentication);

export let saveAuthentication = function (object) {
    let deffered = q.defer();
    let saveAuthenticationModel = new authenticationModel(object);
    saveAuthenticationModel.save((err, success) => {
        if (!err) {
            deffered.resolve({ status: true, data: success });
        }
        else {
            deffered.reject({ status: false, data: err })
        }

    })
    return deffered.promise;
}



export let findAuthentication = function (object) {

    let deffered = q.defer();

    authenticationModel
        .findOne({ email: object.email, password: object.password }, '_id token isAdmin', (err, success) => {

            if (!err) {

                deffered.resolve({ status: true, data: success });
            }
            else {
                deffered.reject({ status: false, data: err })
            }

        })
    return deffered.promise;
}

export let findEmailExist = function (object) {

    let deffered = q.defer();

    authenticationModel
        .findOne({ email: object.email }, (err, success) => {

            if (!err) {
                deffered.resolve({ status: true, data: success });
            }
            else {
                deffered.reject({ status: false, data: err })
            }

        });
    return deffered.promise;
}


export let findEmailUser = function (object) {

    let deffered = q.defer();


    authenticationModel
        .findOne({ username: object.username }, (err, success) => {

            if (!err) {
                deffered.resolve({ status: true, data: success });
            }
            else {
                deffered.reject({ status: false, data: err })
            }

        });
    return deffered.promise;
}

export let ConfirmAuthentication = function (object) {

    let deffered = q.defer();

    authenticationModel
        .findOne({
            hash: object.hash,
            _id: object._id
        }, (err, success) => {

            if (!err) {
                deffered.resolve({ status: true, data: success });
            }
            else {
                deffered.reject({ status: false, data: err })
            }

        });
    return deffered.promise;
}

export let confirmPassword = function (object) {

    let deffered = q.defer();

    authenticationModel
        .findOne({
            chash: object.chash,
            _id: object._id
        }, (err, success) => {

            if (!err) {
                deffered.resolve({ status: true, data: success });
            }
            else {
                deffered.reject({ status: false, data: err })
            }

        });
    return deffered.promise;
}

export let findAllUsers = function (object) {

    let deffered = q.defer();

    authenticationModel
        .find({}, (err, success) => {
            if (!err) {
                deffered.resolve({ status: true, data: success });
            }
            else {
                deffered.reject({ status: false, data: err })
            }

        });
    return deffered.promise;

}

export let findUser = function (object) {

    let deffered = q.defer();



    authenticationModel
        .findOne(object, (err, success) => {
            if (!err) {
                deffered.resolve({ status: true, data: success });
            }
            else {
                deffered.reject({ status: false, data: err })
            }

        });
    return deffered.promise;

}

export let updateTokenAuthentication = function (object) {
    let deffered = q.defer();
    authenticationModel.findOneAndUpdate(
        { '_id': object.data._id },
        { $set: { token: object.data.token } },
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

export let updateOtherInfo = function (_id, object) {
    let deffered = q.defer();
    authenticationModel.findOneAndUpdate(
        { '_id': _id },
        { $set: { business_type: object.business_type, state: object.state, zip: object.zip, country: object.country, phoneNumber: object.phoneNumber } },
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

export let updateHashAuthentication = function (object) {

    let deffered = q.defer();


    authenticationModel.findOneAndUpdate(
        { '_id': object._id },
        { $set: { isActivated: true, hash: null } },
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



export let confirmPasswordReq = function (object, chash) {

    let deffered = q.defer();


    authenticationModel.findOneAndUpdate(
        { 'email': object.email },
        { $set: { resetPassReq: true, chash: chash } },
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


export let userActiveStatus = function (object) {

    let deffered = q.defer();
    authenticationModel

        .findOne(object, (err, success) => {

            if (!err) {
                deffered.resolve({ status: true, data: success });
            }
            else {
                deffered.reject({ status: false, data: err })
            }

        });
    return deffered.promise;
}


export let userDelete = function (object) {

    let deffered = q.defer();
    authenticationModel

        .findByIdAndRemove({ _id: object.id }, (err, success) => {

            if (!err) {
                deffered.resolve({ status: true, data: success });
            }
            else {
                deffered.reject({ status: false, data: err })
            }

        });
    return deffered.promise;
}

export let updateUser = function (object) {
    let deffered = q.defer();
    authenticationModel.findOneAndUpdate(
        { '_id': object._id },
        { $set: { username: object.username, isAdmin: object.isAdmin, email: object.email } },
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


export let updateUserProfile = function (object, token) {
    let deffered = q.defer();
    authenticationModel.findOneAndUpdate(
        { 'token': token },
        { $set: object },
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



export let updateUserPassword = function (password, chash, _id) {
    let deffered = q.defer();
    authenticationModel.findOneAndUpdate(
        { 'chash': chash, '_id': _id },
        { $set: { password: password } },
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




export let resendEmailToken = function (_id, token) {
    let deffered = q.defer();
    authenticationModel.findOne({ _id: _id, token: token },
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


export let getUserProfile = function (object) {

    let deffered = q.defer();

    authenticationModel
        .findOne({ username: object.username }, (err, success) => {

            if (!err) {
                deffered.resolve({ status: true, data: success });
            }
            else {
                deffered.reject({ status: false, data: err })
            }

        });
    return deffered.promise;
}



export let getSingleUser = function (object) {

    let deffered = q.defer();

    authenticationModel
        .findOne({ _id: object._id }, (err, success) => {

            if (!err) {
                deffered.resolve({ status: true, data: success });
            }
            else {
                deffered.reject({ status: false, data: err })
            }

        });
    return deffered.promise;
}

export let getServiceProvider = function () {

    let deffered = q.defer();

    authenticationModel
        .find({ roll: 'service_provider' }, {})
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

export let updateUserStatus = function (object) {
    let deffered = q.defer();

    console.log(object.userHired ,object.userStatus  )
    authenticationModel.findOneAndUpdate(
        { '_id': object.userHired },
        { $set: { userStatus: object.userStatus } },
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

export let getHiringUser = function (userid ) {

    let deffered = q.defer();

    authenticationModel
        .findOne({_id : userid }, (err, success) => {

            if (!err) {
                deffered.resolve({ status: true, data: success });
            }
            else {
                deffered.reject({ status: false, data: err })
            }

        });
    return deffered.promise;
}
