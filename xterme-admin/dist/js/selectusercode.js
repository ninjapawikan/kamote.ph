//add realtime listener
var globaluserid;
firebase.auth().onAuthStateChanged(firebaseUser => {
    //      debugger;
    if (firebaseUser) {

        console.log(firebaseUser);
        // document.getElementById('emailaddress').innerHTML = "" + firebaseUser.email;

        if (firebaseUser.photoURL == null) {
            document.getElementById("userpic").src = '/assets/images/users/1.jpg';
        } else {
            document.getElementById("userpic").src = firebaseUser.photoURL;
            document.getElementById("comname").innerHTML = firebaseUser.displayName;
            document.getElementById("imgname").value = firebaseUser.photoURL;
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
//console.log(useridwebparam);
//end select id parameter in website link


$(document).ready(function () {


    var da = new Date();

    function GetMonthName(monthNumber) {
        var d = new Date();
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        //return months[monthNumber - 1];
        var strDate = months[monthNumber - 1] + " " + d.getDate() + ", " + d.getFullYear();
        return strDate

    }
    var finaldatevalue = GetMonthName((da.getMonth() + 1));
    $('#currentdateval').text(finaldatevalue);

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
                $('#carcolor').text(data.color);
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

    $('#subcomment').click(function (e) {
        e.preventDefault();
        // alert($('textarea#mescomments').val());
        var rating = $('#ratingrate').val();
        var comments = $('textarea#mescomments').val();
        var name = $('#comname').text();
        var propics = $('#imgname').val();
        db.collection('users').doc(useridwebparam).collection('comments').add({
            comments: comments,
            rating: rating,
            commentor: name,
            commentorpic: propics,
            datesent: finaldatevalue,
            userid: useridwebparam
        }).then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
            toastr.success('Comment Is Successfully Sent', 'Success');
            setTimeout(function () {
                location.reload();
            }, 3000);
        })

    });

    db.collection('users').doc(useridwebparam).collection('comments').get().then((querySnapshot) => {
        var total = 0;
        querySnapshot.forEach((doc) => {

            var id = doc.id;
            var data = doc.data();
            total = parseInt(total) + parseInt(data.rating);
            $('#commentsection').prepend(`<div class="row">
                    <div class="col-sm-3">
                        <div class="review-block-img">
                            <img src="${data.commentorpic}" class="img-rounded"
                                alt="">
                        </div>
                        <div class="review-block-name"><a href="#">${data.commentor}</a></div>
                        <div class="review-block-date">${data.datesent}</div>
                    </div>
                    <div class="col-sm-9">
                        <div class="review-block-title">Rating: ${data.rating}</div>
                        <div class="review-block-description">${data.comments}</div>
                    </div>
                </div>
                <hr>`);
        });
        console.log(querySnapshot.size + " " + total);
        var averagerating = parseInt(total / querySnapshot.size);
        if (isNaN(averagerating)) {
            $('#averagerating').text("Average Rating: " + 0);
        } else {
            $('#averagerating').text("Average Rating: " + averagerating);
        }
    });
});