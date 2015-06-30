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
	node.onclick = showCardPopup;
	node.draggable = "true";
	node.dataset.id = card._getId();
	node.innerHTML = '<span class="icon-pencil-alt block text-center right"></span>\
					<!--<figure class="card-image">\
						<img src="images/taco.png" />\
					</figure>-->\
					<div class="card-detail">\
						<div class="card-detail-labels">\
							<!--<span class="blue"></span>\
							<span class="green"></span>-->\
						</div>\
						<div class="card-detail-exerpt">'+card._getName()+'</div>\
						<div class="card-detail-flags">\
							<span class="icon-eye-outline"></span>\
							<span class="icon-menu"></span>\
							<span class="icon-comment"></span>\
							<span class="icon-attach"></span>\
						</div>\
						<!--<div class="card-detail-members block right">\
							<span class="avatar left i-block"><img src="members/shidil.png" class="round"></span>\
						</div>-->\
					</div>';

	return node;
}
