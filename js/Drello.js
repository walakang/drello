/* Base class that hold all the data relevant to Drello
 * also responsible to store and restore data to and from localStorage.
 */
function Drello() {
	this.boards = [];
	this.organizations = [];
	this.debug = true;
}
/* Abstraction for console.log */
Drello.prototype.log = function(msg) {
	if (this.debug == true) {
		console.log(msg);
	}
};

/* Abstraction for document.querySelectorAll method */
Drello.prototype.getAll = function (selectors) {
	return document.querySelectorAll(selectors);
}

/* Abstraction for document.getElementByID */
Drello.prototype.getElement = function(id) {
	return document.getElementByID(id);
}

/* Save all data on localstorage as JSON*/
Drello.prototype.saveToLocal = function () {
	localStorage.setItem("boards", JSON.stringify(this.boards));
	localStorage.setItem("orgz", JSON.stringify(this.organizations));
}

/* Read localstorage and populate the boards list by parsing data from json text
 * For each object parsed add prototype of the 'Board' to it.
 */
Drello.prototype.fromLocal = function (){
	// Check if data is available in localStorage
	if (localStorage.hasOwnProperty("boards")) {
		var boardData = JSON.parse(localStorage.getItem("boards"));
		var len = boardData.length;

		for (key in boardData) {
			// Push a new board and get length.
			var len = this.boards.push(new Board());

			/* Call the fromData method to set the own properties from the
			 * data parsed from localstorage
			 */
			this.boards[len-1].fromData(boardData[key]);
		}
	}
	if (localStorage.hasOwnProperty("orgz")) {
		this.organizations = JSON.parse(localStorage.getItem("orgz"));
	}
}

/* Populate the boards list in the boards.html page 
 * boards array was previously populated from localstorage.
 * Create and append nodes for each board.
 */
Drello.prototype.populateBoards = function() {
	for (key in this.boards) {
		// Create the DOM node first.
		this.boards[key].createNode();
		this.boards[key].selfAppend();
	}
}
Drello.prototype.getRandomId = function() {
	return Math.random().toString(36).substr(2, 9);
};







function Board(name){
	this.name = name;
	this.id = Drello.prototype.getRandomId(); 	// generate unique id
	this.node =  null;
	this.lists = [];
	this.star = false;
	this.closed = false;
	//this.organization = null;
	//this.isPublic = false;

	this.isPublic = function(){
		return this.isPublic;
	}
}

Board.prototype.addList = function(list) {
	// be modular
	this.lists.push(list);
};

/* Function to remove a list from a board.
 * @param item: This can be the list object itself or a number
 *   			representing index of list in array.
 */
Board.prototype.removeList = function(item) {
	if(typeof(item)=="object" && item instanceof List){
		var index = this.lists.indexOf(item);
		this.lists.splice(index,1);
	}
	else if(typeof(item)=="number"){
		this.lists.splice(index,1);
	}
};

/* Called to create a DOM Node object from data
 * Template: 
 *			<a href="board-display.html" class="board left block round starred">
				<span class="bold">Board 1</span>
				<span class="star" title="Click to star this board. It will be shown at the top of the list"></span>					
			</a>
 */
Board.prototype.createNode = function() {
	this.node = document.createElement("a");
	this.node.className = "board left block round";
	this.node.href="board-display.html";
	this.node.dataset.id = this.id;
	// create children
	var title = document.createElement("span");
	title.className = "bold";
	title.innerHTML = this.name;
	var star = document.createElement("span");
	star.className = "star";
	star.title = "Click to star this board. It will be shown at the top of the list";
	this.node.appendChild(title);
	this.node.appendChild(star);
};

/* Must be called after this.createNode()
 * Appends this.node property object to appropriate board-list.
 * Append to the starred list also if the board is starred.
 */
Board.prototype.selfAppend = function() {
	var myList = document.querySelectorAll("#boards_my .boards-list")[0];
	var starList = document.querySelectorAll("#boards_starred .boards-list")[0];
	// add the board to the starred list if starred is true.
	if(this.star == true){
		starList.appendChild(this.node.cloneNode(true));
	}
	// Add new noard as the second last children of the list.
	var addBoardNode = myList.removeChild(myList.children[myList.children.length-1]);
	myList.appendChild(this.node);
	myList.appendChild(addBoardNode);
};

/* function fromData
 * @param data: Object received after parsing locally stored data using JSON.
 * 				copy values to self.
 */
Board.prototype.fromData = function(data){
	for ( prop in data ) {
        if ( data.hasOwnProperty(prop) ) {
        	// copy as own property.
            this[prop] = data[prop];
        }
    }
}





function List(name){
	// public vars
	this.name = name;
	this.id = null;
	this.cards = [];
	this.node = null;

	this.addCard = function(card){
		this.cards.push(card);
	}
}

function Card(name){

	this.name = name;
	this.id = null;
	this.description = null;
	this.attachments = [];
	this.colors = [];
	this.node = null;
	this.image = null;

}