function BoardController(){
	// private
	var _boardNodes = [];

	//public
	this.boardClassName = "board left block round";
	this.containerId = "boards_my .boards-list";
	this.starredBoardsContainerId = "boards_starred .boards-list";

	// privilaged
	this._getBoardNodes = function() {
		return this._boardNodes;
	}
}

/* Call to populate the boards container with the nodes created
 * from the boards array parsed from localstorage.
 */
BoardController.prototype.populateBoards = function(boards) {
	// Create nodes for every board in drello and store them in _boardNodes[]
	var list = this._getBoardNodes();
	for (var i = 0; i < boards.length; i++) {
		var node = this.createBoardNode(boards[i])
		if (node != null) list.push(node);
	};

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
	if(!(board instanceof Board)) return null;;

	var node = document.createElement("a");
	var title = document.createElement("span");
	var star = document.createElement("span");

	node.className = "board left block round";
	node.href="main.html";
	node.dataset.id = this._getId();

	title.className = "bold";
	title.innerHTML = this._getName();

	star.className = "star";
	star.title = "Click to star this board. It will be shown at the top of the list";

	node.appendChild(title);
	node.appendChild(star);

	return node;
}