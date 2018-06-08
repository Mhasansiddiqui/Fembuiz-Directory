import mongoose = require("mongoose"); 
//--- Database Connection Start --- //
export function connectionToDb() {

    let connection = 'mongodb://hasan:hasan@ds019076.mlab.com:19076/newdb';
    //let connection = 'localhost:27017/admin';

    mongoose.connect(connection);
    mongoose.connection.on('connected', () => {
        console.log('connected to mongoose');
    })
    /* mongoose.connection.on('disconnected', () => {
         console.log('disconnected to mongoose');
     })
 
     mongoose.connection.on('error', (err) => {
         console.log('error in connection' + err);
     })
         mongoose.connection.close(()=>{
         console.log('connection closing');
     })
        process.on('SIGINT', function() {
                mongoose.connection.close(function () {
                console.log('Mongoose disconnected through app termination');
                process.exit(0);
            });
        });*/
}
 // ---- Database connection ended -----//