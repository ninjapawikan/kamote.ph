//add realtime listener
var globaluserid;
firebase.auth().onAuthStateChanged(firebaseUser => {
    //      debugger;
    //console.log(firebaseUser);

    //console.log(globaluserid);


    if (firebaseUser) {

        console.log(firebaseUser);
       // document.getElementById('emailaddress').innerHTML = "" + firebaseUser.email;
        
        if(firebaseUser.photoURL == null){
            document.getElementById("userpic").src= '/assets/images/users/1.jpg';
        }else{
            document.getElementById("userpic").src= firebaseUser.photoURL;
        }

    } else {
        //   debugger;
        console.log('not logged in');
        if (window.location.href.indexOf('login') < 0) { // page is not in login page
            window.location = "/login/";
        }
    }
});    
    
    //select id parameter in website link
    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    var useridwebparam = getUrlParameter('id');
    console.log(useridwebparam);
    //end select id parameter in website link


    $(document).ready(function () {
        //realtime select in firestore everytime there's new data
        var db = firebase.firestore(); // database
        // select data from firebase
        db.collection("users").where(firebase.firestore.FieldPath.documentId(), '==', useridwebparam)
            .get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    //   console.log(${doc.id});
                    var data = doc.data();
                 //   console.log(data.name);
                    $('#name').text(data.name);
                    $("#profpic").attr("src", data.profile_pic);
                    $('#carname').text(data.car);
                    $('#carcolor').text(data.color)

                });
            }).catch(err => {
                console.log('Error getting document', err);
            });


    // Initialize EMOTION RATING!
        var emotionsArray = ['angry', 'disappointed', 'meh', 'happy', 'inlove'];
        // or a single one

        $("#myrating").emotionsRating({
            emotionSize: 20,
            emotions: emotionsArray,
            color: '#FF0066', //the color must be expressed with a css code
            onUpdate: function (value) {
                // alert(value);
                $('#ratingrate').val(value);
            } //set value changed event handler
        });
    //end initialize

        $('#subcomment').click(function(e){
            e.preventDefault();
           // alert($('textarea#mescomments').val());
           var rating = $('#ratingrate').val();
            var comments = $('textarea#mescomments').val();
            db.collection('users').doc(useridwebparam).collection('comments').add({
                comments: comments,
                rating: rating,
                userid: useridwebparam
              }).then(function (docRef) {
                 console.log("Document written with ID: ", docRef.id);
             
            })
            
        });
    });