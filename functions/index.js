const functions = require('firebase-functions');
// const { Data } = require('lib/qr-gen');
const QRCode = require('qrcode');
const fs = require('fs');



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    console.log('request: '+request);
    console.log('request Params'+request.params);
    console.log('request Params ID'+request.params.id);
    console.log('request Body'+request.body.id);
    response.send("Hello from Firebase!");
});

// exports.qr = functions.https.onRequest((request, response) => {
//     console.log(request.body);
//     const res = await qrcode.toDataURL('http://localhost:4000/rate/userId='+request.body.userId);
          
//     fs.writeFileSync('./qr.html', `<img src="${res}">`);
//     console.log('Wrote to ./qr.html');
    
// });

exports.qrGen = functions.firestore.document('/users/{userId}')
                .onCreate((snapshot,context)=>{
                    let data = snapshot.data();
                    console.log(data);
                    console.log('snapshot.id - id:'+snapshot.id);
                    console.log('userId:'+userId);
                    const res = qrcode.toDataURL('http://localhost:4000/rate/userId='+snapshot.id)
                                .then((data)=>{
                                    console.log(data);           
                                    fs.writeFileSync('/usercode.html', `<img src="${data}">`);
                                    console.log('Wrote to ./qr.html');
                                });

                });