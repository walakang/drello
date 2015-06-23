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
		return this._getBoards().length;
	return 0;
};

Drello.prototype.addBoard = function(board) {
	board = board || null;
	if(board !=null && board instanceof Board){
		return this._getBoards().push(board);
	}
};

/* Returns the board object from this.boards array if an object mathched the key
 * @param key: 1. key is a id of board.
 			   2. key is name of board.
 */
Drello.prototype.getBoard = function(key) {
	var boards = this._getBoards();
	if (typeof key === 'number') {
		return boards[key];
	}
	else if (typeof key === 'string') {
		for (var i = boards.length - 1; i >= 0; i--) {
			if (boards[i].name === key) return boards[i];
		};
	}
	console.log("Drello.getBoard: Invalid key");
	return null;
};

Drello.prototype.searchBoards = function(key) {
	if(typeof key != "string") return [];

	// filter boards list using custom search function
	return this._getBoards().filter(function(){
		return true;
	});
};




