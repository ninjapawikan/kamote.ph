//add realtime listener
var globaluserid;
firebase.auth().onAuthStateChanged(firebaseUser => {
    //      debugger;
    //console.log(firebaseUser);

    //console.log(globaluserid);


    if (firebaseUser) {

        console.log(firebaseUser);
        if ((window.location.href.indexOf('login') > 0 || window.location.href.indexOf('signup') > 0)) {
            window.location = "/users.html";
        }

        document.getElementById('emailaddress').innerHTML = "" + firebaseUser.email;

    } else {
        //   debugger;
        console.log('not logged in');
        if (window.location.href.indexOf('login') < 0) { // page is not in login page
            window.location = "/login/";
        }
    }
});
$(document).ready(function () {

    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('#loginbtn').on('click', function (e) {
        e.preventDefault();
        var check = true;

        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                showValidate(input[i]);
                check = false;
            }
        }
        // return check;
        // alert(check);

        if (check == true) {
            const email = $('#inputEmail').val();
            const password = $('#inputPassword').val();
            const auth = firebase.auth();
            const promise = auth.signInWithEmailAndPassword(email, password);
            //  console.log(promise.catch(e => e.message));
            promise.catch(e => toastr.error(e.message, 'Error'));
        }

    });

    $('#signupbtn').on('click', function (e) {
        e.preventDefault();
        var check = true;

        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                showValidate(input[i]);
                check = false;
            }
        }
        // return check;
        // alert(check);

        if (check == true) {
            const signemail = $('#signEmail').val();
            const signpassword = $('#signPassword').val();
            const signconpassword = $('#signConPassword').val();

            if (signpassword == signconpassword) {
                const auth = firebase.auth();
                const promise = auth.createUserWithEmailAndPassword(signemail, signpassword);
                promise.catch(e => toastr.error(e.message, 'Error'));
                //window.location = "/seller/login/";
            } else {
                toastr.error('Password Is Not Match', 'Error');
            }

        }

    });


    //logout
    $('#userLogout').click(function () {
        firebase.auth().signOut();
        window.location.href = "/login/";
    });

    $('.validate-form .input100').each(function () {
        $(this).focus(function () {
            hideValidate(this);
        });
    });

    function validate(input) {
        if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        } else {
            if ($(input).val().trim() == '') {
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }


});