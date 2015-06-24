function BoardController(){
	// private
	var _boardNodes = [];

	//public
	this.boardClassName = "board left block round";
	this.containerId = "boards_my_list";
	this.starredBoardsContainerId = "boards_starred_list";

	// privilaged
	this._getBoardNodes = function() {
		return _boardNodes;
	}
}

/* Call to populate the boards container with the nodes created
 * from the boards array parsed from localstorage.
 */
BoardController.prototype.populateBoards = function(boards) {
	var list = this._getBoardNodes();
	var container = document.getElementById(this.containerId);
	var starredContainer = document.getElementById(this.starredBoardsContainerId);

	// Add new noard as the second last children of the list.
	var addBoardNode = container.removeChild(container.children[container.children.length-1]);

	// remove all existing childs in container
	container.innerHTML = "";
	// Create nodes for every board in drello and store them in _boardNodes[] then append to container.
	for (var i = 0; i < boards.length; i++) {
		var node = this.createBoardNode(boards[i])
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

BoardController.prototype.toggleStar = function(board) {
	board = board || null;
	if(!(board instanceof Board)) return null;

	var node = this._getBoardNodes()[board._getId()];
	var starredContainer = document.getElementById(this.starredBoardsContainerId);
	if(board._isStarred()) {
		// modifiy view	
		node.getElementsByClassName("icon-star")[0].classList.remove("starred");
		// remove the node to starred list
		node = starredContainer.querySelector("[data-id='"+node.dataset.id+"']");
		starredContainer.removeChild(node);
		// modify model
		board.unStar();
	}
	else{
		// modifiy view
		node.getElementsByClassName("icon-star")[0].classList.add("starred");
		// add the node to starred list
		starredContainer.appendChild(node.cloneNode(true));
		// modify model
		board.star();

	}
};