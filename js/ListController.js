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
ListController.prototype.populateLists = function(items) {
	var list = this._getListNodes();
	var container = document.getElementById(this.containerId);
	var node = null;
	// remove all existing childs in container
	container.innerHTML = "";
	// Create nodes for every board in drello and store them in _boardNodes[] then append to container.
	for (var i = 0; i < items.length; i++) {
		node = this.createListNode(items[i]);
		if (node != null) {
			list.push(node);
			container.appendChild(node);
		}
	};

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
	node.dataset.id = this.id;

	listHead.className = "list-item list-head bold pointer";
	listHead.innerHTML = '<span class="title">Ideas</span> \
						<a class="right" id="list_actions_toggle"><span class="icon-download"></span></a>';
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
	listTail.innerHTML = "Add card...";
	node.appendChild(listTail);

	return node;
}
