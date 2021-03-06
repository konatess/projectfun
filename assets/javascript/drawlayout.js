//CREATE AND DISTRIBUTE ITEMS
function drawTabs() {
    //(TO-DO): make the tabs themselves dynamic
    var tabCount = userRuleset.totalEdges();
    console.log(tabCount)

    for (var i = 1; i < 8; i++) {
        // add the tabs back in
        $('#step-' + i + '-tab').show();
        $('#step-' + i).show();
        $('#step-' + i + '-tab').removeClass('active'); //clear out the 'active' from all tabs
        $('#step-' + i).removeClass('show active'); 

        // remove tabs higher than the total edges of this ruleset
        if (i > tabCount) {
            $('#step-' + i + '-tab').hide();
            $('#step-' + i).hide();
        }
    }
    // additionally, remove the All tab if we're on mobile, and highlight the current active tab
    if (screenSmall){
            $('.all-steps-tab').hide();
            if(currentTab===0) { //if the screen is small and we're on the 'all' tab -- we are hiding the 'all' tab, so make the '1' tab actually show as active
                $("#step-1-tab").addClass("active");
            }
            else {
                $("#step-"+currentTab+"-tab").addClass("active");
            }
    }
    else {
        $('.all-steps-tab').show();
        $("#step-"+currentTab+"-tab").addClass("active");
    }
}

// function to redraw items for each change on screens larger than mobile
function drawWeb() {
    // first, clear out any graph that may already exist
    graph.clear();
    //figure out the current size we should set the paper (and make it that size)
    paper.setDimensions($(".game-container").width(), 600);
    createNodes();  // now create the graphical nodes
    distributeNodesInCircle(); //distribute them in a circular pattern
    //and draw the nodes!
    if(currentTab===0) {
        linkAllNodes();  //note: the 0 tab = the 'all' tab, so we'd link all the nodes
    }
    else {
        drawStepWeb(currentTab); //otherwise, we simply draw links for the step we are on
    }
    drawTabs();
    //lastly, hide any mobile display
    $('#mobileDisplay').hide();
    $("#display").show();
}

// function to redraw items for each change on mobile size screens
function drawMobile() {
    //first, hide any unnecessary tabs
    drawTabs();
    console.log("Drawing mobile at " + currentTab);
    if(currentTab===0) {
        drawStepMobile(1);
    }
    else {
        drawStepMobile(currentTab);
    }
    //hide the web display...
    $('#display').hide();
    //and show the mobile one
    $("#mobileDisplay").show();

}

//MOBILE DISPLAY FUNCTIONS
//display mobile divs in a vertical line, one 'step' at a time
function drawStepMobile(stepNumber) {
    console.log("Distributing in line");
    //Empty the appropriate tab...
    $('#mobileDisplay').show();
    $('#mobileDisplay').empty();
    console.log(stepNumber);
   // var stepNumber = (i + 1) * userRuleset.edges[i]; //the edges array holds directionality as 1 (clockwise) and -1 (counterclockwise)
    const totalNodes = userRuleset.totalNodes(); //total number of items we have -- aka the total # of items we have
    var iterations = 0;
    var index = 0;
    //we will hop around WHILE we are not out of things
    while(iterations<totalNodes) {
        //figure out where our target is 
        var targetIndex = index + stepNumber;
        //make sure that target index doesn't exceed the bounds of our array!
        if (targetIndex < 0) {  //if we have gone below the START of the array, adjust our goals
            targetIndex = totalNodes + targetIndex;
        }
        else if (targetIndex >= totalNodes) { //OR if we have gone past the END of the array
            //figure out how much we overshot by:
            targetIndex = targetIndex - totalNodes;
        }
 
         //Now we actually add the thing on :)
         var itemName = userRuleset.getName(index);
         if (!itemName) {
             itemName = 'click to add name or image'
         }
         var itemImage = userRuleset.getImage(index);
         var newItem = $('<div class="card bg-mobileNodes my-1">'); // Add new node container
         newItem.attr('id', 'item-' + index)
         newItem.attr('data-index', index);
         var newItemContent = $('<div class="d-flex flex-row align-items-center"><img src="' + itemImage + '" class="img-thumbnail m-1 width-override">' + '<p class="card-text text-left flex-fill p-2">' + itemName + '</p></div>')
         newItem.append(newItemContent);
         $('#mobileDisplay').append(newItem);
         if (iterations < (userRuleset.totalNodes() - 1)) {
             $('#mobileDisplay').append('defeats');
         }
        //now our current thing will be the next place we leap from!
        index = targetIndex;
        iterations++;
    }
    
}

//WEB VIEW FUNCTIONS
function createNodes() {
    items = [];
    //NOTE: when we generate these guys, we need to give them an onclick so they will open an editing modal 
    //and the user can then put in the name and pick an image
    for (var i = 0; i < userRuleset.totalNodes(); i++) { //NOTE: we may want a better way to reference the nodes
        var newItem = new joint.shapes.standard.BorderedImage();
        newItem.position(5, 10);
        newItem.resize(75, 75);

        newItem.attr({
            body: {
                fill: 'green',
                rx: '50%'
            },
            label: {
                text: userRuleset.getName(i),
                fill: 'red'
            },
            dataindex: {  //NOTE: this 'dataindex' attribute will store the index of the related node in our userRuleset object :)
                text: i
            },
            image: {
                xlinkHref: userRuleset.getImage(i)
            }
        });

        items.push(newItem); //hold an array of these new items 
    }
}

//distributeNodesInCircle()
//function distributes all existing items into a circle pattern
//NOTE: this function is intended for all desktop screens; for mobile we'll need to have a different distribution pattern
function distributeNodesInCircle() {
    var radius = 250;
    width = paper.options.width; //width and height are the size of the canvas
    height = paper.options.height;
    // for reasons I have yet to understand, angle 4.72 puts the first item closest to the top
    angle = 4.72, step = (2 * Math.PI) / userRuleset.totalNodes();

    items.forEach(function (currentItem, index) {
        var x = Math.round(width / 2 + radius * Math.cos(angle)) - 50;
        var y = Math.round(height / 2 + radius * Math.sin(angle)) - 50;  //note: we are giving a bit of an offset here because we want this to look centered
        currentItem.translate(x, y); //move the existing item to the place we want it to go
        currentItem.addTo(graph); //add it to our graph
        angle += step;
    });
}

//linkAllNodes() 
//this is a function that will link all nodes based on the number of steps currently stored in the ruleset (and the directionality of them)
//it will draw arrows based on the current directions stored in the 'edges' array in the Ruleset object
//note: a collection of 'edges' is being referred to as a 'step' -- ie, how many nodes away we are looking 
//in traditional rock-scissors-paper, each item defeats the item immediately adjacent to it ('one away'). We are calling that "step 1".
function linkAllNodes() {
    //for as many 'steps' as we have, we are going to link items!
    for (let i = 0; i < userRuleset.totalEdges(); i++) {
        var stepNumber = (i + 1) * userRuleset.edges[i]; //the edges array holds directionality as 1 (clockwise) and -1 (counterclockwise)
        drawStepWeb(stepNumber);
    }
}

//drawLink
function drawStepWeb(stepNumber) {
    const totalNodes = userRuleset.totalNodes(); //total number of items we have -- aka the total # of items we have
    items.forEach(function (currentItem, index) {
        //figure out where our target is 
        var targetIndex = index + stepNumber;
        //make sure that target index doesn't exceed the bounds of our array!
        if (targetIndex < 0) {  //if we have gone below the START of the array, adjust our goals
            targetIndex = totalNodes + targetIndex;
        }
        else if (targetIndex >= totalNodes) { //OR if we have gone past the END of the array
            //figure out how much we overshot by:
            targetIndex = targetIndex - totalNodes;
        }
        //now that we have this set, draw the correct arrow!
        var link = new joint.shapes.standard.Link();
        link.source(currentItem);
        link.target(items[targetIndex]);
        // adjust width of arrow stems can change color with line/stroke, color
        link.attr('line/strokeWidth', 2);
        // adjust size of arrow heads, can also add fill: color
        link.attr('line/targetMarker', {'d': 'M 20 -6 0 0 20 6 Z'})
        link.addTo(graph);
    });
}

//MOBILE RESPONSIVENESS
//Dynamically determine which display to render -- small screen version or web version
function drawDisplay() {
    var theWindowSize = $(this).width();
    if(theWindowSize < 833)
    { //if the window size is less than 833px, we should render a more straightforward view 
        screenSmall = true;
        drawMobile();
    }
    else { //otherwise, the display is large enough to support the full graphical view!
        screenSmall = false;
        drawWeb();
    }
}

//WAIT UNTIL THE DOCUMENT IS READY TO DO THE FOLLOWING:
$.ready() 
{
//GLOBAL VARIABLES: 
var items = []; //array that stores the graph elements to display on our paper
var currentItemIndex;
var currentItem;
var source; 
var nodeName;
var screenSmall; //boolean that determines if we're rendering the mobile or web version
var currentTab=0; //integer of the current tab we have selected

//GRAPH AREA -- this is where we draw our nodes
var userRuleset = new Ruleset();
var graph = new joint.dia.Graph;
var paper = new joint.dia.Paper({
    el: document.getElementById('display'),
    model: graph,
    width: $(".game-container").width(),
    height: 600,
    interactive: { elementMove: false, arrowheadMove: false }, //makes the items not draggable, arrows not draggable
    gridSize: 1
});
;

//VISUALIZATION: ON-CLICK EVENT FOR INDIVIDUAL ITEMS
// WEB VERSION
paper.on('element:pointerclick', function (element) {
    currentItem = element
    currentItemIndex = element.model.attr('dataindex/text'); //To access the current item's INDEX, we have to use the attribute 'dataindex/text'
    //Show the modal 
    source = "";
    nodeName = "";
    $("#nodeNameInput").val("");
    $("#nodeNameDisplay").val(userRuleset.getName(currentItemIndex));
    $(".picSelectModal").empty();
    $('#inputModal').modal('show');

});

// MOBILE VERSION
$(document).on('click', '.card', function() {
    currentItemIndex = $(this).attr('data-index'); //To access the current item's INDEX, we have to use the attribute 'dataindex/text'
    //Show the modal 
    source = "";
    nodeName = "";
    $("#nodeNameInput").val("");
    $("#nodeNameDisplay").val(userRuleset.getName(currentItemIndex));
    $(".picSelectModal").empty();
    $('#inputModal').modal('show');
});

$(".resetModalButton").click(function (e) {
    $("#nodeNameInput").val("");
    $("#nodeNameDisplay").val("");
    $(".picSelectModal").empty();
});

// modal - submit button for the text bar
$(".submit").click(function (e) {
    $(".picSelectModal").html("");

    var apiKey = "4cac8681185d926a8cc5a7f2671b3eb5"
    var flickerAPI = "https://api.flickr.com/services/feeds/photos_public.gne?format=json&tags=" + $("#nodeNameInput").val();

    $.ajax({
        url: flickerAPI,
        dataType: "jsonp", // jsonp
        jsonpCallback: 'jsonFlickrFeed', // add this property
        success: function (result, status, xhr) {
            $.each(result.items, function (i, item) {
                $("<img>").attr("src", item.media.m).addClass("img img-thumbnail modalPic").appendTo(".picSelectModal");
                if (i === 5) {
                    return false;
                }
            });
        },
        error: function (xhr, status, error) {
            console.log(xhr + " " + status + " " + error + " " + xhr.status + " " + xhr.statusText);
            //if an error occurs, give the user a human-readable error message!
            $(".picSelectModal").html("Oh no, something went wrong!  Please try your search again.");
        }
    });
});

$(document).on('click', '.modalPic', function() {
    $('.modalPic').removeClass('selected-image');
    $(this).addClass('selected-image');
    source = $(this).attr('src')
    console.log('Picture source: ' + source)
})

$(document).on('click', '.saveModalButton', function() {
    nodeName = $('#nodeNameDisplay').val().trim();
    userRuleset.setName(currentItemIndex, nodeName); //this line would set the name in the internal datamodel...
    if (screenSmall) {
        if (source !== "") {
            userRuleset.setImage(currentItemIndex, source); // Sets image source in Ruleset
        }
        $('#item-' + currentItemIndex).html('<div class="d-flex flex-row align-items-center"><img src="' + userRuleset.getImage(currentItemIndex) + '" class="img-thumbnail m-1 width-override">' + '<p class="card-text text-left flex-fill p-2">' + nodeName + '</p></div>');
    }
    else {
        currentItem.model.attr('label/text', nodeName); //and this line changes the display name 
        if (source !== "") {
            userRuleset.setImage(currentItemIndex, source); // Sets image source in Ruleset
            currentItem.model.attr('image/xlinkHref', source);
        }
    }
})



//LISTENER FOR STEP TABS
$(".all-steps-tab").on("click", function(){
    currentTab = 0;
    drawDisplay(); //display everything if we were on the 'all' tab
});

$(".step-tab").on("click", function(){
    const selectedStep = parseInt($(this).attr("data-index")); //grab which step we're looking at
    //remove the 'active' from the previous tab...
    $("#step-" + currentTab + "-tab").removeClass("active");
    currentTab = selectedStep;
    $(this).addClass("active"); //add it to the current tab...
    //and update which tab has it
    //NOTE: there is probably a better way to do this!
    if(screenSmall) {
        //do this when on mobile...
        //NOTE: for small screens, '1' is actually the all-nodes option!
        if(selectedStep===1) {
            currentTab = 0;
        }
        drawStepMobile(selectedStep);
    }
    else {
       //otherwise, draw the graph correctly for web!
       //NOTE: need to find a more elegant way to do this -should be able to just delete the links 
       graph.clear();
       paper.setDimensions($(".game-container").width(), 600);
       createNodes();  // now create the graphical nodes
       distributeNodesInCircle(); //distribute them in a circular pattern
       drawStepWeb(selectedStep); //but ONLY draw the links for this one step!
    }
});

//LISTENER FOR ALL-STEPS TAB (WEB ONLY)
$(".all-steps-tab").on("click", function(){
    drawDisplay();
});

//PARSLEY VALIDATOR FOR ODD NUMBERS
//Allows us to ensure that the user is not passing an even # 
window.Parsley
  .addValidator('isNotDivisibleBy', {
    requirementType: 'integer',
    validateNumber: function(value, requirement) {
      return 0 !== value % requirement;
    },
    messages: {
      en: 'This value must be an odd number',
    }
  });


//LISTENER: Window resize
//When resizing the window, redraw the display so that we get the correct one
$(window).resize(function()
{   
    drawDisplay();
});


//GENERATE NODES BASED ON HOW MANY WE ASKED FOR
//Listener for our item slider
//Each time the item slider changes value, this function will reset the graph & redraw it
//NOTE: Let's think through how we want this to long-term behave when someone sets names/images for items, then reduces the # of items...
//My proposal is that instead of erasing the ruleset (like below), we merely change the cap on its length 
//That will require some tweaks to the graph class / the link nodes function
$('#item-slider').on('input', function () {
    //reset our current tab to 'all' so that we see the right level
    currentTab = 0;

    //first, grab the current value of the slider 
    const newNumberOfNodes = parseInt($(this).val()); 

    //Check if we are INCREASING or DECREASING the current # of nodes
    const originalNumberOfNodes = userRuleset.totalNodes();
    const netChange = newNumberOfNodes - originalNumberOfNodes;
    //Easy case is increasing - simply add more blank nodes!
    if(netChange>0) {
        console.log("Adding nodes!");   
        for (let i = 0; i < netChange; i++) {
            userRuleset.addNode();
        } 
        //We should then immediately update what the user sees!
        $("#number-of-items").text(newNumberOfNodes); //change the number on the slider label
        //NOTE: We should do something different if it's on mobile vs web!
        drawDisplay();
    }
    //otherwise, if we are DELETING nodes...we need to pause for the user to tell us 'yes' or 'no' ;)
    else if(netChange<0) { 
        //first, check if we will delete any of the user's custom work!
        //it's okay if we are deleting blank nodes...but if they've set a name or image for anything, give a warning.
        var userWillLoseProgress = false;  //start by assuming we have not lost progress...
        for(let j=originalNumberOfNodes-1; j>=newNumberOfNodes; j--) {  //then quickly walk backwards through the number of nodes 
            if(userRuleset.getName(j)!=="" || userRuleset.getImage(j)!=="") { //if the user has set a name or image for an item, we have to warn them!
                userWillLoseProgress = true; 
                break; //we only need to search until we find at least one thing that will be deleted
            }
        }

        if(userWillLoseProgress) {
        //if they will lose progress, we will then pop up a warning message in our generic modal!
            $("#genericModalLabel").text("Confirm Deletion");
            $("#genericModalBody").html("<p>Reducing the size of your game now will delete the last " + Math.abs(netChange) + " items you've created! Are you sure you want to proceed?</p>");
            //create a cancel button
            var cancelBtn = $("<button>");
            cancelBtn.text("Cancel");
            cancelBtn.addClass("btn btn-secondary");
            //...and add a function that just closes the dialog box when cancelled
            cancelBtn.on("click", function(){
                //change the slider position back to where it original was...
                const originalSliderPosition = Math.abs(netChange) + newNumberOfNodes;
                $("#item-slider").val(originalSliderPosition);
                //and hide the modal
                $("#genericModal").modal("hide");
                
            });
            //create a confirm button
            var confirmBtn = $("<button>");
            confirmBtn.text("Yes, delete my work");
            confirmBtn.addClass("btn btn-warning");
            //...and add a function that WILL delete items and update the display when clicked!
            confirmBtn.on("click", function(){
                for(let k=originalNumberOfNodes-1; k>=newNumberOfNodes; k--) { //walk backwards through the userRuleset deleting nodes
                    userRuleset.deleteNode(k);
                }
                $("#number-of-items").text(newNumberOfNodes); //change the number on the slider label
                drawDisplay();
                //and hide the modal
                $("#genericModal").modal("hide");
            });
            //empty the current generic modal footer buttons and append our custom ones
            $("#genericModalFooter").empty();
            $("#genericModalFooter").append(cancelBtn);
            $("#genericModalFooter").append(confirmBtn);
            //and show the modal!
            $("#genericModal").modal("show");
        }
        //otherwise, if the user will NOT lose progress...just delete the nodes immediately!
        else {
            for(let m=originalNumberOfNodes-1; m>=newNumberOfNodes; m--) { //walk backwards through the userRuleset deleting nodes
                userRuleset.deleteNode(m);
            }
            $("#number-of-items").text(newNumberOfNodes); //change the number on the slider label
            drawDisplay();
        }
    }   
});

//WHEN THE PAGE LOADS, SHOW A DEFAULT EXAMPLE RULESET 
//Note: eventually this will only show if you are not logged in / do not have a saved game
    userRuleset.addNode("Click me to get started!");
    userRuleset.addNode("");
    userRuleset.addNode(""); 
    drawDisplay();
}


