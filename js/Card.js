function Card(name){

	this.name = name;
	this.id = null;
	this.description = null;
	this.attachments = [];
	this.colors = [];
	this.node = null;
	this.image = null;

}

/* @param data is an object
 * { name: "NAME", id: NUMBER, .... }
 */
function List(data) {
	// private
	var _name = data.name || null;
	var _closed = data.closed || false;
	var _id = data.id || 0;
	var _desc = data.desc || null;
	var _attachments = data.attachments || [];
	var _colors = data.colors || [];

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
/*
Card.prototype.createNode = function() {
	this.node = document.createElement("div");
	this.node.className = "list-item card round pointer";
	this.node.onclick = "showCardPopupToggle(event)";
	this.node.innerHTML = this.name;

};*/