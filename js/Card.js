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
	var _cover = data.cover || 0;
	var _colors = data.colors || [];
	var _closed = data.closed || false;

	// public

	// privilaged
	this._getName = function() {
		return _name;
	}
	this._setName = function(name) {
		_name = name;
	};
	this._getId = function() {
		return _id;
	}
	this._setId = function (id) {
		_id = id;
	}
	this._getColors = function() {
		return _colors;
	}
	this._getDesc = function() {
		return _desc;
	}
	this._setDesc = function(desc) {
		_desc = desc;
	};
	this._getAttachments = function() {
		return _attachments;
	}
	this._getCover = function () {
		return _cover;
	}
	this._setCover = function (id) {
		_cover = id;
	}
	this._isClosed = function() {
		return _closed;
	}
	this._close = function () {
		_closed = true;
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
		attachments: this._getAttachments() || [],
		cover: this._getCover(),
		closed: this._isClosed()
	};
};

Card.prototype.changeName = function(n) {
	if (typeof n ==="string") this._setName(n);
};

Card.prototype.archive = function() {
	this._close();
};

Card.prototype.restore = function(first_argument) {
	this._open();
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

Card.prototype.addAttachment = function(attach) {
	attach = attach || 0;
	if (typeof attach === "object") this._getAttachments().push(attach);
};

Card.prototype.removeAttachment = function(id) {
	if (typeof id === "number") return this._getAttachments().splice(id,1).length;
	return false;
};

Card.prototype.getCoverImage = function() {
	return this._getAttachments()[this._getCover()] || null;
};

Card.prototype.setCover = function(id) {
	if (typeof id === "number"){
		this._setCover(id);
		return true;
	}
	return false;
};

Card.prototype.setDesc = function(desc) {
	if (typeof desc === "string") this._setDesc(desc);
};

/*
Card.prototype.createNode = function() {
	this.node = document.createElement("div");
	this.node.className = "list-item card round pointer";
	this.node.onclick = "showCardPopupToggle(event)";
	this.node.innerHTML = this.name;

};*/