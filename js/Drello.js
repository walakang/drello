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
Drello.prototype.toLocalStorage = function () {
	localStorage.setItem("boards", JSON.stringify( this._getBoards() ));
}

/* Read localstorage and populate the boards list by parsing data from json text
 * For each object parsed add prototype of the 'Board' to it.
 */
Drello.prototype.fromLocalStorage = function (){
	this._getBoards().length = 0;

	// Check if data is available in localStorage
	if (localStorage.hasOwnProperty("boards")) {
		var boardData = JSON.parse(localStorage.getItem("boards"));

		for (key in boardData) {
			// Push a new board and get length.
			var len = this.addBoard(new Board(boardData[key]));
		}
	}
}

Drello.prototype.getNextBoardId = function() {
	if (this._getBoards().length != null)
		return this._getBoards().length;
	return 0;
};

Drello.prototype.addBoard = function(board) {
	board = board || null;
	return (board instanceof Board) ? this._getBoards().push(board) : false;
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

/* Call to get a list of boards which has names that contain the search key
 * @param key: string
 */
Drello.prototype.searchBoards = function(key) {
	if(typeof key != "string") return [];

	// filter boards list using custom search function
	return this._getBoards().filter(function(board){
		return (board._getName().toLowerCase().indexOf(key.toLowerCase()) >- 1) ? true : false;
	});
};

Drello.prototype.getClosedBoards = function() {
	return this._getBoards().filter(function(board) {
		return board._isClosed();
	});
};




