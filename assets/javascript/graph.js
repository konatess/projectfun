//CLASS: NODE
//Each 'node' represents the data for an individual item in our game (ex: the 'rock' in rock-paper-scissors)

//A node takes in the name of the item and creates an object with a standard node format 
function Node(newName, newImg="") {
    //VARIABLES
    this.name = newName;
    this.adjacent = []; //array of references to items that this node beats
/*     //verb for the node
    this.verbs = []; */
    //image for the node
    this.image = newImg;
    //METHODS
    //defeats(otherNode) -- add a node that it defeats
    //ASSUMES that otherNode is a node, and that newVerb is a string
    //(if newVerb is not provided, it will be set to the word 'defeats' by default)
    this.defeats = function(otherNode, newVerb="defeats") {
    //NOTE: we are going to want to think about how we update the verbs
        this.adjacent.push(otherNode);
        /* this.verbs.push(newVerb);  */
    };
    this.winsAgainst = function(otherNode) {
        //checks if another node exists already in our adjacents array
        //if so, that means we win! return the index to the item 
        for(let b=0; b<this.adjacent.length; b++) {
            if(this.adjacent[b]===otherNode) {
                return b;
            }
        }
        return 0;
    };
}

//CLASS: RULESET
//An object that will store all the items in a particular game design - and helper functions to build their associations with each other

function Ruleset() {
    this.allNodes = []; //array of all the items we have in this particular game 
    this.edges = []; //array to stash info about all the edges  
                     //NOTE: right now, which edge we are on depends on the position within the array -- ex, edges[0] stores the FIRST step 
                     //a 1 means the edge goes in our default direction (FORWARD) through the allNodes array
                     //a 0 means the edge goes the opposite direction (BACKWARD) through the allNodes array

    this.minNodes = 3; // number of nodes we MUST have in order to make a valid game
    this.maxNodes = 15; // max number of nodes we can have to make a valid game
    this.title = "Game Title"; //title of the game
// CREATE METHODS
// addNode(newNodeName, newNodeImage)
// Add a brand new item (node) to the Ruleset
// ASSUMES the node name and image are sanitized
// Will NOT accept duplicate node names
// If the insertion was successful, returns true; otherwise returns false
// AS NODES ARE ADDED: will automatically populate an 'edge' when appropriate (every 2n-1 node)
    this.addNode = function(newNodeName="", newNodeImage="") {
        //first, make sure we aren't adding TOO many nodes...we have a max # that we enforce
        if(this.allNodes.length>=this.maxNodes) {
            console.log("Err - exceeding max # of nodes!");
            return false;
        }
        //NOTE: we will ignore the search step for nulls, since we may initialize a game full of null items
        if(newNodeName!="") {
            //if there IS a string though, we should make sure we don't already have a node by this name!
            if(this.findNode(newNodeName)>=0) {
                console.log("Err - we already have a node by that name!");
                return false;
             }
        }
        var newNode = new Node(newNodeName, newNodeImage); //create a new node with the provided name/image
        this.allNodes.push(newNode); //add the new node to our internal collection
        //if we have hit 2n-1 nodes, let's add an additional step
        //(TO-DO) consider how this behavior should (or should not) change when we can also delete nodes
        if(this.allNodes.length%2!=0&&this.allNodes.length>=this.minNodes) {
            this.edges.push(1);
        }
        return true;
    };


// UPDATE METHODS
// setName(nodeINDEX. newName) -- change the name for a node at a specific provided index in the allNodes array
// ASSUMES that nodeIndex is an integer already
// Returns true if it was successful; false if it was not successful
    this.setName = function(nodeIndex, newName) {
        //make sure we don't have the newName already in our list!
        if(this.findNode(newName)===-1) {
            this.allNodes[nodeIndex].name = newName;
            return true;
        }
        return false;
    };

// setImage(nodeINDEX. newImg) -- change the image for a node at a specific provided index in the allNodes array
// ASSUMES that nodeImg is a string that links to an image
// Returns true if it was successful; false if it was not successful
    this.setImage = function(nodeIndex, newImg) {
        this.allNodes[nodeIndex].image = newImg;
        return true;
    };


    //setEdge(edgeNumber) 
    //sets the value stored for a particular edge by using the human-readable '# of steps' convention
    //ASSUMES we are setting the value to something valid (1 or -1)
    //returns true if successful, false if not successful
    this.setEdge = function(humanReadableEdge, newValue) {
        const edgePosition = Math.abs(humanReadableEdge)-1; //convert the "# of steps" into an index 
        if(edgePosition<this.edges.length && edgePosition>=0) { //if that index fits within our array of edges
            this.edges[edgePosition] = newValue; //set the edge to the new value
            return true;
        }
        return false; //otherwise, the operation failed 
    };
    
    //toggleEdge(edgeNumber) 
    //TOGGLES the directionality of an edge by flipping whatever is currently stored there 
    //USES the existing functions for getting/setting edges :)
    this.toggleEdge = function(humanReadableEdge) {
        //first, we need to see what the current value is:
        var currentValue = this.getEdge(humanReadableEdge); 
        if(currentValue) { //if we were able to find an edge by this name...
            //we just multiply its current value by -1 to flip the directions!
            this.setEdge(humanReadableEdge, currentValue*-1);
            return true; 
        }
        return false;
    };


// READ METHODS
//find(nodeName)
//returns an index to a node with that name
//returns -1 if not found
//ASSUMES that searchNodeName is a string and not null - will also return -1 on nulls
    this.findNode = function(searchNodeName) {
        //NOTE: we use a traditional for loop here because foreach doesn't allow you to elegantly break once you find the item -- and in our design, we are only allowing uniquely named items so we can always end the search as soon as we find a match
        for(let i = 0; i<this.allNodes.length; i++) {
            if(this.allNodes[i].name.toLowerCase()===searchNodeName.toLowerCase()) {
                    return i; //return the position in the allNodes array where the item was found
            }
        }
        return -1; //otherwise we didn't find it; return -1
    };

    //getName(nodeIndex)
    //gets the name for a particular node
    //ASSUMES that the parameter nodeIndex is an integer
    //returns the name if it finds one; otherwise returns false
    this.getName = function(nodeIndex) {
        //make sure that the index fits in our array
        if(nodeIndex<this.allNodes.length) {
            return this.allNodes[nodeIndex].name;
        }
        return false; //if it fails, return false
    };

    //getImage(nodeIndex)
    //gets the image url for a particular node
    //ASSUMES that the parameter nodeIndex is an integer
    //returns the image url if it finds one; otherwise returns false
    this.getImage = function(nodeIndex) {
        //make sure that the index fits in our array
        if(nodeIndex<this.allNodes.length) {
             return this.allNodes[nodeIndex].image;
        }
        return false; //if it fails, return nothing
    };

    //getEdge(edgeNumber)
    //gets the value stored for a particular edge by using the human-readable '# of steps' convention
    //returns -1 if nothing found
    this.getEdge = function(humanReadableEdge) {
        const edgePosition = Math.abs(humanReadableEdge)-1; //convert the "# of steps" into an index 
        if(edgePosition<this.edges.length && edgePosition>=0) { //if that index fits within our array of edges
            return this.edges[edgePosition]; //return the value found at that index
        }
        return false; //otherwise, we didn't find an edge at this position
    };


//totalNodes() 
//returns the current number of nodes in the ruleset (so we don't have to remember to use the allNodes.length)
this.totalNodes = function() {
    return this.allNodes.length;
}

this.totalEdges = function() {
    return this.edges.length;
}

//COMPILE THE FINAL GAME FOR PLAY
//isValid() 
//validates if the current ruleset is a complete game or not
//returns true if the ruleset is complete, returns false if the ruleset is not complete
//10.2.18 UPDATE -- per group discussion, games will now FAIL to be valid if the user didn't pick both an image and a name for each node!
    this.isValid = function() {
        //check if the game has a title - if not, it's invalid
        if(this.title==="") {
            return false;
        }
        //check if we have the right # of nodes -- must be between the min & max # of nodes, and an odd #
        if(this.allNodes.length<this.minNodes || !this.allNodes.length>this.maxNodes || this.allNodes.length%2===0) {
            console.log("Not a valid game - wrong # of nodes!");
            return false;
        }
        //check how many edges we should have -- do we have enough, and are the values valid (either 1 or -1)?
        var projectedNumberOfEdges = ((this.allNodes.length+1)/2)-1; //edges should be n-1, where total # of nodes is 2n-1
        if(this.edges.length!==projectedNumberOfEdges) {
            console.log("Not a valid game - wrong # of edges!");
            return false;
        }

        //now make sure that all nodes at least have a name (no blanks)...
        for(let i=0; i<this.allNodes.length; i++) {
            if(this.allNodes[i].name==="") {
                console.log("Not a valid game - not all nodes have names!");
                return false;
            }
            if(this.allNodes[i].image==="") {
                console.log("Not a valid game - not all nodes have images!");
                return false;
            }
        }

        //now make sure that all edges are either 1 or -1 (only valid options) 
        for(let j=0; j<this.edges.length; j++) {
            if(this.edges[j]!==1 && this.edges[j]!==-1) {
                console.log("Not a valid game - one of the edges has a value other than 1 or -1!");
                return false;
            }
        }

        //otherwise, if we succeeded in all our checks - we have a valid game!
        return true;
    };

// addEdge(numSteps)
// ASSUMES that numSteps is an integer (indexed from 1); also that we are adding steps in order
// (This assumption should work because we only call this method through the internal 'compile' method)
// If the numSteps is a POSITIVE integer, then we traverse the existing nodes from the first item to the last item 
// If the numSteps is a NEGATIVE integer, then we traverse the existing nodes from the last item to the first item
// Returns 'true' if a step was added successfully
// Returns 'false' if the step was not added successfully
// TO-DO: consider if we should check that it's even valid to add this particular step
    this.addEdge = function(numSteps) {

    const totalNodes = this.allNodes.length; //total number of items we have
    const bindingVar = this;  //binding variable for use in callback function
    this.allNodes.forEach(function(currentNode, index){
        //figure out where our target is 
        var targetIndex = index + numSteps;
        //make sure that target index doesn't exceed the bounds of our array!
        if(targetIndex<0) {  //if we have gone below the START of the array, adjust our goals
            targetIndex = totalNodes + targetIndex;
        }
        else if (targetIndex>=totalNodes) { //OR if we have gone past the END of the array
            //figure out how much we overshot by:
            targetIndex = targetIndex - totalNodes;
        }
        //now that we have this set, add the correct association
        currentNode.defeats(bindingVar.allNodes[targetIndex]);
    });
    return true;
};

//compile() 
//This function will build the game's associations based on how many steps we have and their directionality
//Returns TRUE upon success, FALSE on failure
this.compile = function(){
    //first, make sure we have a valid game - we have to have the right # of nodes (between our min & max, odd #)
    if(!this.isValid()) {
        return false;
    }
    //next, clear out any associations these nodes already have (so that we can recompile if that ever comes up)
    this.allNodes.forEach(function(currentNode, index){
        currentNode.adjacent = [];
    });

    for(let i =0; i<this.edges.length; i++) {
        var currentStep = i+1; //use the humanreadable 'step' convention (indexed from 1)
        currentStep*=this.edges[i]; //apply the directionality to the step, using what's stored in the 'edge' array
                                    //since directionality is stored as 1 (forward) or -1 (backward), we can just multiply it against the current step to make the directions work :)
        this.addEdge(currentStep); //finally, add the edge associations!
    }
    return true;
};

//compare(indexOne, indexTwo) 
//This function will determine if the node found at indexOne defeats the node found at indexTwo
//ASSUMES the game has been compiled
//ASSUMES the indexes are for two nodes in-range of the array
this.compare = function(indexOne, indexTwo) {
    var firstNode = this.allNodes[indexOne];
    var secondNode = this.allNodes[indexTwo];
    if(firstNode.winsAgainst(secondNode)) {
        return true;
    }
    return false;
};

//FOR DEBUGGING PURPOSES:
//console log everything in the ruleset -- nodes, then their associations
    this.consoleLogAll = function() {
        for(let i=0; i<this.allNodes.length; i++) {
            var result = "#" + i + " " + this.allNodes[i].name + "(" + this.allNodes[i].image + ")";
            if(this.allNodes[i].adjacent.length>0) {
                result+=" defeats: ";
                for(let j=0; j<this.allNodes[i].adjacent.length; j++) {
                    result+=this.allNodes[i].adjacent[j].name + " ";
                }
                console.log(result);
            }
            else {
                result+= " has no associations!";
                console.log(result);
            }
        }
  
    };

// DELETE METHODS
// deleteNode(nodeIndex) 
// removes a node from the allNodes array (and if necessary) the related directionality stored in the edges array
// ASSUMES the index is a sanitized integer 
// returns TRUE if it succeeded, FALSE if it failed 
    this.deleteNode = function(nodeIndex) {
        const currentNumberOfNodes = this.allNodes.length; //NOTE: using constants for length avoids accidentally changing array length (which will automatically delete stuff)
        //if this node exists in our current list, and it wouldn't make our game invalid by removing too many nodes - then we can delete!
        //so we check if the index is less than our current number of nodes, and we also make sure that deleting a node wouldn't put us under the minimum
        if((nodeIndex < currentNumberOfNodes)&&(currentNumberOfNodes-1>=this.minNodes)) { 
            this.allNodes.splice(nodeIndex, 1); //splice this node out of the allNodes array completely!
            //next, delete an edge if necessary
            //NOTE: this will happen when we have go from an odd # of nodes to an even # - we can't have a complete edge with an even # of nodes
            const newNumberOfNodes = this.allNodes.length;
            if(newNumberOfNodes%2===0) {
                this.edges.pop(); //remove the last edge that we have
            }
            return true;
        }
        return false;
    };  
};

//Example of starting a totally blank game and then just updating the node names/images as we define them!
/*  console.log("======TRADITIONAL ROCK PAPER SCISSORS EXAMPLE========");
var vanillaRPS = new Ruleset();
vanillaRPS.addNode();
vanillaRPS.addNode();
vanillaRPS.addNode();
vanillaRPS.setName(0,"paper");
vanillaRPS.setName(1,"rock");
vanillaRPS.setName(2,"scissors");
vanillaRPS.setImage(0, "paper.jpg");
vanillaRPS.setImage(1, "rock.jpg");
vanillaRPS.setImage(2, "scissors.jpg");
vanillaRPS.compile();
vanillaRPS.consoleLogAll();  */


//example of adding a game and then deleting nodes within it!
//here's how easy it is to create 'rock-paper-scissors-lizard-spock'!
/*  console.log("======BIG BANG THEORY EXAMPLE========");
var bigBangTheoryGame = new Ruleset();
bigBangTheoryGame.addNode("spock", "spock.jpg");
bigBangTheoryGame.addNode("scissors", "scissors.jpg");
bigBangTheoryGame.addNode("paper", "paper.jpg");
bigBangTheoryGame.addNode("rock", "rock.jpg");
bigBangTheoryGame.addNode("lizard", "lizard.jpg");
bigBangTheoryGame.toggleEdge(2); //we have to reverse the direction for the 'two-away' steps
bigBangTheoryGame.compile(); */
//bigBangTheoryGame.consoleLogAll(); //and we can see that we have a fully fledged 5-node game!

//what if we wanted to delete items?  Let's see...
/* console.log("======DELETE ONE NODE========");  
bigBangTheoryGame.deleteNode(0); //delete the first node...taking us down to just four
bigBangTheoryGame.compile(); //NOTE: this compile operation will now fail, since four items is not a valid game
console.log("======DELETE TWO NODES========");
bigBangTheoryGame.deleteNode(3); //okay, let's delete one more item then
bigBangTheoryGame.compile(); //this time the game WILL compile, because three nodes is a valid game!
bigBangTheoryGame.consoleLogAll();
 */ 


