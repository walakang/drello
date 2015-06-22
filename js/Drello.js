/* Base class that hold all the data relevant to Drello
 * also responsible to store and restore data to and from localStorage.
 */
function Drello() {
	var _boards = [];

	this.debug = true;

	this._getBoards = function() {
		return _boards;
	}
}

/* Save all data on localstorage as JSON*/
Drello.prototype.saveToLocalStorage = function () {
	localStorage.setItem("boards", JSON.stringify( this._getBoards() ));
}

/* Read localstorage and populate the boards list by parsing data from json text
 * For each object parsed add prototype of the 'Board' to it.
 */
Drello.prototype.fromLocalStorage = function (){
	// Check if data is available in localStorage
	if (localStorage.hasOwnProperty("boards")) {
		var boardData = JSON.parse(localStorage.getItem("boards"));

		for (key in boardData) {
			// Push a new board and get length.
			var len = this.addBoard(new Board(boardData[key]));

			/* Call the fromData method to set the own properties from the
			 * data parsed from localstorage
			 */
			//this._getBoards()[len-1].fromData(boardData[key]);
		}
	}
}

/* Populate the boards list in the boards.html page 
 * boards array was previously populated from localstorage.
 * Create and append nodes for each board.
 */
Drello.prototype.populateBoards = function() {
	var boards = this._getBoards();
	for (key in boards) {
		// Create the DOM node first.
		boards[key].createNode();
		boards[key].selfAppend();
	}
}

Drello.prototype.getNextBoardId = function() {
	if (this._getBoards().length != null)
		return this._getBoards().lengt;
	return 0;
};

Drello.prototype.addBoard = function(board) {
	board = board || null;
	if(board !=null && board instanceof Board){
		return this._getBoards().push(board);
	}
};

/* Returns the board object from this.boards array if an object mathched the key
 * @param key: 1. key is a name of board.
 			   2. key is id of board.
 */
Drello.prototype.getBoard = function(key) {
	key = key || false;
	if (typeof key === 'number') {
		return this.boards[key];
	}
	else if (typeof key === 'string') {
		for (var i = this.boards.length - 1; i >= 0; i--) {
			if (this.boards[i].name === key) return this.boards[i];
		};
	}
	console.log("Drello.getBoard: key is neither a number or a string");
};

Drello.prototype.searchBoards = function(key) {
	if(typeof key != "string") return [];

	// filter boards list using custom search function
	return this._getBoards().filter(function(){
		return true;
	});
};

/* @param data is an object
 * { name: "NAME", id: NUMBER, .... }
 */
function Board(data) {
	// private
	var _name = data.name || null;
	var _lists = data.lists || [];
	var _closed = data.closed || false;
	var _star = data.star || false;
	var _id = data.id || null;

	// public

	// privilaged
	this._getName = function() {
		return _name;
	}
	this._getLists = function() {
		return _lists;
	}
	this._getId = function() {
		return _id;
	}
	this._setStar = function(star) {
		_star = star;
	}
	this._isStarred = function() {
		return _star;
	}
	this._setClosed = function() {
		_closed = true;
	}
	this._isClosed = function() {
		return _closed;
	}
}

Board.prototype.toJSON = function() {
	return {
		name: this._getName(),
		id: this._getId(),
		lists: this._getLists(),
		star: this._isStarred(),
		_closed: this._isClosed()
	};
};

/* function fromData
 * @param data: Object received after parsing locally stored data using JSON.
 * 				copy values to self.
 */
/*Board.prototype.fromJData = function(data){
	for ( prop in data ) {
        if ( data.hasOwnProperty(prop) ) {
        	// copy as own property.
            this[prop] = data[prop];
        }
    }
}*/

Board.prototype.addList = function(list) {
	list = list || null;
	if(list != null && list instanceof List)
		return this.getLists().push(list);
};

/* Function to remove a list from a board.
 * @param item: This can be the list object itself or a number
 *   			representing index of list in array.
 * returns success.
 */
Board.prototype.removeList = function(item) {
	item = item || null;
	if (item != null && typeof item === "object" && item instanceof List) {
		var index = this.lists.indexOf(item);
		this.lists.splice(index,1);
		return true;
	}
	else if (item != null && typeof item === "number") {
		this.lists.splice(index,1);
		return true;
	}
	return false;
};

/* Called to create a DOM Node object from data
 * Template: 
 *			<a href="main.html" class="board left block round starred">
				<span class="bold">Board 1</span>
				<span class="star" title="Click to star this board. It will be shown at the top of the list"></span>					
			</a>
 */
Board.prototype.createNode = function() {
	this.node = document.createElement("a");
	this.node.className = "board left block round";
	this.node.href="main.html";
	this.node.dataset.id = this.id;
	// create children
	var title = document.createElement("span");
	title.className = "bold";
	title.innerHTML = this._getName();
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
List.prototype.createNode = function() {
	this.node = document.createElement("div");
	this.node.className = "list round";
	this.node.dataset.id = this.id;
	var listHead = document.createElement("div");
	listHead.className = "list-item list-head bold pointer";
	listHead.innerHTML = '<span class="title">Ideas</span> \
						<a class="right" id="list_actions_toggle"><span class="icon-download"></span></a>';
	this.node.appendChild(listHead);
	// generate cards
	var len = this.cards.length;
	for (var i = 0; i< len; i++) {
		this.cards[i].createNode();
		this.node.appendChild(this.cards[i].node);
	}
	// Add card button
	var listTail = document.createElement("div");
	listTail.className = "list-item clear pointer";
	listTail.id = "add_card";
	listTail.innerHTML = "Add card...";
	this.node.appendChild(listTail);
};

function Card(name){

	this.name = name;
	this.id = null;
	this.description = null;
	this.attachments = [];
	this.colors = [];
	this.node = null;
	this.image = null;

}
Card.prototype.createNode = function() {
	this.node = document.createElement("div");
	this.node.className = "list-item card round pointer";
	this.node.onclick = "showCardPopupToggle(event)";
	this.node.innerHTML = this.name;

};