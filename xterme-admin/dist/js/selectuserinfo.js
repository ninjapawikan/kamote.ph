$(document).ready(function () {
    //realtime select in firestore everytime there's new data
    var db = firebase.firestore(); // database
    db.collection("users").onSnapshot(snapshot => {
        snapshot.docChanges().forEach((changed) => {
            if (changed.type == 'added') {
               
                var data = changed.doc.data();
                $('#userlist').prepend(`<tr>
                <th scope="row">${data.name}</th>
                <td>${data.car}</td>
                <td>${data.color}</td>
                <td>${data.overall_rating}</td>
            </tr>`);
            }
            // else if( changed.type == 'removed' ){
            //     var idToDelete = changed.doc.id;
            //     $('#calendar').fullCalendar('removeEvents', idToDelete);
            // }

        });
    });
});