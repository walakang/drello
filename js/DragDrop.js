/* This object controls the drag and drop interation of the nodes.
 * @author Shidil Eringa
 * @email shidil@qburst.com
 *
 * @param {options} the object representing the user choises.
 *				    container: the HTML node that contains drag targets.
 *				    handle: the class name of the target elements.
 *   			    target: the class name of drop target.
 *				    also contains custom fuctions for events (called after default behaviour).
 */
function DragDrop(options) {

	this.container = options.container || null;
	this.handle = options.handle || null;	// class of elements which are draggable
	this.dropZone = options.dropZone || null;
	this.dragClass = options.dragClass || null;	// CSS class to be applied to the target when dragging it.

	// callback functions (Will be called if not NULL).
	this.start = options.start || null;
	this.drag = options.drag || null;
	this.end = options.end || null;
	this.drop = options.drop || null;
	this.hover = options.hover || null;

	// Initial position (offset) of dragged element.
	this.startX = null;
	this.startY = null;

	// Mouse positions
	this.mouseX = null;
	this.mouseY = null;
	this.initialMouseX = null;
	this.initialMouseY = null;

	// The drag target.
	this.draggedObject = null;
	this.placeholder = null;
	this.dragging = false;
	this.touchedHandle = false;
	this.dragGhost = null;

	// Custom data object.
	this.dataTransfer = {};

}
/* Called from outside. initalizes the drag and drop interation and binds events to the container
 */
DragDrop.prototype.init = function() {
	var self = this;
	var i;
	// Attach events to handle
	var handles =  (this.handle && typeof this.handle === "string") ? document.querySelectorAll("."+this.handle) : [];
	for (i = handles.length - 1; i >= 0; i--) {
		handles[i].addEventListener("dragstart", function (e) {
			e = e|| window.event;
			self.dragStart(e);
		}, false);
		handles[i].addEventListener("dragend", function (e) {
			e = e|| window.event;
			self.dragEnd(e);
		}, false);

		// Attach touch events for support of touch devices.
		handles[i].addEventListener("touchstart", function (e) {
			e = e|| window.event;
			self.touchStart(e);
		}, false);
		handles[i].addEventListener("touchmove", function (e) {
			e = e|| window.event;
			self.touchMove(e);
		}, false);
		handles[i].addEventListener("touchend", function (e) {
			e = e|| window.event;
			self.touchEnd(e);
		}, false);
	}

	// attach events to dropZone
	var dropZones = (this.dropZone && typeof this.dropZone === "string") ? document.querySelectorAll(this.dropZone) : [];
	for (i = dropZones.length - 1; i >= 0; i--) {
		dropZones[i].addEventListener("dragenter", function (e) {
			e = e|| window.event;
			self.dragEnter(e,this);
		});
		dropZones[i].addEventListener("dragover", function (e) {
			e = e|| window.event;
			self.dragOver(e,this);
		});
		dropZones[i].addEventListener("dragleave", function (e) {
			e = e|| window.event;
			self.dragLeave(e,this);
		});
		dropZones[i].addEventListener("drop", function (e) {
			e = e|| window.event;
			self.dropItem(e, this);
		}, false);
	}

	var container = (this.container && typeof this.container === "string") ? document.querySelector(this.container) : null;
	if (container) {
		// attach dragover event to container to get mouse position : FF fix
		container.addEventListener("dragover", function (e) {
			e = e|| window.event;
			self.dragMouseOverContainer(e, this);
		});
	}

	// create a blank ghost image
	this.dragGhost = document.createElement("img");
	this.dragGhost.src = "images/blank.png";
	this.dragGhost.width = 100;
};

/* Called on the dragstart event. This function initializes the drag start, stores initial positions, changes state of
 * the target, creates a dummy etc.
 * @param e: MouseEvent
 */
DragDrop.prototype.dragStart = function(e) {
	var obj = this.draggedObject = e.target;

	if (obj.classList.contains(this.handle)) {
		console.info("Starting drag");
		this.dragging = true;

		// Firefox requires this to be set or the drag won't work.
		e.dataTransfer.setData('text/plain',null);

		// set the drag visual clue ghost image as a blank image
		e.dataTransfer.effectAllowed="move";
		e.dataTransfer.setDragImage(this.dragGhost,0,0);

		// Save initial mouse positions.
		this.startX = obj.offsetLeft;
		this.startY = obj.offsetTop;
		this.initialMouseX = e.clientX;
		this.initialMouseY = e.clientY;

		// update current mouse position.
		this.setMousePosition(e.clientX, e.clientY);

		//create a placeholder.
		this.createPlaceholder(obj);

		// create a mask overlay over all draggable elements of type this.handle.
		this.maskAllHandles();

		// Add style to the dragged element.
		this.dragClass && obj.classList.add(this.dragClass);	// position: absolute and cursor changes.
		obj.style.position = "absolute";

		// call user defined callback functtion.
		this.start && this.start(e);
	}
};

DragDrop.prototype.touchStart = function(e) {
	e.stopPropagation();
	if (e.currentTarget.classList.contains(this.handle)) {
		this.touchedHandle = true;
	}
};

DragDrop.prototype.touchMove = function(e) {
	e.preventDefault();
	e.stopPropagation();
	var obj = this.draggedObject = e.currentTarget;
	var touch = e.changedTouches[0];
	var dropZone = null;
	var mask = null;

	if (this.touchedHandle && e.currentTarget.classList.contains(this.handle)) {

		// wait to fire drag events.
		this.touchedHandle = false;

		// Save mouse positions.
		this.startX = obj.offsetLeft;
		this.startY = obj.offsetTop;
		this.initialMouseX = touch.pageX;
		this.initialMouseY = touch.pageY;

		// update current mouse position.
		this.setMousePosition(touch.pageX, touch.pageY);
		console.info("Starting touch drag of "+this.handle);
		this.dragging = true;

		//create a placeholder
		this.createPlaceholder(obj);

		// create a mask overlay over all draggable elements of type this.handle.
		this.maskAllHandles();

		// Add style to the dragged element.
		this.dragClass && obj.classList.add(this.dragClass);	// position: absolute and cursor changes.
		obj.style.position = "absolute";

		// call user defined callback functtion.
		this.start && this.start(e);
	}

 	if (!this.dragging) return false;	// Don't mess with positions if drag not active.

	obj.style.pointerEvents = "none";

	// update current mouse position.
	this.setMousePosition(touch.pageX, touch.pageY);

	// Calculate new position of the object and set it (relative).
	this.updateHandlePositon();

	mask = document.elementFromPoint(touch.pageX,touch.pageY);

	// Re-arrange items in dropZone to make placeholder at current mouse position
	if(mask && mask.classList.contains("drag-mask")) {
		dropZone = mask.parentNode.parentNode; // mask is the child of handle, and we want container of handle :)

		// Compute new position for position of placeholder
		dropZone.insertBefore(this.placeholder, mask.parentNode);

		// Compute the index position of the placeholder in it's new parentNode.
		var index = Array.prototype.indexOf.call(dropZone.children, this.placeholder);
		this.dataTransfer.dropPosition = index;

		// Call user defined callback functtion.
		this.hover && this.hover(e, dropZone);
	}

	// checkn if we need to scroll the view when the handle is on the edge of the screen
	var container = (this.container && typeof this.container === "string") ? document.querySelector(this.container) : null;
	if (container) {
		var rightEdge = container.clientWidth;
		var scrollLeft = container.scrollLeft;
		var scrollWidth = container.scrollWidth;
		var handleRight = this.draggedObject.getBoundingClientRect().right;
		var handleLeft = this.draggedObject.getBoundingClientRect().left;
		var displacement =  handleRight- scrollLeft;

		// First we need to check the direction of the drag (left/right).
		// Then scroll the container to the right if needed.
		if (this.initialMouseX < this.mouseX) { // going right

			// displacement >= rightEdge means handle is on edge of the container clientRect
			// We don't need to scroll further if the scrollLeft exceeds scrollWidth
			container.scrollLeft = (displacement >= rightEdge-50) ? ((scrollLeft+10 < (scrollWidth - rightEdge)) ? scrollLeft+10 : scrollLeft) : scrollLeft;
		}
		else if (this.initialMouseX > this.mouseX) {
			container.scrollLeft = (handleLeft < scrollLeft) ? scrollLeft-10 : scrollLeft;
		}
	}

	// Call user defined callback functtion.
	this.drag && this.drag(e);
};

DragDrop.prototype.touchEnd = function(e) {
	//e.preventDefault();
	e.stopPropagation();

	var touch = e.changedTouches[0];
	var zone = document.elementFromPoint(touch.pageX,touch.pageY);

	// Check if going to drop item
	if(zone && (zone.classList.contains(this.dropZone.slice(1)) || zone.id === this.dropZone.slice(1))) // dropping on dropZone
		this.dropItem(e);	// successfull drop.
	else this.dragEnd(e);	// failed to drop.
};

/* Fired continuesly when the user drags the target element inside the container.
 * This function calculates a new positon for the dragged node according to the mouse position.
 * @param e: MouseEvent
 */
 DragDrop.prototype.dragMouseOverContainer = function(e, target) {
 	if (e.preventDefault) {
  	  e.preventDefault();
	}
 	if (!this.dragging) return false;
 	var obj = this.draggedObject;
 	if (obj.classList.contains(this.handle)) {
 		console.info("Dragging...");

		obj.style.pointerEvents = "none";

		// Update current mouse position.
		this.setMousePosition(e.clientX, e.clientY);

		// Calculate new position of the object and set it (relative).
		this.updateHandlePositon();

		// Call user defined callback functtion.
		this.drag && this.drag(e);
 	}
 };

/* Continuesly fired when mouse over drop location
 */
 DragDrop.prototype.dragOver = function(e, target) {
	if (e.preventDefault) {
  	  e.preventDefault();
	}
	e.dataTransfer.dropEffect = 'move';

	if (!this.dragging) return false;

	// Re-arrange items in dropZone to make placeholder at current mouse position
	if(e.target.classList.contains("drag-mask")) {
		var mask = e.target;

		// Compute new position for position of placeholder
		target.insertBefore(this.placeholder, mask.parentNode);

		// Compute the index position of the placeholder in it's new parentNode.
		var index = Array.prototype.indexOf.call(target.children, this.placeholder);
		this.dataTransfer.dropPosition = index;
	}

	this.hover && this.hover(e, target);

	return false;
 };

DragDrop.prototype.dragEnter = function(e, target) {
	if (!this.dragging) return false;
}
DragDrop.prototype.dragLeave = function(e, target) {
	if (!this.dragging) return false;
}

/* Fired if the drag is a success.
 * @param e: MouseEvent
 */
 DragDrop.prototype.dropItem = function(e, target) {
	if (e.stopPropagation) {
		e.preventDefault();
		e.stopPropagation(); // stops the browser from redirecting.
	}
	if (!this.dragging) return false;
 	var obj = this.draggedObject;
 	if (obj.classList.contains(this.handle)) {
		console.info("Drop object...");
		this.dragEnd(e);
		this.dragging = false;

		// call user defined drop functtion
		this.drop && this.drop(e);
 	}
 };


/* Called when cancelled a drag operation
 */
 DragDrop.prototype.dragEnd = function(e) {
 	if (!this.dragging) return false;

	this.draggedObject.style.removeProperty("position");
	this.draggedObject.style.removeProperty("top");
	this.draggedObject.style.removeProperty("left");
	this.draggedObject.style.pointerEvents = "all";
	this.dragClass && this.draggedObject.classList.remove(this.dragClass);

	// remove placeholder
	this.placeholder.parentNode.removeChild(this.placeholder);

	// remove all masks
	this.removeAllMasks();

	this.dragging = false;

 	// call user defined callback functtion
	this.end && this.end(e);
 };

/* This function creates a placeholder element from the given element and appends to its parent.
 * A place holder is a visual clue for the dragged element positon.
 * @param {obj} the object whose placeholder is to be created.
 */
DragDrop.prototype.createPlaceholder = function(obj) {
	this.placeholder = obj.cloneNode();
	this.placeholder.classList.add("drag-placeholder")
	this.placeholder.style.height = getComputedStyle(obj).height;
	this.placeholder.style.background = "rgba(0,0,0,0.1)";
	this.placeholder.style.pointerEvents = "none";

	// Insert the placeholder after the dragged element in it's parent
	obj.parentNode.insertBefore(this.placeholder, obj.nextSibling);
};

DragDrop.prototype.maskAllHandles = function() {
	// Make a mask in all items of the handle class
	var mask = document.createElement("div");
	mask.className = "drag-mask absolute-center";
	var handles =  (this.handle && typeof this.handle === "string") ? document.querySelectorAll("."+this.handle) : [];
	for (var i = handles.length - 1; i >= 0; i--){
		handles[i].appendChild(mask.cloneNode(true));
	}
};

DragDrop.prototype.removeAllMasks = function() {
	// loop throgh all masks an detach from their parent.
	var masks = document.querySelectorAll(".drag-mask");
	for (var i = masks.length - 1; i >= 0; i--) {
		masks[i].parentNode.removeChild(masks[i]);
	};
};

/* Update the current mouse position
 * @param {x} Mouse x co-ordinate
 * @param {y} Mouse y co-ordinate
 */
DragDrop.prototype.setMousePosition = function(x, y) {
	this.mouseX = x;
	this.mouseY = y;
};

/* Sets the top and left of the dragged element
 * @param x: dx change in X position (integer)
 * @param y: dy change in Y position (integer)
 */
 DragDrop.prototype.updateHandlePositon = function() {
 	if (!this.dragging) return false;

 	// Calculate the change in position.
 	var dx = this.mouseX - this.initialMouseX;
	var dy = this.mouseY - this.initialMouseY;
 	this.draggedObject.style.left = this.startX + dx + 'px';
 	this.draggedObject.style.top = this.startY + dy + 'px';
 };

 DragDrop.prototype.getHandlePosition = function() {
 	if (!this.dragging) return null;
 	return {
 		left: this.draggedObject.style.left,
 		top: this.draggedObject.style.top
 	}
 };

 /* Releases all bound events */
 DragDrop.prototype.releaseEvents = function() {
	// select DOM nodes
	var handles =  (this.handle && typeof this.handle === "string") ? document.querySelectorAll("."+this.handle) : [];
	for (var i = handles.length - 1; i >= 0; i--) {
		handles[i].parentNode.replaceChild(handles[i].cloneNode(true), handles[i]);
	};

	var dropZones = (this.dropZone && typeof this.dropZone === "string") ? document.querySelectorAll(this.dropZone) : [];
	for (var i = dropZones.length - 1; i >= 0; i--) {
		dropZones[i].parentNode.replaceChild(dropZones[i].cloneNode(true), dropZones[i]);
	};
 }





function DragManager() {
	this.items = [];
}
DragManager.prototype.addDrag = function(drag) {
	this.items.push(drag);

	// this will bind drag events to container.
	drag.init();
};
DragManager.prototype.clearAll = function(first_argument) {
	/*for (var i = this.items.length - 1; i >= 0; i--) {
		this.items[i].releaseEvents();
	};*/
	this.items = [];
};