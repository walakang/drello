/* This object controls the drag and drop interation of the nodes.
 * @author Shidil Eringa
 * @email shidil@qburst.com
 *
 * @param options: the object representing the user choises.
 *				   container: the HTML node that contains drag targets.
 *				   handle: the class name of the target elements.
 *				   also contains custom fuctions for events (called after default behaviour).
 */
function DragDrop(options) {
	this.container = options.container || null;
	this.handle = options.handle || null;
	this.dragClass = options.dragClass || null;
	this.start = options.start || null;
	this.drag = options.drag || null;
	this.end = options.end || null;
	this.drop = options.drop || null;

	this.startX = null;
	this.startY = null;
	this.mouseX = null;
	this.mouseY = null;
	this.initialMouseX = null;
	this.initialMouseY = null;
	this.draggedObject = null;
	this.success = false;
}
/* Called from outside. initalizes the drag and drop interation and binds events to the container
 */
DragDrop.prototype.init = function() {
	var self = this;
	// select DOM nodes
	var containers =  (this.container && typeof this.container === "string") ? document.querySelectorAll(this.container) : [];
	for (var i = containers.length - 1; i >= 0; i--) {
		containers[i].addEventListener("dragstart", function (e) {
			e = e|| window.event;
			self.dragStart(e);
		}, false);
		containers[i].addEventListener("drag", function (e) {
			e = e|| window.event;
			self.dragMouse(e);
		}, false);
		containers[i].addEventListener("drop", function (e) {
			e = e|| window.event;
			self.drop(e);
		}, false);
		containers[i].addEventListener("dragenter", function (e) {
			e = e|| window.event;
			self.dragEnter(e);
		});
		containers[i].addEventListener("dragover", function (e) {
			e = e|| window.event;
			self.dragOver(e);
		});
		containers[i].addEventListener("dragleave", function (e) {
			e = e|| window.event;
			self.dragLeave(e);
		});
		containers[i].addEventListener("dragend", function (e) {
			e = e|| window.event;
			self.dragEnd(e);
		}, false);
	};
};

/* Called on the dragstart event. This function initializes the drag start, stores initial positions, changes state of
 * the target, creates a dummy etc.
 * @param e: MouseEvent
 */
DragDrop.prototype.dragStart = function(e) {
	this.draggedObject = e.target;
	var obj = this.draggedObject;

	if (obj.classList.contains(this.handle)) {
		console.info("Starting drag");
		// manage dataTransfer
		var img = document.createElement("div");
		img.style.opacity = "0";
		e.dataTransfer.effectAllowed="copy";
		e.dataTransfer.setData('text',obj.dataset.id);
		e.dataTransfer.setDragImage(img,0,0);

		// Save mouse positions
		this.startX = obj.offsetLeft;;
		this.startY = obj.offsetTop;;
		this.initialMouseX = e.clientX;
		this.initialMouseY = e.clientY;
		this.mouseX = e.clientX;
		this.mouseY = e.clientY;

		// create a dummy
		/*var dummy = obj.cloneNode();
		var container = document.querySelector(this.container);
		dummy.style.height = getComputedStyle(obj).height;
		dummy.style.background = "rgba(0,0,0,0.1)";
		//obj.parentNode.replaceChild(dummy, obj);
		//container.appendChild(obj);*/
		this.dragClass && obj.classList.add(this.dragClass);	// position: absolute and cursor changes
		obj.style.position = "absolute";

		// call user defined start functtion
		this.start && this.start(e);
	}
};

/* Fired continuesly when the user drags the target element inside the container.
 * This function calculates a new positon for the dragged node according to the mouse position.
 * @param e: MouseEvent
 */
 DragDrop.prototype.dragMouse = function(e) {
 	var obj = this.draggedObject;
 	if (obj.classList.contains(this.handle)) {
 		console.info("Dragging...");

 		// Save mouse positions
		this.mouseX = e.clientX;
		this.mouseY = e.clientY;
		var dX = this.mouseX - this.initialMouseX;
		var dY = this.mouseY - this.initialMouseY;

		// change the position of the dragged element
		this.setPositon(dX, dY);

		// call user defined drag functtion
		this.drag && this.drag(e);
 	}
 };

/* Continuesly fired when mouse over drop location
 */
 DragDrop.prototype.dragOver = function(e) {
	if (e.preventDefault) {
  	  e.preventDefault();
	}
	e.dataTransfer.dropEffect = 'move';
	return false;
 };

DragDrop.prototype.dragEnter = function(e) {
 	if(e.target.classList.contains("card")) console.log(e.target);
 };

DragDrop.prototype.dragLeave = function(e) {
	//console.log(e.target);
}

/* Fired if the drag is a success.
 * @param e: MouseEvent
 */
 DragDrop.prototype.drop = function(e) {
 	var obj = this.draggedObject;
 	if (obj.classList.contains(this.handle)) {
		console.info("Drop object...");
		this.success = true;
		this.dragEnd();

		// call user defined drop functtion
		this.drop && this.drop(e);
 	}
 };


/* Revert the position of the element.
 */
 DragDrop.prototype.dragEnd = function(e) {
 	/*if (!this.success) */{
 		this.draggedObject.style.removeProperty("position");
 		this.draggedObject.style.removeProperty("top");
 		this.draggedObject.style.removeProperty("left");
 		this.dragClass && this.draggedObject.classList.remove(this.dragClass);

 		this.draggedObject = null;
 	}

 	// call user defined end functtion
	this.end && this.end(e);
 };

/* Sets the top and left of the dragged element
 * @param x: dx change in X position (integer)
 * @param y: dy change in Y position (integer)
 */
 DragDrop.prototype.setPositon = function(dx, dy) {
 	this.draggedObject.style.left = this.startX + dx + 'px';
 	this.draggedObject.style.top = this.startY + dy + 'px';
 };

 /* Releases all bound events */
 DragDrop.prototype.releaseEvents = function() {
 	// To DO.
 }
