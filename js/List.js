
/* @param data is an object
 * { name: "NAME", id: NUMBER, .... }
 */
function List(data) {
	// private
	var _name = data.name || "";
	var _cards = data.cards || [];
	var _closed = data.closed || false;
	var _id = data.id || 0;

	// public

	// privilaged
	this._getName = function() {
		return _name;
	}
	this._getCards = function() {
		return _lists;
	}
	this._getId = function() {
		return _id;
	}
	this._setClosed = function() {
		_closed = true;
	}
	this._isClosed = function() {
		return _closed;
	}
}

List.prototype.toJSON = function() {
	return {
		name: this._getName(),
		id: this._getId(),
		cards: this._getCards(),
		closed: this._isClosed()
	};
};

List.prototype.addCard = function(card) {
	card = card || null;
	return (card instanceof Card) ? this._getCards().push(card) : false;
};

/* Function to remove a card from a board.
 * @param item: This can be the card object itself or a number
 *   			representing index of _cards in array.
 * returns success.
 */
List.prototype.removeCard = function(item) {
	item = item || null;
	var cards = this._getCards();
	if (typeof item === "object" && item instanceof Card) {
		var index = cards.indexOf(item);
		// check if item exists and if remove and return nex length of array
		return (index >= 0) ? cards.splice(index,1).length : false;
	}
	else if (typeof item === "number") {
		return (item >= 0 && item < cards.length ) ?  cards.splice(item,1).length : false;
	}
	return false;
};

/* Returns the card object from _cards array if an object mathched the key
 * @param key: 1. key is a id of card.
 			   2. key is name of card.
 */
List.prototype.getCard = function(key) {
	key = key || null;
	var cards = this._getCards();
	if (typeof key === "number") {
		return cards[key];
	}
	else if (typeof key === "string") {
		for (var i = cards.length - 1; i >= 0; i--) {
			if (cards[i].name === key) return cards[i];
		};
	}
	console.log("Card.getList: Invalid key");
	return null;
};

/* Move s list to a new position
 * @param a: position of item 1
 * @param b: position of item 2
 */
List.prototype.swapCards= function(a, b) {
	var cards = this._getCards();
	// check upperbound and lowerbound of a and b.7
	if(typeof a === "number" && typeof b === "number" && a >= 0 && a < cards.length && b >= 0 && b < cards.length) {
		var temp = cards[a];
		cards[a] = cards[b];
		cards[b] = temp;
		return true;
	}
	console.log("Board.swapLists: Invalid input");
	return false;
};











/*List.prototype.createNode = function() {
	this.node = document.createElement("div");
	this.node.className = "list round";
	this.node.dataset.id = this.id;
	var listHead = document.createElement("div");
	listHead.className = "list-item list-head bold pointer";
	listHead.innerHTML = '<span class="title">Ideas</span> \
						<a class="right" id="list_actions_toggle"><span class="icon-download"></span></a>';
	this.node.appendChild(listHead);
	// generate cards
	var len = this.cards.length;
	for (var i = 0; i< len; i++) {
		this.cards[i].createNode();
		this.node.appendChild(this.cards[i].node);
	}
	// Add card button
	var listTail = document.createElement("div");
	listTail.className = "list-item clear pointer";
	listTail.id = "add_card";
	listTail.innerHTML = "Add card...";
	this.node.appendChild(listTail);
};*/
