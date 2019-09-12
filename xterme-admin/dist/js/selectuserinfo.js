$(document).ready(function () {
    //realtime select in firestore everytime there's new data
    var db = firebase.firestore(); // database
    var storage = firebase.storage(); //firebase storage
    var qrcode = new QRCode(document.getElementById('qrcodeResult'), {
        width: 200,
        height: 200
    });
    
    db.collection("users").onSnapshot(snapshot => {
        snapshot.docChanges().forEach((changed) => {

            // console.log(changed);

            if (changed.type == 'added') {
                var id = changed.doc.id;
                var data = changed.doc.data();
                $('#userlist').prepend(`<tr>
                <th scope="row"><img src="${data.profile_pic}" width="100px" height="100px"> </th>
                <td>${data.name}</td>
                <td>${data.car}</td>
                <td>${data.color}</td>
                <td>${data.overall_rating}</td>
                <td><button data-toggle="modal" data-target="#updateinfo" class="btn btn-info" id="updateinfodata">Update Info</button> | <button data-toggle="modal" data-target="#deleteinfo" class="btn btn-danger" id="deleteinfodata">Delete Info</button> | <button data-toggle="modal" class="btn btn-warning" id="genqr" data-target="#qrcodemodal"><i class="m-r-10 mdi mdi-qrcode-scan"></i> QR Code</button></td>
            </tr>`);

                // update modal set value
                $('#updateinfodata').click(function () {
                    $('input#updatename').val(data.name);
                    $('input#updatecar').val(data.car);
                    $('input#updatecolor').val(data.color);
                    $('input#updateoverallrating').val(data.overall_rating);
                    $('input#docid').val(id);
                });
                //end update

                // qrcode modal set value
                $('#genqr').click(function () {
                    //$('input#qrcodeid').val(id);
                    qrcode.makeCode('http://kamote.ph.linkmalloc.com/usercode.html?id=' + id);
                });
                //end qrcode

                //delete
                $('#deleteinfodata').click(function () {
                    $('#deldocid').val(id);
                });
                //end delete
            }
            // else if( changed.type == 'removed' ){
            //     var idToDelete = changed.doc.id;
            //     $('#calendar').fullCalendar('removeEvents', idToDelete);
            // }

        });
    });

    $('#updateuser').click(function (e) {

        var name = $('input#updatename').val();
        var car = $('input#updatecar').val();
        var color = $('input#updatecolor').val();
        var rating = $('input#updateoverallrating').val();
        var docid = $('input#docid').val();


        var profilepic = $('#updateprofilepic')[0].files[0]; // get the file name
        if (profilepic == undefined) {
            db.collection('users').doc(docid).update({
                    color: color,
                    name: name,
                    car: car,
                    overall_rating: rating
                })
                .then(function (docRef) {
                    // console.log("Document written with ID: ", docRef);
                    location.reload();
                })
        } else {
            var storageRef = storage.ref(profilepic.name);
            var task = storageRef.put(profilepic);
            task.on('state_changed',
                function progress(snapshot) {
                    var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(percentage + '% uploading..');
                },
                function error(err) {
                    console.log('error uploading image, try again');
                    console.log(err);
                },
                function complete() { // if image complete uploading, this will return the download url and sent it into the database
                    task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                        console.log('File available at', downloadURL);

                        db.collection('users').doc(docid).update({
                                color: color,
                                name: name,
                                car: car,
                                overall_rating: rating,
                                profile_pic: downloadURL
                            })
                            .then(function (docRef) {
                                // console.log("Document written with ID: ", docRef);
                                location.reload();
                            })

                    });


                }
            );
        }

    });


    $('#deleteuser').click(function () {
        var docid = $('input#deldocid').val();

        db.collection('users').doc(docid).delete()
            .then(function (docRef) {
                // console.log("Document written with ID: ", docRef);
                location.reload();
            })
    });


});