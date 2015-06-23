/* @param data is an object
 * { name: "NAME", id: NUMBER, .... }
 */
function Board(data) {
	// private
	var _name = data.name || "";
	var _lists = data.lists || [];
	var _closed = data.closed || false;
	var _star = data.star || false;
	var _id = data.id || 0;

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
		closed: this._isClosed()
	};
};

Board.prototype.star = function() {
	this._setStar(true);
};
Board.prototype.unStar = function() {
	this._setStar(false);
};

Board.prototype.addList = function(list) {
	list = list || null;
	return (list instanceof List) ? this._getLists().push(list) : false;
};

/* Function to remove a list from a board.
 * @param item: This can be the list object itself or a number
 *   			representing index of list in array.
 * returns success.
 */
Board.prototype.removeList = function(item) {
	item = item || null;
	var lists = this._getLists();
	if (typeof item === "object" && item instanceof List) {
		var index = lists.indexOf(item);
		// check if item exists and if remove and return nex length of array
		return (index >= 0) ? lists.splice(index,1).length : false;
	}
	else if (typeof item === "number") {
		return (item >= 0 && item < lists.length ) ?  lists.splice(item,1).length : false;
	}
	return false;
};

/* Returns the list object from _lists array if an object mathched the key
 * @param key: 1. key is a id of list.
 			   2. key is name of list.
 */
Board.prototype.getList = function(key) {
	key = key || null;
	var lists = this._getLists();
	if (typeof key === 'number') {
		return lists[key];
	}
	else if (typeof key === 'string') {
		for (var i = lists.length - 1; i >= 0; i--) {
			if (lists[i].name === key) return lists[i];
		};
	}
	console.log("Board.getList: Invalid key");
	return null;
};

/* Move s list to a new position
 * @param a: position of item 1
 * @param b: position of item 2
 */
Board.prototype.swapLists = function(a, b) {
	var lists = this._getLists();
	// check upperbound and lowerbound of a and b.7
	if(typeof a === "number" && typeof b === "number" && a >= 0 && a < lists.length && b >= 0 && b < lists.length) {
		var temp = lists[a];
		lists[a] = lists[b];
		lists[b] = temp;
		return true;
	}
	console.log("Board.swapLists: Invalid input");
	return false;
};


/* Called to create a DOM Node object from data
 * Template: 
 *			<a href="main.html" class="board left block round starred">
				<span class="bold">Board 1</span>
				<span class="star" title="Click to star this board. It will be shown at the top of the list"></span>					
			</a>
 */
/*Board.prototype.createNode = function() {
	this.node = document.createElement("a");
	this.node.className = "board left block round";
	this.node.href="main.html";
	this.node.dataset.id = this._getId();
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
*/
/* Must be called after this.createNode()
 * Appends this.node property object to appropriate board-list.
 * Append to the starred list also if the board is starred.
 */
/*Board.prototype.selfAppend = function() {
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
};*/