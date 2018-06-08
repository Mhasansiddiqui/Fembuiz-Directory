"use strict";
exports.__esModule = true;


var express = require('express');


var app = express();

app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 3000, function () {
    console.log('server start');
});
process.on('uncaughtException', function (ex) {
    console.log('error', ex);
});
