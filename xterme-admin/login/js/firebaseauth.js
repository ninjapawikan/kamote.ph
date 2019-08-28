
  //add realtime listener
  var globaluserid;
  firebase.auth().onAuthStateChanged(firebaseUser => {
      debugger;
      //console.log(firebaseUser);

    //console.log(globaluserid);


      if (firebaseUser) {
        if (window.location.href.indexOf('product-list') > 0) {
            globaluserid = firebaseUser.uid;
            selectProduct();
          }   
          if (window.location.href.indexOf('add-product') > 0) {
            document.getElementById('user_id').value = firebaseUser.uid;
          }

        if(firebaseUser.displayName == null){

            if (window.location.href.indexOf('user-profile') < 0) {
                window.location = "/seller/user-profile/";
            }
            //window.location = "/seller/user-profile/";
        }else{
            
            if ((window.location.href.indexOf('login') > 0 || window.location.href.indexOf('signup') > 0)) {
            window.location = "/seller/product-list/";
                }
                //console.log(firebaseUser.email); // email
                //console.log(firebaseUser.photoURL); // photourl

                //   toastr.success('Successfully Login', 'Success');
                //setTimeout(function(){ location.reload(); }, 2000);
        }
                
        document.getElementById('userEmailAdd').innerHTML = "" + firebaseUser.displayName;

        if (document.getElementById('userEmailAdd') != null) {
        document.getElementById('myaccount').style = "display : none";
        document.getElementById('myinfos').style = "display : true";             
    }

      } else {
          debugger;
          console.log('not logged in');
          //   toastr.error('Incorrect username or password', 'Incorrect Info');
          //setTimeout(function(){ location.reload(); }, 3000);
          if (window.location.href.indexOf('product-list') > 0 ||
              window.location.href.indexOf('product-details') > 0) { // page is not in login page
              window.location = "/seller/login/";
          }
          document.body.style = "display:''";

      }
  });
  
$(document).ready(function () {

    // login
    $('#loginUser').click(function (e) {
        e.preventDefault();
        const email = $('#inputEmail').val();
        const password = $('#inputPassword').val();
        const auth = firebase.auth();
        const promise = auth.signInWithEmailAndPassword(email, password);
        promise.catch(e => toastr.error(e.message, 'Error'));

        //window.location = "/seller/product-list/index.html";

    });

    $('#signUpUser').click(function (e) {
        e.preventDefault();
        const email = $('#signEmail').val();
        const password = $('#signPassword').val();
        const conpassword = $('#signConPassword').val();

        if (password == conpassword) {
            const auth = firebase.auth();
            const promise = auth.createUserWithEmailAndPassword(email, password);
            promise.catch(e => toastr.error(e.message, 'Error'));
            //window.location = "/seller/login/";
        } else {
            toastr.error('Password Is Not Match', 'Error');
        }

        //window.location.href = "/admin/fleet/";
    });


    //logout
    $('#userLogout').click(function () {
        //for logout 
        firebase.auth().signOut();
        window.location.href = "/seller/login/";

    });

    $('#userprobtn').click(function (e) {
      e.preventDefault();

      var user = firebase.auth().currentUser;
      var displayName = $('#displayName').val();
      var phone = $('#phone').val();

      user.updateProfile({
      displayName: displayName,
      phoneNumber: phone
      }).then(function() {
          window.location = "/seller/product-list/";
          //console.log('success');
      }).catch(function(error) {
          console.log(error.message);
      });

  });





});