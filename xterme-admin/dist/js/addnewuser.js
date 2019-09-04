$(document).ready(function () {

    var db = firebase.firestore();
    var storage = firebase.storage();
    $('#addnewuser').click(function (e) {
        e.preventDefault();

        var name = $('#name').val();
        var color = $('#color').val();
        var rating = $('#overallrating').val();
        var car = $('#car').val();

        var profilepic = $('#profilepic')[0].files[0]; // get the file name
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
                    db.collection("users").add({
                        color:color,
                        name:name,
                        car:car,
                        overall_rating:rating,
                        profile_pic:downloadURL
                    })
                    .then(function (docRef) {
                        console.log("Document written with ID: ", docRef.id);
                       
                    })
                    .catch(function (error) {
                        console.error("Error adding document: ", error);
                    });
                });


            }
        );


    });
});