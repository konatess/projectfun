//CLASS: NODE
//Each 'node' represents the data for an individual item in our game (ex: the 'rock' in rock-paper-scissors)

//A node takes in the name of the item and creates an object with a standard node format 
function Node(newName, newImg="") {
    //VARIABLES
    this.name = newName;
    this.adjacent = []; //array of references to items that this node beats
    //verb for the node
    this.verbs = [];
    //image for the node
    this.image = newImg;
    //METHODS
    //defeats(otherNode) -- add a node that it defeats
    //ASSUMES that otherNode is a node, and that newVerb is a string
    //(if newVerb is not provided, it will be set to the word 'defeats' by default)
    this.defeats = function(otherNode, newVerb="defeats") {
    //NOTE: we are going to want to think about how we update the verbs
        this.adjacent.push(otherNode);
        this.verbs.push(newVerb); 
    };
    
    //(TO-DO) remove(otherNode) -- removes an association with another node by removing that node from the'defeatsNodes'
    //NOTE: we want to do this without leaving holes -- needs to CONTRACT the array
}

//CLASS: RULESET
//An object that will store all the items in a particular game design - and helper functions to build their associations with each other

function Ruleset() {
    this.allNodes = []; //array of all the items we have in this particular game 
    this.minNodes = 3; // number of nodes we MUST have in order to make a valid game
    this.maxNodes = 25; // max number of nodes we can have to make a valid game
// CREATE METHODS
// addNode(newNodeName, newNodeImage)
// Add a brand new node to the Ruleset
// ASSUMES the node name and image are sanitized
// Will NOT accept duplicate node names
// If the insertion was successful, returns true; otherwise returns false
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
        return true;
    };
// Create steps-- add the defeat relationship to the nodes to link them for provided # of steps
// addEdge(numSteps)
// ASSUMES that numSteps is an integer, indexed from 1
// ALSO CURRENTLY ASSUMES WE ARE ADDING STEPS IN ORDER -- we may want to rethink that
// (so 'first step' - 'one away' - would be '1')
// If the numSteps is a POSITIVE integer, then we traverse the existing nodes from the first item to the last item 
// If the numSteps is a NEGATIVE integer, then we traverse the existing nodes from the last item to the first item
// Returns 'true' if a step was added successfully
// Returns 'false' if the step was not added successfully
// TO-DO: consider if we should check that it's even valid to add this particular step
    this.addEdge = function(numSteps) {
        //first, make sure we have enough items in the graph to make a valid edge (must be odd # between 3-25) -- if not, we fail to add the edge
        if((this.allNodes.length%2===0)||this.allNodes.length<this.minNodes||this.allNodes.length>this.maxNodes) {
            console.log("Invalid # of nodes to create an edge!");
            return false; 
        }
        //second, check if it's a valid # of edges...our range is described as n-1, for every 2n-1 nodes  
        var maxEdges = ((this.allNodes.length+1)/2)-1;
        if(Math.abs(numSteps)>maxEdges) {
            console.log("Invalid # of edges requested: " + numSteps + " when we have " + this.allNodes.length + " nodes with " + maxEdges + " possible edges!");    
            return false;
        }
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

// UPDATE METHODS
// Update a node -- change the name for an existing node in our array
// updateName(nodeINDEX. newName) -- change the name for a node at a specific provided index in the allNodes array
// ASSUMES that nodeIndex is an integer already
// Returns true if it was successful; false if it was not successful
    this.updateName = function(nodeIndex, newName) {
        //make sure we don't have the newName already in our list!
        if(this.findNode(newName)===-1) {
            this.allNodes[nodeIndex].name = newName;
            return true;
        }
        return false;
    };

// updateImage(nodeINDEX. newImg) -- change the image for a node at a specific provided index in the allNodes array
// ASSUMES that nodeImg is a string that links to an image
// Returns true if it was successful; false if it was not successful
    this.updateImage = function(nodeIndex, newImg) {
        this.allNodes[nodeIndex].image = newImg;
        return true;
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

//FOR DEBUGGING PURPOSES:
//console everything in the ruleset -- nodes, then their associations
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
// (TO-DO) delete a node from the allnodes array AND any associations that individuals have to it
};


//example of adding a game and then creating the associations
console.log("==============");
var myGame = new Ruleset();
myGame.addNode("spock", "spock.jpg");
myGame.addNode("scissors", "scissors.jpg");
myGame.addNode("paper", "paper.jpg");
myGame.addNode("rock", "rock.jpg");
myGame.addNode("lizard", "lizard.jpg");
myGame.addEdge(1);  //ONE NOTE: right now, we are assuming that we add steps in order; this code would not work beyond that
myGame.addEdge(-2);  
myGame.consoleLogAll();
//Example of starting a totally blank game and then just updating the node names/images
console.log("==============");
var myGame2 = new Ruleset();
myGame2.addNode();
myGame2.addNode();
myGame2.addNode();
myGame2.updateName(0,"paper");
myGame2.updateName(1,"rock");
myGame2.updateName(2,"scissors");
myGame2.updateImage(0, "paper.jpg");
myGame2.updateImage(1, "rock.jpg");
myGame2.updateImage(2, "scissors.jpg");
myGame2.addEdge(1);
myGame2.consoleLogAll();