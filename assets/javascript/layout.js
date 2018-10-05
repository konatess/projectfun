//CREATE AND DISTRIBUTE ITEMS

// function to redraw items for each change on screens larger than mobile
function drawWeb() {
    createNodes();  // now create the graphical nodes
    distributeNodesInCircle(); 
    linkNodes();
}

// function to redraw items for each change on mobile size screens
function drawMobile() {
    $('#display').remove();
    console.log('Paper removed');
    var newDisplay = $('<div>');
    newDisplay.attr('id', 'display');
    newDisplay.addClass('col-12 text-center')
    $('.whole-body').append(newDisplay)
    createMobileNodes();
}
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
            }
        });

        items.push(newItem); //hold an array of these new items 
    }
}

function createMobileNodes() {
    items = [];
    console.log('createMobileNodes called')
    for (var i = 0; i < userRuleset.totalNodes(); i++) { //NOTE: we may want a better way to reference the nodes
        var itemName = userRuleset.getName(i);
        if (!itemName) {
            itemName = 'click to add name or image'
        }
        var itemImage = userRuleset.getImage(i);
        var newItem = $('<div>'); // Add new node container
        newItem.addClass('card bg-light mb-1');
        newItem.attr('data-index', i);
        var newBody = $('<div>');
        newBody.text(itemName)
        newBody.addClass('card-body');
        var newImage = $('<img src="' + itemImage + '">');
        newImage.addClass('rounded float-left');
        newBody.prepend(newImage)
        newItem.append(newBody);
        console.log(newItem)

        items.push(newItem); //hold an array of these new items 
        $('#display').append(newItem)
        if (i < (userRuleset.totalNodes() - 1)) {
            $('#display').append('defeats');
        }
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
        var x = Math.round(width / 2 + radius * Math.cos(angle)) + 100;
        var y = Math.round(height / 2 + radius * Math.sin(angle)) - 50;  //note: we are giving a bit of an offset here because we want this to look centered
        currentItem.translate(x, y); //move the existing item to the place we want it to go
        currentItem.addTo(graph); //add it to our graph
        angle += step;
    });
}

function distributeNodesInLine() {
    var stepNumber = (i + 1) * userRuleset.edges[i]; //the edges array holds directionality as 1 (clockwise) and -1 (counterclockwise)
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
    });
}


//linkNodes() 
//this is a function that will link all nodes based on the number of steps currently stored in the ruleset (and the directionality of them)
//it will draw arrows based on the current directions stored in the 'edges' array in the Ruleset object
//note: a collection of 'edges' is being referred to as a 'step' -- ie, how many nodes away we are looking 
//in traditional rock-scissors-paper, each item defeats the item immediately adjacent to it ('one away'). We are calling that "step 1".
function linkNodes() {
    //for as many 'steps' as we have, we are going to link items!
    for (let i = 0; i < userRuleset.totalEdges(); i++) {
        var stepNumber = (i + 1) * userRuleset.edges[i]; //the edges array holds directionality as 1 (clockwise) and -1 (counterclockwise)
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
            // POSSIBLE FUTURE FEATURE
            // puts a label in the middle of each path. 
            // can use this to add custom words
            // however, it only looks good on fewer relationsips
            // and rotating the label to the same angle as the path is more complicated
            // maybe we can try using it only on the single step displays
            // link.appendLabel({
            //     attrs: {
            //         text: {
            //             text: 'defeats'
            //         }
            //     }
            // });
            link.addTo(graph);
        });
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
var screenSmall = window.matchMedia("(max-width: 640px)")

//GRAPH AREA -- this is where we draw our nodes
var userRuleset = new Ruleset();
var graph = new joint.dia.Graph;
var paper = new joint.dia.Paper({
    el: document.getElementById('display'),
    model: graph,
    width: 350,
    height: 600,
    interactive: { elementMove: false, arrowheadMove: false }, //makes the items not draggable, arrows not draggable
    gridSize: 1
});



//VISUALIZATION: ON-CLICK EVENT FOR INDIVIDUAL ITEMS
// WEB VERSION
paper.on('element:pointerclick', function (element) {
    currentItem = element
    currentItemIndex = element.model.attr('dataindex/text'); //To access the current item's INDEX, we have to use the attribute 'dataindex/text'
    console.log("We have clicked the node " + currentItemIndex);
    //Show the modal 
    source = "";
    nodeName = "";
    $("#nodeNameInput").val("");
    $("#nodeNameDisplay").val(userRuleset.getName(currentItemIndex));
    $(".picSelectModal").empty();
    $('#inputModal').modal('show');

});

// MOBILE VERSION
$('.card').on('click', function(element) {

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
            console.log(xhr)
            $(".picSelectModal").html("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
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
    currentItem.model.attr('label/text', nodeName); //and this line changes the display name 
    if (source !== "") {
        userRuleset.setImage(currentItemIndex, source); // Sets image source in Ruleset
        currentItem.model.attr('image/xlinkHref', source);
    }
})

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

//GENERATE NODES BASED ON HOW MANY WE ASKED FOR
//Listener for our item slider
//Each time the item slider changes value, this function will reset the graph & redraw it
//NOTE: Let's think through how we want this to long-term behave when someone sets names/images for items, then reduces the # of items...
//My proposal is that instead of erasing the ruleset (like below), we merely change the cap on its length 
//That will require some tweaks to the graph class / the link nodes function
$('#item-slider').on('input', function () {
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
        if (screenSmall.matches) {
            drawMobile();
        }
        else {
            graph.clear(); //Clear out our existing visualization...
            drawWeb();
        }
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
                if (screenSmall.matches) {
                    drawMobile();
                }
                else {
                    graph.clear(); //Clear out our existing visualization...
                    drawWeb();
                }
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
            if (screenSmall.matches) {
                drawMobile();
            }
            else {
                graph.clear(); //Clear out our existing visualization...
                drawWeb();
            }
            
        }
    }   
});

//WHEN THE PAGE LOADS, SHOW A DEFAULT EXAMPLE RULESET 
//Note: eventually this will only show if you are not logged in / do not have a saved game
    userRuleset.addNode("Click me to get started!");
    userRuleset.addNode("");
    userRuleset.addNode("");
    if (screenSmall.matches) {
        drawMobile();
    }
    else {
        drawWeb();
    }
}

// myFunction(screenSmall) // Call listener function at run time
// screenSmall.addListener(myFunction) // Attach listener function on state changes
