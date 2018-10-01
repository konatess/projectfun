
//GLOBAL VARIABLES: 
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
var items = []; //array that stores the graph elements to display on our paper

//(FOR TESTING PURPOSES: we are going to create blank nodes for userRuleset here)
var numberOfNodes = 15; //NOTE: we should get this from the user

for (let i = 0; i < numberOfNodes; i++) {
    userRuleset.addNode();
}

function createNodes() {
    //to-do: clear out any old items
    items = [];
    //NOTE: when we generate these guys, we need to give them an onclick so they will open an editing modal 
    //and the user can then put in the name and pick an image
    for (var i = 0; i < userRuleset.totalNodes(); i++) { //NOTE: we may want a better way to reference the nodes
        var newItem = new joint.shapes.standard.Circle();
        newItem.position(5, 10);
        newItem.resize(75, 75);
        // newItem.attr({
        //     type: "button",
        //     class: "btn btn-primary",
        //     dataToggle: "modal",
        //     dataTarget: ".bd-example-modal-lg",
        // });
        newItem.attr({
            body: {
                fill: 'green'
            },
            label: {
                text: userRuleset.getName(i),
                fill: 'white'
            }
        });

        items.push(newItem); //hold an array of these new items 
    }
}

// this should be the line that calls the modal, but it does not.  There appears to be some drag and drop arrows that appear on hover over the nodes.  it breaks the graph being drawn.  I wonder if there is conflict with the other on.click event handler for dragging the nodes?  Or , I am just wrong.
$('.inputModal').modal("click", items);

//distributeNodesInCircle()
//function distributes all existing items into a circle pattern
function distributeNodesInCircle() {
    var radius = 250;
    console.log(paper.options.width);
    width = paper.options.width; //width and height are the size of the canvas
    height = paper.options.height;
    // for reasons I have yet to understand, angle 4.72 puts the first item closest to the top
    angle = 4.72, step = (2 * Math.PI) / userRuleset.totalNodes();
    console.log("Width: " + width, "Height: " + height)
    items.forEach(function (currentItem, index) {
        var x = Math.round(width / 2 + radius * Math.cos(angle)) + 100;
        var y = Math.round(height / 2 + radius * Math.sin(angle)) - 50;  //note: we are giving a bit of an offset here because we want this to look centered
        /* if(window.console) {
            console.log(index, x, y);
        } */
        currentItem.translate(x, y); //move the item to the place we want it to go
        currentItem.addTo(graph); //add it to our drawing paper
        angle += step;
    });
}


//linkNodes() 
//this is a function that will link all nodes based on the number of steps currently stored in the ruleset (and the directionality of them)
function linkNodes() {
    //draw arrows based on the current directions in the ruleset

    //for as many steps as we have, we are going to link items!
    for (let i = 0; i < userRuleset.edges.length; i++) {
        var numSteps = (i + 1) * userRuleset.edges[i];
        const totalNodes = userRuleset.totalNodes(); //total number of items we have -- aka the total # of items we have
        items.forEach(function (currentItem, index) {
            //figure out where our target is 
            var targetIndex = index + numSteps;
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
            link.attr('line/strokeWidth', 5);
            link.addTo(graph);
        });
    }
}

//CODE TO CALL ONCE THE USER HAS INPUT THEIR DESIRED # OF ITEMS:
createNodes();  // create the nodes
distributeNodesInCircle(); //(TO-DO): pick which function we use to distribute nodes based on size of the display - mobile or web
linkNodes();

//  
// MODAL STUFF HERE
// 

$(document).ready(function () {
    $(".resetModalButton").click(function (e) {
        $("#nodeNameInput").val("");
        $(".picSelectModal").empty();
    });

    // modal - submit button for the text bar
    $(".submit").click(function (e) {
        $(".picSelectModal").html("");

        // var apiKey = "4cac8681185d926a8cc5a7f2671b3eb5"

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
});
