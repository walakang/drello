function ListController(){
	// private
	var _listNodes = [];

	//public
	this.listClassName = "list round";
	this.containerId = "board_content";

	// privilaged
	this._getListNodes = function() {
		return _listNodes;
	};
}

/* Call to populate the list container with the nodes created
 * from the list array parsed from localstorage.
 */
ListController.prototype.populateLists = function(board) {
	// Refresh data
	boardController.loadEverything();

	var lists = board._getLists();
	var listNodes = this._getListNodes();
	var container = document.getElementById(this.containerId);
	var node = null;
	// Add new list as the second last children of the list.
	var addListNode = container.removeChild(container.children[container.children.length-1]);
	// remove all existing childs in container
	container.innerHTML = "";
	listNodes.length = 0;
	// Create nodes for every board in drello and store them in _boardNodes[] then append to container.
	for (i = 0, len = lists.length; i < len; i++) {
		// exclude closed lists
		if(lists[i]._isClosed()) continue;
		node = this.createListNode(lists[i]);
		if (node !== null) {
			listNodes.push(node);
			container.appendChild(node);
		}
	}
	var emptyList = document.createElement("div");
	emptyList.className="list";
	emptyList.style.height = "200px";
	emptyList.style.minWidth = "20px";
	emptyList.style.background = "transparent";
	container.appendChild(emptyList);
	container.appendChild(addListNode);

};
/* Called to create a DOM Node object from list object
 * @param board: the instance of List.
 * Template:
 *
 */
ListController.prototype.createListNode = function(list) {

	list = list || null;
	if(!(list instanceof List)) return null;
	console.log("creating list node");
	var node = document.createElement("li");
	var listHead = document.createElement("div");
	var listTail = document.createElement("div");
	var listBody = document.createElement("ul");
	var cardController = new CardController();

	node.className = this.listClassName;
	node.dataset.id = list._getId();
	node.draggable = "true";

	listHead.className = "list-item list-head bold pointer";
	listHead.innerHTML = '<span class="title">'+list._getName()+'</span>\
						  <a onclick="showListActionsPopop(event)" class="right icon-download" id="list_actions_toggle " data-list="'+list._getId()+'"></a>';
	node.appendChild(listHead);

	listBody.className = "list-body y-scroll width-100";
	// generate cards
	var len = list._getCards().length;
	for (var i = 0; i< len; i++) {
		// Exclude closed/archived cards
		if(list._getCards()[i]._isClosed()) continue;
		var cardNode = cardController.createCardNode(list._getCards()[i]);
		cardNode.dataset.list = list._getId();
		listBody.appendChild(cardNode);
	}
	var emptyCard = document.createElement("div");
	emptyCard.className="card";
	emptyCard.style.height = "10px";
	emptyCard.style.background = "transparent";
	listBody.appendChild(emptyCard);
	node.appendChild(listBody);
	// Add card button
	listTail.className = "list-item clear pointer";
	listTail.id = "add_card";
	listTail.innerHTML = '<div id="add_card_link" class="add-card-placeholder round noselect" onclick="toggleAddCardForm(event)">Add a card...</div>\
							<form onsubmit="createCard(event)" data-id="'+list._getId()+'" method="POST" action="main.html" class="add-list-form round no-display" id="add_card_form">\
								<input  type="text" id="add_card_form_input" required class="block-input width-100 round block" name="list-name" autofocus="true" autocomplete="off"/>\
								<span type="hidden" class="block break-1" ></span>\
								<input type="submit" class="btn btn-normal btn-green" value="Save" />\
								<span class="icon-cancel middle pointer" id="add_card_form_close" onclick="toggleAddCardForm(event)"></span>\
							</form>';
	node.appendChild(listTail);

	return node;
};
