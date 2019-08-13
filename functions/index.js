const functions = require('firebase-functions');
// const { Data } = require('lib/qr-gen');
const QRCode = require('qrcode');



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

exports.qr = functions.https.onRequest((request, response) => {

    QRCode.toCanvas('I am a pony!', function (err, canvas) {
        console.log(''+canvas);
        response.send(canvas);
    })
    
});
