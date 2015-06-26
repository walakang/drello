/* @param data is an object
 * { name: "NAME", id: NUMBER, .... }
 */
function Card(data) {
	// private
	var _name = data.name || "";
	//var _closed = data.closed || false;
	var _id = data.id || 0;
	var _desc = data.desc || "";
	var _attachments = data.attachments || [];
	var _colors = data.colors || [];
	var _closed = data.closed || false;

	// public

	// privilaged
	this._getName = function() {
		return _name;
	}
	this._getId = function() {
		return _id;
	}
	this._getColors = function() {
		return _colors;
	}
	this._getDesc = function() {
		return _desc;
	}
	this._getAttachments = function() {
		return _attachments;
	};
	this._isClosed = function() {
		return _closed;
	}
	this._close = function () {
		_close = true;
	}
	this._open = function() {
		_closed = false;
	}
}

Card.prototype.toJSON = function() {
	return {
		name: this._getName(),
		id: this._getId(),
		desc: this._getDesc(),
		colors: this._getColors() || [],
		attachments: this._getAttachments() || []
	};
};

Card.prototype.addColor = function(color) {
	return (typeof color === "string") ? this._getColors().push(color) : false;
};

/* Remove a color item from the array.
 * returns integer > 0 if success or
 * returns false if unsuccessfull.
 */
Card.prototype.removeColor = function(color) {
	var i = this._getColors().indexOf(color);
	return (typeof color === "string" && i > -1) ? this._getColors().splice(i,1).length : false;
};





/*
Card.prototype.createNode = function() {
	this.node = document.createElement("div");
	this.node.className = "list-item card round pointer";
	this.node.onclick = "showCardPopupToggle(event)";
	this.node.innerHTML = this.name;

};*/