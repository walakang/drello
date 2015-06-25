function ListController(){
	// private
	var _listNodes = [];

	//public
	this.listClassName = "list round";
	this.containerId = "board_content";

	// privilaged
	this._getListNodes = function() {
		return _listNodes;
	}
}

/* Call to populate the list container with the nodes created
 * from the list array parsed from localstorage.
 */
ListController.prototype.populateLists = function(board) {
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
		node = this.createListNode(lists[i]);
		if (node != null) {
			listNodes.push(node);
			container.appendChild(node);
		}
	};
	container.appendChild(addListNode);

};
/* Called to create a DOM Node object from list object
 * @param board: the instance of List.
 * Template: 
 *			
 */
ListController.prototype.createListNode = function(list) {

	list = list || null;
	if(!(list instanceof List)) return null;;
	console.log("creating list node");
	var node = document.createElement("div");
	var listHead = document.createElement("div");
	var listTail = document.createElement("div");
	var cardController = new CardController();

	node.className = this.listClassName;
	node.dataset.id = list._getId();

	listHead.className = "list-item list-head bold pointer";
	listHead.innerHTML = '<span class="title">'+list._getName()+'</span> \
						  <a class="right icon-download" id="list_actions_toggle " data-id="'+list._getId()+'"></a>';
	node.appendChild(listHead);

	// generate cards
	var len = list._getCards().length;
	for (var i = 0; i< len; i++) {
		var cardNode = cardController.createCardNode(list._getCards()[i]);
		node.appendChild(cardNode);
	}
	
	// Add card button
	listTail.className = "list-item clear pointer";
	listTail.id = "add_card";
	listTail.innerHTML = '<div id="add_card_link" class="add-card-placeholder round noselect" onclick="toggleAddCardForm(event)">Add a card...</div>\
							<form onsubmit="createCard(event)" data-id="'+list._getId()+'" method="POST" action="main.html" class="add-list-form round no-display" id="add_card_form">\
								<input onblur="toggleAddCardForm(event)" type="text" id="add_card_form_input" class="block-input width-100 round block" name="list-name" autofocus="true" autocomplete="off"/>\
								<span type="hidden" class="block break-1" ></span>\
								<input type="submit" class="btn btn-normal btn-green" value="Save" />\
								<span class="icon-cancel middle pointer" id="add_card_form_close"></span>\
							</form>';
	node.appendChild(listTail);

	return node;
}
