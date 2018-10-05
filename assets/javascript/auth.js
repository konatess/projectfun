//GLOBAL VARIABLES
var userID = ""; //our userID is null until someone logs in
var currentGameID = ""; //similarly, our game ID is null until someone logs in
var database = firebase.database();

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
        //store their user id in our global variable...
        userID = user.uid;
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
        //add a publish button (for signed in users only)
        var publishBtn = $('<button class="my-3 btn btn-secondary publish-btn">');
        publishBtn.text("Publish My Game");
        publishBtn.on("click", function(){
            console.log("Attempting to publish...");
            //first, validate that the game we've created has all the necessary items
             if(!userRuleset.isValid()) {
                console.log("Error - not a valid ruleset!");
                return;
            } 
            //if it's a valid ruleset, assemble what we need and push it to the cloud
            console.log("Valid game!  We can publish");
            //now, check if we have a game ID already..if not, let's create a new item!
            if(!currentGameID) {
                console.log(userID);
                var keyRef = database.ref("/publicgames/"+userID).push({
                    creator: userID
                }); 
                currentGameID=keyRef.key; //we now have a reference to our current game!!
            }
            //now we update all the game info
            database.ref("/publicgames/"+userID+"/"+currentGameID).update({title: userRuleset.title});
            
            //now we update the node info under /nodes...
            for(let x=0; x<userRuleset.totalNodes(); x++) {
                database.ref("/publicgames/"+userID+"/"+currentGameID+"/nodes/"+x).update({
                    image: userRuleset.getImage(x),
                    name: userRuleset.getName(x)
                });            
            }

            //and the edge info under /edges...
            for(let y=0; y<userRuleset.totalEdges(); y++) {
                database.ref("/publicgames/"+userID+"/"+currentGameID+"/edges/"+y).set(userRuleset.edges[y]);
            }
        });
        $(".game-controls").append(publishBtn);
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
        //remove the publish button (if we have one)
        $('.publish-btn').remove();
        //finally, close the signin modal
        $("#signInUpModal .close").click() 
    }
});

