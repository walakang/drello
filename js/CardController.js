function CardController(){
	// private
	var _cardNodes = [];

	//public
	this.cardClassName = "list-item card round pointer";
	this.containerId = "board_content";

	// privilaged
	this._getCardNodes = function() {
		return _cardNodes;
	};
}


/* Called to create a DOM Node object from list object
 * @param {board} the instance of List.
 * Template:
 *
 */
CardController.prototype.createCardNode = function(card) {
	card = card || null;
	if(!(card instanceof Card)) return null;

	var coverImage = card.getCoverImage();
	var coverHTML = (coverImage) ? '<figure class="card-image">\
						<img src="'+coverImage.data+'" />\
					</figure>' : '';

	var node = document.createElement("li");
	var cardFlagsHTML = "";
	if (card._getDesc().trim()) cardFlagsHTML += '<span class="icon-menu" title="This card has a description"></span>';
	if (card._getAttachments().length > 0) cardFlagsHTML += '<span class="icon-attach" title="This card has attachments"></span>';
	node.className = this.cardClassName;
	node.onclick = showCardPopup;
	node.draggable = "true";
	node.dataset.id = card._getId();
	node.innerHTML = '<span class="icon-pencil-alt block text-center right" onclick="showCardEditPopup(event)"></span>\
					'+coverHTML+'\
					<div class="card-detail">\
						<div class="card-detail-labels">\
							<!--<span class="blue"></span>\
							<span class="green"></span>-->\
						</div>\
						<div class="card-detail-exerpt">'+card._getName()+'</div>\
						<div class="card-detail-flags">\
							'+cardFlagsHTML+'\
						</div>\
						<!--<div class="card-detail-members block right">\
							<span class="avatar left i-block"><img src="members/shidil.png" class="round"></span>\
						</div>-->\
					</div>';

	return node;

};
