$(".login").on("click", function(){
    //first, determine if we are trying to sign in or up...
    //SIGN IN
    //if we have both a sign in and sign up email, we try to do that first

    //first, validate that the inputs follow our parsley rules...
    var validatedSignInEmail = $("#signInEmail").parsley();
    var validatedSignInPassword = $("#signInPassword").parsley();
    //if so, grab the actual inputs
    if(validatedSignInEmail.isValid() && validatedSignInPassword.isValid()) {
        console.log("Attempting to sign in...");
        var signInEmail = $("#signInEmail").val().trim(); //TO-DO: consider that this is still not the most secure process!  a malicious person might find a way around parsley
        var signInPassword = $("#signInPassword").val().trim();    
        firebase.auth().signInWithEmailAndPassword(signInEmail, signInPassword).catch(function(error) {
            console.log(error.code);
             console.log(error.message);
        });
        return; //and exit the login function, because it worked
    }

    //SIGN UP
    //otherwise, we're gonna try to sign up for a new account!    
    var validatedSignUpEmail = $("#signUpEmail").parsley();
    var validatedSignUpPassword = $("#signUpPassword").parsley();
    //TO-DO: VALIDATE
    if(validatedSignUpEmail.isValid() && validatedSignUpPassword.isValid()) { 
        var signUpEmail = $("#signUpEmail").val().trim();
        var signUpPassword = $("#signUpPassword").val().trim();
        console.log(signUpEmail + " " + signUpPassword);
        console.log("Attempting to sign up...");
        firebase.auth().createUserWithEmailAndPassword(signUpEmail, signUpPassword).catch(function(error) {
            console.log(error.code);
            console.log(error.message);
        });
    }
    //OTHERWISE, IF NEITHER OPERATION SUCCEEDED:
    //(TO DO) show the user an error
    console.log("You failed");
});

function signOut() {
    //if a user is currently logged in, we log them out!
    firebase.auth().signOut().then(function() {
        console.log("Logged out!")
     }, function(error) {
        console.log(error.code);
        console.log(error.message);
     });
}

//detects changes to the authentication state
firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
        //if someone has logged in, let's hide the things they don't need to access
        console.log("Someone is logged in!");
        //remove the 'sign in/up' button...
        $(".signin-menu").empty();
        //..and replace with a sign out
        var signOutLnk = $("<a>");
        signOutLnk.attr("href", "#"); //link goes nowhere
        signOutLnk.addClass("signout nav-link"); //add the proper classes
        signOutLnk.on("click", signOut); //add an onclick event for it to call the 'signOut' function when clicked..
        signOutLnk.text("Sign Out");
        var signOutLI = $("<li>"); //now make a nav-item li to store our link
        signOutLI.addClass("nav-item");
        signOutLI.append(signOutLnk); //attach the nav link to the li...
        $(".signin-menu").append(signOutLI) //and the li to the menu
        //finally, close the signin modal
        $("#signInUpModal .close").click() 
    }
    else {
        //if someone has logged OUT, we need to show them the option to sign in again
        console.log("Nobody is logged in");
        //remove the 'sign in/up' button...
        $(".signin-menu").empty();
        //..and replace with a sign out
        var signInLnk = $("<a>");
        signInLnk.attr("href", "#"); //link goes nowhere
        signInLnk.addClass("signin nav-link"); //add the proper classes
        signInLnk.attr("data-toggle", "modal");
        signInLnk.attr("data-target", "#signInUpModal");
        signInLnk.text("Sign In");
        var signInLI = $("<li>"); //now make a nav-item li to store our link
        signInLI.addClass("nav-item");
        signInLI.append(signInLnk); //attach the nav link to the li...
        $(".signin-menu").append(signInLI) //and the li to the menu
        //finally, close the signin modal
        $("#signInUpModal .close").click() 
    }
});