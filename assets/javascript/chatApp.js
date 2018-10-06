// Initialize Firebase
var config = {
    apiKey: "AIzaSyCRt9aGUzCARZ6dW_Cv9RcCEsK7RZ-w6P4",
    authDomain: "rp-player.firebaseapp.com",
    databaseURL: "https://rp-player.firebaseio.com",
    projectId: "rp-player",
    storageBucket: "rp-player.appspot.com",
    messagingSenderId: "686973992127"
  };
  firebase.initializeApp(config);


// VARIABLES
  var database = firebase.database();
  var username;
  var mostRecentUser;
  var roomnumber = 0;
  var opponent = null;
  var opponentChoice = "";
  var roomType;
  


// FUNCTIONS



// determine room number, search existing for empty first
var findRoom = function() {
    // get snapshot of current rooms
    var roomSnap = database.ref('rooms').orderByKey();
    roomSnap.once("value")
    .then(function(snapshot) {
        // get number of children
        var childCount = snapshot.numChildren();
        console.log('There are ' +childCount+ ' rooms total')
        if (childCount === 0) {
            roomnumber = 1;
            roomType = 'make';
            return
        }
        // tracker of first available room if all are full
        var i = 1;
        // for each room, check if full
        snapshot.forEach(function(childSnapshot) {
            // key should equal room number
            var key = childSnapshot.key;
            console.log('Room number ' +key+ ' exists.');
            // 'full' will return a Boolean
            var a = childSnapshot.child('full').val();
            var b = childSnapshot.child('players').numChildren();
            if (b === 0) {
                database.ref('rooms/' + key).remove();
            }
            console.log('full for ' +key+ ' is ' +a)
            // if a not-full room is found, join the room
            if ((!a) && (b > 0)) {
                roomnumber = key;
                console.log('Key = ' +key+ ', Roomnumber = ' +roomnumber);
                roomType = 'join'
                console.log('i is ' +i+ ' and room type is ' +roomType);
                opponent = childSnapshot.child('joined').val();
                console.log('Opponent is ' +opponent)
                return
            }
            else if (roomnumber === 0 && i < key) {
                roomnumber = i;
                roomType = 'make';
                console.log('i is ' +i+ ' and room type is ' +roomType);
            }
            else if (roomnumber === 0 && i === childCount) {
                roomnumber = i + 1;
                roomType = 'make';
                console.log('i is ' +i+ ' and room type is ' +roomType);
            }
            i++
        })
    })
};

var resetGame = function(outcome) {
    $('.btn-pusher').removeAttr('checked');
    $('.play-btn').removeClass('active');
    choice = "";
    database.ref('users/' + username).update({fChoice: ""})
    database.ref('users/' + opponent).update({fChoice: ""})
}

var chatListen = function() {
    // listener for database change in chat
    database.ref('rooms/' + roomnumber).on('value', function(data) {
        if (roomnumber !== 0) {
            // save chat message
            chatMessage = data.child('message').val();
            console.log('Chat message: ' + chatMessage)
            if (chatMessage !== (undefined||null)) {
            var newUser = data.child('chatPrev').val();
            console.log('New user: ' + newUser)
            // append most recent input chat box
                // if input is from same user as previous message: 
                if (newUser === ("" || null) || mostRecentUser === newUser){
                    // remove time stamp
                    $(".time-stamp").remove();
                    // append <p> with new message
                    var newMessage = $("<p>").text(chatMessage);
                    newMessage.addClass("text-left");
                    // create new time stamp and append
                    var time = $("<p>").text(moment().format('hh:mm')); 
                    time.addClass("text-right time-stamp");
                    $(".chat-log").append(newMessage, time);
                }
                // else 
                else {
                    // remove timestamp class to keep all previous time stamps
                    $("p").removeClass("time-stamp");
                    var newUserName = $("<span>").text(newUser);
                    // get player's own username to show up in different color
                    if (newUser === username) {
                        newUserName.addClass("float-left text-info");
                    }
                    else {
                        newUserName.addClass("float-left text-secondary");
                    }
                    // append <p> with new message
                    var newMessage = $("<p>").append(newUserName);
                    newMessage.append(": " + chatMessage);
                    newMessage.addClass("text-left");
                    // create new time stamp and append
                    var time = $("<p>").text(moment().format('hh:mm')); 
                    time.addClass("text-right time-stamp");
                    $(".chat-log").append(newMessage, time);
                }
            }
            mostRecentUser = newUser
        }
    });
};

var leaveListen = function() {
    var disconnectRef = database.ref('rooms/' + roomnumber).onDisconnect();
    disconnectRef.update({
        full: false,
        joined: opponent,
        message: username + ' has left.'
    })
    var playerRef = database.ref('rooms/' + roomnumber + '/players/' + username).onDisconnect();
    playerRef.remove();
};
  
// check username against list in database
   // modal to get username
    $(window).on('load', function(){
        // can we wrap this in an 'if' to check local storage for a username?
        $('#usernameModal').modal('show');
    });
    // save username to local var and to database
    var inputs = $("form#myForm input, form#myForm textarea");

    var validateInputs = function validateInputs(inputs) {
      var validForm = true;
      inputs.each(function(index) {
        var input = $(this);
        if (!input.val() || (input.type === "radio" && !input.is(':checked'))) {
          $("#subnewtide").attr("disabled", "disabled");
          validForm = false;
        }
      });
      return validForm;
    }
    
    
    // inputs.change(function() {
    //   if (validateInputs(inputs)) {
    //     $("#subnewtide").removeAttr("disabled");
    //   }
    // });

var proceed =false;

//////////////////////////
    $(document).on("click", ".username-btn", function() {
        username = $("#username").val().trim();
        var fNameRef = database.ref('users/' + username);
        fNameRef.transaction(function(currentData) {
            if (currentData === null) {
                return {
                    fChoice: ""
                };
            } else {
                console.log('User already exists.');
                $('#usernameModalTitle').text('That name is already in use.')
                proceed = false;
                alert('Invalid entry!!!');
                return; // Abort the transaction.
            }
            }, function(error, committed) {
            if (error) {
                console.log('Transaction failed abnormally!', error);
            } else if (!committed) {
                console.log('We aborted the transaction (because ' +username+ ' already exists).');
            } else {
                console.log('User ' +username+ ' added!');
                // check and create roomnumber
                findRoom();
                database.ref('users/' + username).onDisconnect().remove();
                $('#usernameModal').modal('hide');
            } 
        });
    });
  
    $('#usernameModal').on("hidden.bs.modal", function () {
        if (roomType === 'join') {
            // if partly empty room found, join room
            function updateRoom() {
                database.ref('rooms/' + roomnumber + '/players').update({
                    [username]: username
                })
                database.ref('rooms/' + roomnumber).update({
                    full: true,  
                    chatPrev: null, 
                    message: username + ' has joined.',
                    joined: username
                })
                .then(function() {
                    chatListen();
                    leaveListen();
                });
            }
            updateRoom();
        }
        else if (roomType === 'make') {
            // if no joinable room is found, make a new one
            function makeRoom() {
                database.ref('rooms/' + roomnumber).update({
                    players: {[username]: username}, 
                    full: false, 
                    chatPrev: null, 
                    message: username + ' has joined.',
                    joined: username
                })
                .then(function() {
                chatListen();
                leaveListen();
            });
            }
            makeRoom();
            updateOpponent();
        }
        else {
            console.log('Room error.')
        }
    }); 

    function updateOpponent() {
        database.ref('rooms/' + roomnumber + '/joined').on('value', function(joinedData) {
            // make sure opponent is saved locally
            var newJoined = joinedData.val();
            console.log('New player to be opponent is ' + newJoined)
            if (newJoined !== username) {
                opponent = newJoined
                console.log('Opponent is ' + opponent)
            }
        })
    }
  
// to play game
    // get user's clicked play button 
    $(document).on("click", ".play-btn", function() {
        console.log($(this).attr("data-value"))
        choice = $(this).attr("data-value");
        console.log('Chose ' + choice)
        // save choice to database
        database.ref('users/' + username).update({fChoice: choice})
        console.log('Database should be updated.')
    });
      
    // save opponent's Choice
    database.ref('users').on('value', function(data) {
        if (roomnumber !== 0 && opponent !== "") {
            opponentChoice = data.child(opponent + '/fChoice').val();
            console.log('Opponent chose ' + opponentChoice)
            var outcome = "";
            // compare to see who won
            // if tied
            if (choice !== "" && opponentChoice !== "") {
                if (choice === opponentChoice) {
                    // tie game
                    outcome = "tied";
                    resetGame(outcome);
                }
                // if not tied
                else {
                    for (i = 0; i < allPlayObj.length; i++) {
                        if (allPlayObj[i]['name'] === choice) {
                            if (allPlayObj[i]['defeats'].includes(opponentChoice)) {
                                outcome = "won";
                                wins++
                                resetGame(outcome);
                            }
                            else {
                                outcome = "lost";
                                losses++
                                resetGame(outcome);
                            }
                        }
                    }
                }
                
            }
        }
    });
  
  
  
  // Chat functionality
      // listen for local input and update database
      $(document).on("click", "#chat-button", function() {
        event.preventDefault();
        var chatMessage = $("#chat-input").val().trim();
        $("#chat-input").val('');
        if (chatMessage === "") {
            return
        }
        else {
            database.ref('rooms/' + roomnumber).update({
                message: chatMessage, 
                chatPrev: username
              });
        }
    });




// save username: username under users,
// then save users/username: "" in room, "" will become user's game choice
// save a value for the most recently joined user, and use that to update opponent of first player
  