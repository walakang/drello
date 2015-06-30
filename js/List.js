
/* @param data is an object
 * { name: "NAME", id: NUMBER, .... }
 */
function List(data) {
	// private
	var _name = data.name || "";
	var _cards = [];
	var _closed = data.closed || false;
	var _id = data.id || 0;

	// public

	// privilaged
	this._getName = function() {
		return _name;
	}
	this._getCards = function() {
		return _cards;
	}
	this._getId = function() {
		return _id;
	}
	this._close = function() {
		_closed = true;
	}
	this._open = function() {
		_closed = false;
	}
	this._isClosed = function() {
		return _closed;
	}

	// data.cards parsed should be converted to instances of Card objects.
	var len = (typeof data.cards != "undefined") ? data.cards.length : 0;
	for (var i = 0; i< len; i++) {
		//data.cards[i].id = this.getNextCardId();
		_cards.push(new Card(data.cards[i]));
	};
}

List.prototype.toJSON = function() {
	return {
		name: this._getName() || [],
		id: this._getId(),
		cards: this._getCards() || [],
		closed: this._isClosed()
	};
};

List.prototype.addCard = function(card) {
	card = card || null;
	return (card instanceof Card) ? this._getCards().push(card) : false;
};

List.prototype.getNextCardId = function() {
	if (this._getCards().length != null)
		return this._getCards().length;
	return 0;
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
		return (index >= 0) ? this._getCards().splice(index,1).length : false;
	}
	else if (typeof item === "number") {
		return (item >= 0 && item < cards.length ) ?  this._getCards().splice(item,1).length : false;
	}
	return false;
};

/* Returns the card object from _cards array if an object mathched the key
 * @param key: 1. key is a id of card.
 			   2. key is name of card.
 */
List.prototype.getCard = function(key) {
	var cards = this._getCards();
if (typeof key === 'number') {
		for (var i = cards.length - 1; i >= 0; i--) {
			if (cards[i]._getId() == key) return cards[i];
		};
	}
	else if (typeof key === "string") {
		for (var i = cards.length - 1; i >= 0; i--) {
			if (cards[i].name === key) return cards[i];
		};
	}
	console.log("Card.getList: Invalid key");
	return null;
};

/* Move a list to a new position
 * @param a: position of item 1
 * @param b: position of item 2
 */
List.prototype.moveCard= function(current, next) {
	var cards = this._getCards();
	if(current === next) return;
	// check upperbound and lowerbound of a and b.7
	if(typeof current === "number" && typeof next === "number" && current >= 0 && current < cards.length && next >= 0 && next < cards.length) {
		cards.splice(current, 0, cards.splice(next, 1)[0] );
		return true;
	}
	console.log("List.MoveCard: Invalid input");
	return false;
};