function BoardController(){
	var _boardNodes = [];

	// This object holds the core methods and properties.
	var _drello = new Drello();

	//public
	this.boardClassName = "board left block round";
	this.containerId = "boards_my_list";
	this.starredBoardsContainerId = "boards_starred_list";

	// privilaged
	this._getBoardNodes = function() {
		return _boardNodes;
	}
	this._getDrello = function() {
		return _drello;
	}
}

/* Load data from local storage */
BoardController.prototype.loadEverything = function() {
	this._getDrello().fromLocalStorage();
};

/* Save data to localstorage */
BoardController.prototype.saveEverything = function() {
	// save the new order of the array
	this._getDrello()._getBoards().forEach(function (board) {
		board.normalizeListIds();
	})
	this._getDrello().toLocalStorage();
};

BoardController.prototype.addNewBoard = function(boardName) {
	var board = new Board({name: boardName, id: this._getDrello().getNextBoardId() });
	this._getDrello().addBoard(board)
	return board._getId();
};

BoardController.prototype.addNewList = function(ListName,boardId) {
	var board = this._getDrello().getBoard(boardId);
	if(board) {
		var list = new List({name: ListName, id: board.getNextListId() });
		board.addList(list);
		return board;
	}
	return null;
};

BoardController.prototype.addNewCard = function(cardName, listId, boardId) {
	var board = this._getDrello().getBoard(boardId);
	if (board) {
		var list = board.getList(listId);
		if(list)
			list.addCard(new Card({ name: cardName, id: list.getNextCardId() }));
		return board;
	}
	return null;
};

/* Call to populate the boards container with the nodes created
 * from the boards array parsed from localstorage.
 */
BoardController.prototype.populateBoards = function() {
	// Refresh data
	this.loadEverything();

	var boards = this._getDrello()._getBoards();
	var list = this._getBoardNodes();
	var container = document.getElementById(this.containerId);
	var starredContainer = document.getElementById(this.starredBoardsContainerId);
	var node = null; var i,len;

	// Add new noard as the second last children of the list.
	var addBoardNode = container.removeChild(container.children[container.children.length-1]);

	// remove all existing childs in container
	container.innerHTML = "";
	starredContainer.innerHTML = "";
	list.length = 0;
	// Create nodes for every board in drello and store them in _boardNodes[] then append to container.
	for (i = 0, len = boards.length; i < len; i++) {
		// exclude closed boards
		if(boards[i]._isClosed()) continue;
		node = this.createBoardNode(boards[i])
		if (node != null) {
			list.push(node);
			container.appendChild(node);
			// Append to starred list if board has star
			if(boards[i]._isStarred()) starredContainer.appendChild(node.cloneNode(true));
		}
	};
	container.appendChild(addBoardNode);

};

/* Called to create a DOM Node object from boards object
 * @param board: the instance of Board.
 * Template: 
 *			<a href="main.html" class="board left block round starred">
				<span class="bold">Board 1</span>
				<span class="star" title="Click to star this board. It will be shown at the top of the list"></span>					
			</a>
 */
BoardController.prototype.createBoardNode = function(board) {
	board = board || null;
	if(!(board instanceof Board)) return null;

	var node = document.createElement("a");
	var title = document.createElement("span");
	var star = document.createElement("span");

	node.className = this.boardClassName;
	node.href="main.html";
	node.dataset.id = board._getId();

	title.className = "board-title bold";
	title.innerHTML = board._getName();

	star.className = "icon-star right";
	if(board._isStarred()) star.classList.add("starred");
	star.title = "Click to star this board. It will be shown at the top of the list";

	node.appendChild(title);
	node.appendChild(star);

	return node;
}

BoardController.prototype.toggleStar = function(id) {
	var board = this._getDrello().getBoard(id);
	if(!board) return null;

	var node = this._getBoardNodes()[board._getId()];
	var starredContainer = document.getElementById(this.starredBoardsContainerId);
	if(board._isStarred()) {
		console.info("BoardController.toggleStar: the board was previously starred.");
		// modifiy view	
		node.getElementsByClassName("icon-star")[0].classList.remove("starred");
		document.getElementById("board_ribbon_star").classList.remove("starred")
		// remove the node to starred list
		node = starredContainer.querySelector("[data-id='"+node.dataset.id+"']");
		starredContainer.removeChild(node);
		// modify model
		board.unStar();

		console.log("BoardController.toggleStar: the board was successfully unstarred.");
	}
	else{
		console.info("BoardController.toggleStar: the board wasn't starred");
		// modifiy view
		node.getElementsByClassName("icon-star")[0].classList.add("starred");
		document.getElementById("board_ribbon_star").classList.add("starred")
		// add the node to starred list
		starredContainer.appendChild(node.cloneNode(true));
		// modify model
		board.star();

		console.log("BoardController.toggleStar: the board was successfully starred.");
	}
}

/* This function searches for boards in Drello model and returns an array of nodes made
 * from the result.
 */
BoardController.prototype.searchBoards = function(key) {
	var boards = this._getDrello().searchBoards(key);  // returns [] for invalid key also.
	var boardNodes = [], __node = null;
	console.log("SearchBoards: looping through "+boards.length+" results");
	if (boards) {
		for(i = 0, len = boards.length; i < len; i++) {
			if(boards[i]._isClosed()) continue;
			__node = document.createElement("a");
			__node.dataset.id = boards[i]._getId();
			__node.className = "boards-list-item round block";
			__node.href = "main.html";
			__node.innerHTML = '<span class="color"></span>\
			<span class="board-name width-100 bold" >'+boards[i]._getName();+' </span>\
			<span class="icon-star"></span>\
			';
			boardNodes.push({node: __node, starred: boards[i]._isStarred()});
		}
	}
	return boardNodes;
}

BoardController.prototype.getBoard = function(id) {
	return this._getDrello().getBoard(id);
}

BoardController.prototype.closeBoard = function(id) {
	return this._getDrello().getBoard(id)._close();
};

BoardController.prototype.openBoard = function(id) {
	return this._getDrello().getBoard(id)._open();
};

BoardController.prototype.moveList = function(boardId, id,  dstPos) {
	// check the direction of the move
	//dstPos = (dstPos > id) ? dstPos -1 : dstPos;
	this._getDrello().getBoard(boardId).moveList(id,  dstPos);
};

BoardController.prototype.moveCardToList = function(boardId, cardId, srcListId, dstListId, dstPos) {
	var board = this.getBoard(boardId);
	if (board) {
		var srcList = board.getList(srcListId);
		var dstList = board.getList(dstListId);
		if (srcList && dstList) {
			var card = srcList.getCard(cardId);
			if (card) {
				if (srcList === dstList) { // move card to a new position inside same list
					// check the direction of the move
					dstPos = (dstPos > cardId) ? dstPos -1 : dstPos;
					dstList.moveCard(cardId, dstPos);
				}
				else { // inter list transaction
					srcList.removeCard(card);
					dstList.addCard(card, dstPos);	
				}	
				
				return true;	
			}
		}
	}
	return false;
};

BoardController.prototype.getClosedBoards = function() {
	var closedBoards = this._getDrello().getClosedBoards();
	var i, len, boardNodes = [], node;
	for(i = 0, len = closedBoards.length; i < len; i++) {
		// Create nodes
		node = document.createElement("div");
		node.className = "closed-boards-list-item";
		node.innerHTML = '<a href="#" class="normal block left padding-5">'+closedBoards[i]._getName()+'</a>\
						  <a href="#" class="normal block btn btn-small btn-gray icon-cw right" data-id="'+closedBoards[i]._getId()+'">Re-open</a>\
						 ';
		boardNodes.push(node);
	}
	return boardNodes;
};