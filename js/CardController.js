function CardController(){
	// private
	var _cardNodes = [];

	//public
	this.cardClassName = "list-item card round pointer";
	this.containerId = "board_content";

	// privilaged
	this._getCardNodes = function() {
		return _cardNodes;
	}
}


/* Called to create a DOM Node object from list object
 * @param board: the instance of List.
 * Template: 
 *			<a href="main.html" class="board left block round starred">
				<span class="bold">Board 1</span>
				<span class="star" title="Click to star this board. It will be shown at the top of the list"></span>					
			</a>
 */
CardController.prototype.createCardNode = function(card) {
	card = card || null;
	if(!(card instanceof Card)) return null;;

	var node = document.createElement("div");
	node.className = this.cardClassName;
	node.onclick = "showCardPopupToggle(event)";
	node.innerHTML = card._getName();

	return node;
}
