function Drello(){
	/* Base class that hold all the data relevant to Drello
	 * also responsible to store and restore data to and from localStorage.
	 */
	this.boards = [];
	this.organizations = [];
}

/* Abstraction for document.querySelectorAll method */
Drello.prototype.getAll = function (selectors) {
	return document.querySelectorAll(selectors);
}

/* Save all data on localstorage */
Drello.prototype.saveToLocal = function (){
	localStorage.boards = JSON.stringify(this.boards);
	localStorage.organizations = JSON.stringify(this.organizations);
}

/* Read localstorage and populate the boards list by parsing data from json text
 * For each object parsed add prototype of the 'Board' to it.
 */
Drello.prototype.fromLocal = function (){
	// Array
	var boardData = JSON.parse(localStorage.boards);
	var len = boardData.length;
	for(key in boardData){
		// Push the Board object to list
		var len = this.boards.push(new Board());
		/* Call the fromData method to set the own properties from the
		 * data parsed from localstorage
		 */
		this.boards[len-1].fromData(boardData[key]);
	}
	this.organizations = JSON.parse(localStorage.organizations);
}

/* Populate the boards list in the boards.html page 
 * boards array was previously populated from localstorage.
 * Create and append nodes for each board.
 */
Drello.prototype.populateBoards = function(){
	for (key in this.boards) {
		// Create the DOM node first.
		this.boards[key].createNode();
		this.boards[key].selfAppend();
	}
}









function Board(name){
	// public vars
	this.name = name;
	this.id = null;
	this.lists = [];
	this.star = false;
	this.organization = null;
	this.node =  null;
	this.isPublic = false;

	this.addList = function(list){
		// be modular
		this.lists.push(list);
	}
	this.removeList = function(item){
		if(typeof(item)=="object" && item instanceof List){
			var index = this.lists.indexOf(item);
			this.lists.splice(index,1);
		}
		else if(typeof(item)=="number"){
			this.lists.splice(index,1);
		}
	}
	this.isPublic = function(){
		return this.isPublic;
	}
	this.createNode = function(){
		this.node = document.createElement("a");
		this.node.className = "board left block round";
		this.node.href="board-display.html";
		// create children
		var title = document.createElement("span");
		title.className = "bold";
		title.innerHTML = this.name;
		var star = document.createElement("span");
		star.className = "star";
		star.title = "Click to star this board. It will be shown at the top of the list";
		this.node.appendChild(title);
		this.node.appendChild(star);
	}
	this.selfAppend = function(){
		var list = document.querySelectorAll("#boards_my .boards-list")[0];
		var lastNode = list.removeChild(list.children[list.children.length-1]);
		list.appendChild(this.node);
		list.appendChild(lastNode);
	}
}
Board.prototype.fromData = function(data){
	for ( prop in data ) {
        if ( data.hasOwnProperty(prop) ) {
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