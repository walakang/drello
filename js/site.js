// This object holds the core methods and properties.
var drello = new Drello();

/* Populate DOM form the data stored in localStorage */
drello.fromLocalStorage();
//drello.populateBoards();

// The __currentPopup variable holds the node of the pop-up displayed currently. 
var __currentPopup = null;

/* Call to show any popup box
 * @param name: ID of the popup box node.
 * @param position: position of the popup box - not required.
 */
function showPopup(name,position){
	position = position || undefined;
	var popup = document.getElementById(name);
	if(typeof(position) ==='object'){
		popup.style.left = position.left+"px";
		popup.style.top = (position.top-80)+"px";
		//popup.style.bottom = (document.body.getBoundingClientRect().height-(position.bottom+100)+"px");
	}

	if(__currentPopup!=null){
		__currentPopup.classList.add("no-display");
		__currentPopup = null;
	}
	popup.classList.remove("no-display");
	__currentPopup = popup;

	// Bind an event to document.body for closing the popup when clicked outside the popup
	document.body.addEventListener("click",closePopups,false);
}

/* Call to close all displayed popup boxes.
 * this function will exit immediately if clicked inside the popup itself for safety.
 * @param forceClose: boolean parameter to force closing of any popups.
 */
function closePopups(e, forceClose){
	forceClose = forceClose || false;
	if(!__currentPopup) return;
	
	// check if clicked inside a pop-up box. pop-up should not be closed if clicked inside it self.
	if(!forceClose && ( __currentPopup.isEqualNode(e.target) || __currentPopup.contains(e.target) )){
		console.log("clicked inside pop-up container or its child");
		return true;
	}
	if(__currentPopup!=null){
		console.log("closing all pop-ups");
		__currentPopup.classList.add("no-display");
		__currentPopup = null;
	}
	document.getElementById("overlay").classList.remove("visible");

	// remove event listner attached to body
	document.body.removeEventListener("click",closePopups,false);
	return true;
}
// TO DO: use addEventListner
function showCreateBoardPopup(e){
	// Prevent event propogation.
	e = e || window.event
	e.stopPropagation();
	// get the position of event target to calculate the position of the pop-up 
	showPopup("create_board_popup",e.target.getBoundingClientRect());

	return false;
}
function showBoardsPopup(e){
	// Prevent event propogation.
	e = e || window.event
	e.stopPropagation();
	console.log("showing boards pop-up");
	showPopup("boards_popup");

	return false;
}
function showProfilePopup(e){
	// Prevent event propogation.
	e = e || window.event
	e.stopPropagation();
	showPopup("profile_popup");
	return false;
}
function showCreateNewPopup(e){
	// Prevent event propogation.
	e = e || window.event
	e.stopPropagation();
	showPopup("create_new_popup");

	return false;
}
function showCardPopup(e){
	/* the default behaviour of click on content is to hide the pop-ups 
	 * We need to override that.
	*/
	e = e || window.event
	e.stopPropagation();
	showOverlay();
	showPopup('card_display_popup',null);
	return false;
}

function showOverlay(noBg){
	document.getElementById("overlay").classList.add("visible");
}


function hideToggle(node){
	if(node.classList.contains("show")){
		node.classList.remove("show");
	}
	else{
		node.classList.add("show");
	}
}

function SidebarToggle(){
	var menu = document.getElementById("board_menu");
	hideToggle(menu);
	return;
}
function SidebarMenuToggle(){
	var menu = document.querySelectorAll("#board_menu ul")[0];
	hideToggle(menu);
	return;
}

/* calls when a user submit the create board form create a new Board and put it to
 * boards list of drello object and then save to  local storage.
 */
function createBoard(event) {
	var __form = event.target;
	var __name = __form.getElementsByTagName("input")[0].value;
	// Create a new Board node and add to DOM
	var board = new Board({name: __name, id: drello.getNextBoardId() });
	board.createNode();
	board.selfAppend();
	// Save the node to local storage
	drello.addBoard(board);
	drello.saveToLocalStorage();

	return false;
}

/* loads a board by its ID
 * 
 */
 function loadBoard(id) {
 	if (typeof id === 'number') {
 		console.log("Loading board - "+ id);
 		var board = drello.getBoard(id);
 		if (board) {
 			localStorage.setItem("currentBoard",id);
 			console.log("Found board - "+board._getName());
 		}
 		else {
 			console.log("No board found for ID: "+id);
 		}
 	}
 	else console.log("Failed to load board - Invalid ID.")
 }
/* bind all known events to various elements in the DOM */
(function(){
	// Hide all pop-ups when clicked outside the pop-up 
	document.getElementById("overlay").addEventListener("click",closePopups,false);

	// When a user clicks on the boards link on header show the boards pop-up menu.
	var boardsButton = document.getElementById("boards");
	boardsButton && boardsButton.addEventListener("click",showBoardsPopup,false);
	
	// Create new popup
	var addButton = document.getElementById("add");
	addButton && addButton.addEventListener("click",showCreateNewPopup,false);

	// Profile popup
	var profileButton = document.getElementById("profile");
	profileButton.addEventListener("click",showProfilePopup,false);

	// Bind createBoard function to submit event of the create_board_form in the create_board-popup
	var createBoardForm = document.getElementById("create_board_form");
	createBoardForm && createBoardForm.addEventListener("submit",createBoard,false);

	// Header search
	var searchBox = document.getElementById("header_search_box");
	searchBox.addEventListener("focus",function(e) {
		this.parentNode.classList.add("focused");
	},false);
	searchBox.addEventListener("blur",function(e) {
		this.parentNode.classList.remove("focused");
	},false);

	/* When user clicks on a board in boards list page set the data-id attribute value as a reference for
	 * boards-display to load that board.
	 */
	 var boards = document.querySelectorAll(".board");
	 for (var i = boards.length - 1; i >= 0; i--) {
	 	boards[i].addEventListener("click",function(e){
	 		loadBoard(parseInt(this.dataset.id));
	 		e.preventDefault();
	 	},false);
	 };

})();




