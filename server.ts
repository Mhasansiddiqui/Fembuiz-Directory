import express = require('express');

import bodyParser = require('body-parser')

import { connectionToDb } from './database/connection';
connectionToDb();


import { user } from './route/user/userRoute'
import { auth } from './route/auth/auth'


import request = require('request');

var path = require('path');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': true}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
// app.use(methodOverride());
// app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});




app.use(express.static(__dirname + '/public'));

app.use('/api', user);
app.use('/auth', auth);

app.post('/signup' , (req: express.Request, res: express.Response) => {
    console.log('received',req.body)
      res.send('ok')
})



app.listen(process.env.PORT || 3000, () => {
    console.log('server start');
})

process.on('uncaughtException', function (ex) {
    console.log('error', ex)
});