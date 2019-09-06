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
                console.log(data.name);
                $('#name').text(data.name);
                $("#profpic").attr("src",data.profile_pic);
                $('#carname').text(data.car);
                $('#carcolor').text(data.color)

            });
        }).catch(err => {
            console.log('Error getting document', err);
          });
});