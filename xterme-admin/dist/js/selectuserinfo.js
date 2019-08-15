$(document).ready(function () {
    //realtime select in firestore everytime there's new data
    var db = firebase.firestore(); // database
    db.collection("users").onSnapshot(snapshot => {
        snapshot.docChanges().forEach((changed) => {

            console.log(changed);

            if (changed.type == 'added') {
               var id = changed.doc.id;
                var data = changed.doc.data();
                $('#userlist').prepend(`<tr>
                <th scope="row">${data.name}</th>
                <td>${data.car}</td>
                <td>${data.color}</td>
                <td>${data.overall_rating}</td>
                <td><button data-toggle="modal" data-target="#updateinfo" class="btn btn-info" id="updateinfodata">Update Info</button> | <button data-toggle="modal" data-target="#deleteinfo" class="btn btn-danger" id="deleteinfodata">Delete Info</button></td>
            </tr>`);

           // update modal set value
            $('#updateinfodata').click(function() {
                $('input#updatename').val(data.name);
                $('input#updatecar').val(data.car);
                $('input#updatecolor').val(data.color);
                $('input#updateoverallrating').val(data.overall_rating); 
                $('input#docid').val(id); 
              });
              //end update
            }
            // else if( changed.type == 'removed' ){
            //     var idToDelete = changed.doc.id;
            //     $('#calendar').fullCalendar('removeEvents', idToDelete);
            // }

        });
    });

    $('#updateuser').click(function(){

        var name = $('input#updatename').val();
        var car = $('input#updatecar').val();
        var color = $('input#updatecolor').val();
        var rating = $('input#updateoverallrating').val(); 
        var docid = $('input#docid').val(); 

        db.collection('users').doc(docid).update({
            color:color,
            name:name,
            car:car,
            overall_rating:rating
        })    
        .then(function (docRef) {
           // console.log("Document written with ID: ", docRef);
            location.reload();   
        })
    });
    

});