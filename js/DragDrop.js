/* This object controls the drag and drop interation of the nodes.
 * @author Shidil Eringa
 * @email shidil@qburst.com
 *
 * @param options: the object representing the user choises.
 *				   container: the HTML node that contains drag targets.
 *				   handle: the class name of the target elements.
 *   			   target: the class name of drop target.
 *				   also contains custom fuctions for events (called after default behaviour).
 */
function DragDrop(options) {
	this.container = options.container || null;
	this.handle = options.handle || null;
	this.dropZone = options.dropZone || null;
	this.dragClass = options.dragClass || null;
	this.start = options.start || null;
	this.drag = options.drag || null;
	this.end = options.end || null;
	this.drop = options.drop || null;
	this.hover = options.hover || null;

	this.startX = null;
	this.startY = null;
	this.mouseX = null;
	this.mouseY = null;
	this.initialMouseX = null;
	this.initialMouseY = null;
	this.draggedObject = null;
	this.placeholder = null;
	this.success = false;
	this.dragging = false;
	this.dataTransfer = {};
	this.dragGhost = null;
}
/* Called from outside. initalizes the drag and drop interation and binds events to the container
 */
DragDrop.prototype.init = function() {
	var self = this;
	// select DOM nodes
	var handles =  (this.handle && typeof this.handle === "string") ? document.querySelectorAll("."+this.handle) : [];
	for (var i = handles.length - 1; i >= 0; i--) {
		handles[i].addEventListener("dragstart", function (e) {
			e = e|| window.event;
			self.dragStart(e);
		}, false);
		handles[i].addEventListener("dragend", function (e) {
			e = e|| window.event;
			self.dragEnd(e);
		}, false);
	};

	var dropZones = (this.dropZone && typeof this.dropZone === "string") ? document.querySelectorAll(this.dropZone) : [];
	for (var i = dropZones.length - 1; i >= 0; i--) {
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
	};

	var container = (this.container && typeof this.container === "string") ? document.querySelector(this.container) : null;
	if (container) {
		// attach dragover event to container to get mouse position : FF fix
		container.addEventListener("dragover", function (e) {
			e = e|| window.event;
			self.dragMouseOverContainer(e, this);
		})
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
	e.dataTransfer.setData('text/plain',null)
	this.draggedObject = e.target;
	var obj = this.draggedObject;

	if (obj.classList.contains(this.handle)) {
		console.info("Starting drag");
		this.dragging = true;
		// manage dataTransfer

		e.dataTransfer.effectAllowed="move";
		e.dataTransfer.setDragImage(this.dragGhost,0,0);

		// Save mouse positions
		this.startX = obj.offsetLeft;;
		this.startY = obj.offsetTop;;
		this.initialMouseX = e.clientX;
		this.initialMouseY = e.clientY;
		this.mouseX = e.clientX;
		this.mouseY = e.clientY;

		//create a placeholder
		this.placeholder = obj.cloneNode();
		var container = obj.parentNode;
		this.placeholder.classList.add("drag-placeholder")
		this.placeholder.style.height = getComputedStyle(obj).height;
		this.placeholder.style.background = "rgba(0,0,0,0.1)";
		this.placeholder.style.pointerEvents = "none";
		// Insert the placeholder after the dragged element in it's parent
		container.insertBefore(this.placeholder, obj.nextSibling);

		// Make a mask in all items of the handle class
		var mask = document.createElement("div");
		mask.className = "drag-mask absolute-center";
		var handles =  (this.handle && typeof this.handle === "string") ? document.querySelectorAll("."+this.handle) : [];
		for (var i = handles.length - 1; i >= 0; i--){
			var mask1 = mask.cloneNode(true);
			mask1.id = i;
			handles[i].appendChild(mask1);
		}

		// Add style
		this.dragClass && obj.classList.add(this.dragClass);	// position: absolute and cursor changes
		obj.style.position = "absolute";

		// call user defined start functtion
		this.start && this.start(e, this.dataTransfer);
	}
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

 		// Save mouse positions
 		console.log(e);
		this.mouseX = e.clientX;
		this.mouseY = e.clientY;
		var dX = this.mouseX - this.initialMouseX;
		var dY = this.mouseY - this.initialMouseY;
		obj.style.pointerEvents = "none";
		// change the position of the dragged element
		console.log(dX, dY);
		this.setPositon(dX, dY);

		// call user defined drag functtion
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
		target.insertBefore(this.placeholder, e.target.parentNode);
		var i, nodes = target.children, len = nodes.length, arr = [];
		// convert nodelist to array
		for (i = 0; i< nodes.length; i++) {
			arr.push(nodes[i]);
		};
		this.dataTransfer.dropPosition = arr.indexOf(this.placeholder);
	}

	this.hover && this.hover(e,target, this.dataTransfer);
	
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
		this.success = true;
		this.dragEnd(e);
		e.dropZone = target.parentNode;

		this.dragging = false;
		// call user defined drop functtion
		this.drop && this.drop(e,target, this.dataTransfer);
 	}
 };


/* Revert the position of the element.
 */
 DragDrop.prototype.dragEnd = function(e) {
 	if (!this.dragging) return false;

	this.draggedObject.style.removeProperty("position");
	this.draggedObject.style.removeProperty("top");
	this.draggedObject.style.removeProperty("left");
	this.draggedObject.style.pointerEvents = "all";
	this.dragClass && this.draggedObject.classList.remove(this.dragClass);

	// remove all placeholders and masks
	var placeholders = document.querySelectorAll(".drag-placeholder");
	var masks = document.querySelectorAll(".drag-mask");
	for (var i = placeholders.length - 1; i >= 0; i--) {
		placeholders[i].parentNode.removeChild(placeholders[i]);
	};
	for (var i = masks.length - 1; i >= 0; i--) {
		masks[i].parentNode.removeChild(masks[i]);
	};
	this.dragging = false;
	//this.draggedObject = null;
 	// call user defined end functtion
	this.end && this.end(e);
 };

/* Sets the top and left of the dragged element
 * @param x: dx change in X position (integer)
 * @param y: dy change in Y position (integer)
 */
 DragDrop.prototype.setPositon = function(dx, dy) {
 	if (!this.dragging) return false;
 	this.draggedObject.style.left = this.startX + dx + 'px';
 	this.draggedObject.style.top = this.startY + dy + 'px';
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