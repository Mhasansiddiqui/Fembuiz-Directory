"use strict";
exports.__esModule = true;
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
exports.SendingMail = function (senderemail, descriptionTitle, description) {
    var SCOPES = [
        'https://mail.google.com/',
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/gmail.compose',
        'https://www.googleapis.com/auth/gmail.send'
    ];
    // var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    //   process.env.USERPROFILE) + '/.credentials/';
    var TOKEN_DIR = './email-setup/';
    var TOKEN_PATH = TOKEN_DIR + 'gmail-nodejs-quickstart.json';
    var name = makeBody(senderemail, '', descriptionTitle, description);
    function authorize(credentials, callback) {
        var clientSecret = credentials.installed.client_secret;
        var clientId = credentials.installed.client_id;
        var redirectUrl = credentials.installed.redirect_uris[0];
        var auth = new googleAuth();
        var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, function (err, token) {
            if (err) {
                getNewToken(oauth2Client, callback);
            }
            else {
                oauth2Client.credentials = JSON.parse(token);
                callback(oauth2Client, name);
            }
        });
    }
    var readFileAndSendEmail = function () {
        var name = "hasan siddiqui";
        fs.readFile('./email-setup/client_secret.json', function processClientSecrets(err, content) {
            if (err) {
                console.log('Error loading client secret file: ' + err);
                return;
            }
            authorize(JSON.parse(content), sendMessage);
        });
    };
    readFileAndSendEmail();
    function getNewToken(oauth2Client, callback) {
        var authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES
        });
        console.log('Authorize this app by visiting this url: ', authUrl);
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('Enter the code from that page here: ', function (code) {
            rl.close();
            oauth2Client.getToken(code, function (err, token) {
                if (err) {
                    console.log('Error while trying to retrieve access token', err);
                    return;
                }
                oauth2Client.credentials = token;
                storeToken(token);
                callback(oauth2Client);
            });
        });
    }
    function storeToken(token) {
        try {
            fs.mkdirSync(TOKEN_DIR);
        }
        catch (err) {
            if (err.code != 'EEXIST') {
                throw err;
            }
        }
        fs.writeFile(TOKEN_PATH, JSON.stringify(token));
        console.log('Token stored to ' + TOKEN_PATH);
    }
    function makeBody(to, from, subject, message) {
        var str = ["Content-Type: text/html; charset=\"UTF-8\"\n",
            "MIME-Version: 1.0\n",
            "Content-Transfer-Encoding: 7bit\n",
            "to: ", to, "\n",
            "from: ", from, "\n",
            "subject: ", subject, "\n\n",
            message
        ].join('');
        var encodedMail = new Buffer(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
        return encodedMail;
    }
    function sendMessage(auth, a) {
        var raw = a;
        var gmail = google.gmail('v1');
        gmail.users.messages.send({
            auth: auth,
            userId: 'me',
            resource: {
                raw: raw
            }
        }, function (err, response) {
            console.log(response);
        });
    }
};
/*---------- sending mail end-----------*/
