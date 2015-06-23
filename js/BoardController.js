function BoardController(){
	// private
	var _boardNodes = [];

	//public
	this.boardClassName = "board left block round";
	this.containerId = "#boards_my .boards-list";
	this.starredBoardsContainerId = "#boards_starred .boards-list";

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
	var container = document.querySelectorAll(this.containerId)[0];
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
	if(!(board instanceof Board)) return null;;

	var node = document.createElement("a");
	var title = document.createElement("span");
	var star = document.createElement("span");

	node.className = "board left block round";
	node.href="main.html";
	node.dataset.id = board._getId();

	title.className = "bold";
	title.innerHTML = board._getName();

	star.className = "star";
	star.title = "Click to star this board. It will be shown at the top of the list";

	node.appendChild(title);
	node.appendChild(star);

	return node;
}