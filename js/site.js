
// The __currentPopup variable holds the node of the pop-up displayed currently. 
var __currentPopup = null;
var boardController = new BoardController();
var listController = new ListController();
var cardController = new CardController();

// Load everything at startup
boardController.loadEverything();
// Generate DOM nodes for loadeed boards and display them.
boardController.populateBoards();

/* calls when a user submit the create board form create a new Board and put it to
 * boards list of drello object and then save to  local storage.
 */
function createBoard(e) {
	e.preventDefault();
	var form = e.target;
	var name = form.getElementsByTagName("input")[0].value;
	// Create a new Board node and add to DOM.
	boardController.addNewBoard(name);
	boardController.saveEverything();	// always save after a change has been committed.

	// refresh the boards container view
	boardController.populateBoards();
	return false;
}

/* called when user submits the add list form
 */
function createList(e) {
	e.preventDefault();
	var form = e.target;
	var name = form.getElementsByTagName("input")[0].value;
	var boardId = parseInt(document.getElementById("board_ribbon_star").dataset.id);
	// Create a new List node and add to DOM
	var b = boardController.addNewList(name,boardId);
	boardController.saveEverything();

	// refresh the list container view
	listController.populateLists(b);
}

/* called when user submits the add card form */
function createCard(e) {
	e.preventDefault();
	var form = e.target;
	var name = form.getElementsByTagName("input")[0].value;
	var listId = parseInt(form.dataset.id);
	var boardId = parseInt(document.getElementById("board_ribbon_star").dataset.id);

	var b = boardController.addNewCard(name,listId,boardId);
	boardController.saveEverything();

	// refresh the list container view
	listController.populateLists(b);
}

/* Loads a board by its ID and display the lists view.
 */
 function loadBoardAndDisplayListView(id) {
 	if (typeof id === 'number') {
 		var board = boardController.getBoard(id);
 		if (board) {
 			console.log("Found board - "+board._getName());
 			localStorage.setItem("currentBoard",id);
 			// Change to list view
 			listController.populateLists(board);
 			document.getElementById("boards_view_container").classList.add("no-display");
 			document.getElementById("list_view_container").classList.remove("no-display");
 			document.getElementById("board_ribbon_star").dataset.id = id;
 			if(board._isStarred()) document.getElementById("board_ribbon_star").classList.add("starred");
 			else document.getElementById("board_ribbon_star").classList.remove("starred")
 			// change url without reloading
 			//window.history.pushState('ListViewState', 'ListView', '/boards/'+id+"/");
 		}
 		else {
 			console.log("No board found for ID: "+id);
 		}
 	}
 	else console.log("Failed to load board - Invalid ID.")
 }

/* Called when user clicked on the star icon on a board
 * this function toggles star on a board.
 */
 function toggleStar(e) {
 	e.stopPropagation();
 	var id;
 	if(e.target.id === "board_ribbon_star")
 		id = parseInt(e.target.dataset.id);
 	else
 		id = parseInt(e.target.parentNode.dataset.id);
 	boardController.toggleStar(id);
 	boardController.saveEverything();
 }

/* Called when a user types something on the search input box in the boards popup;
 * @param e: object representing the keyup event.
 */
function searchAndDisplayBoards (e) {
	var key = e.target.value || null;
	var listContainer = document.getElementById("boards_popup_results_list");
	var i, len, listItem;
	listContainer.innerHTML = "";
	displayToggle(document.getElementById("boards_popup_my"));
	displayToggle(document.getElementById("boards_popup_starred"));
	displayToggle(document.getElementById("boards_popup_results"));
	// do not display any result if query string is empty
	if(!key) return;
	var boards = boardController.searchBoards(key);
	console.log("SearchBoards: looping through "+boards.length+" results");
	if (boards) {
		for(i = 0, len = boards.length; i < len; i++) {
			listItem = document.createElement("li");
			listItem.className = "boards-list-item round";
			listItem.innerHTML = '<a href="main.html">\
									<span class="color"></span>\
									<span class="board-name width-100 bold" >'+boards[i]._getName();+' </span>\
									<span class="icon-star"></span>\
								  </a>';
			listContainer.appendChild(listItem);
		}
	}
}

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
	var boards = boardController._getDrello()._getBoards();
	var i, len, starred = 0;
	var myList = document.querySelector("#boards_popup_my .boards-list");
	var starredList = document.querySelector("#boards_popup_starred .boards-list");
	displayToggle(document.getElementById("boards_popup_my"));
	displayToggle(document.getElementById("boards_popup_starred"));
	displayToggle(document.getElementById("boards_popup_results"));
	console.log("Boards popup: generating board nodes from data");
	if (boards) {
		for(i = 0, len = boards.length; i < len; i++) {
			listItem = document.createElement("li");
			listItem.className = "boards-list-item round";
			listItem.innerHTML = '<a href="main.html">\
									<span class="color"></span>\
									<span class="board-name width-100 bold" >'+boards[i]._getName();+' </span>\
									<span class="icon-star"></span>\
								  </a>';
			myList.appendChild(listItem);
			if(boards[i]._isStarred()) starredList.appendChild(listItem.cloneNode(true));
		}
	}
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

function showOverlay() {
	document.getElementById("overlay").classList.add("visible");
}


function hideToggle(node) {
	if(node.classList.contains("show")){
		node.classList.remove("show");
	}
	else{
		node.classList.add("show");
	}
}
function displayToggle(node) {
	if(node.classList.contains("no-display")){
		node.classList.remove("no-display");
	}
	else{
		node.classList.add("no-display");
	}
}

function SidebarToggle() {
	hideToggle(document.getElementById("board_menu"));
	return false;
}
function SidebarMenuToggle() {
	hideToggle(document.querySelectorAll("#board_menu ul")[0]);
	return false;
}
function toggleAddListForm(e) {
	var form = document.getElementById("add_list_form");
	displayToggle(form);
	form.getElementsByTagName("input")[0].focus();
}
function toggleAddCardForm(e) {
	var form = e.target.parentNode.parentNode.querySelector("#add_card_form");
	displayToggle(form);
	form.getElementsByTagName("input")[0].focus();
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
	createBoardForm && createBoardForm.addEventListener("submit",function(e){
		e.preventDefault();
		closePopups(e,true);
		createBoard(e);
	},false);

	// Header search manage focus and blur state of input box.
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
	 var boardsContainer = document.getElementById("boards_view_container");
	 var listsContainer = document.getElementById("list_view_container");

	 boardsContainer.addEventListener("click",function(e){
	 	e.preventDefault();
	 	if(e.target.classList.contains("board")) 
 			loadBoardAndDisplayListView(parseInt(e.target.dataset.id));
 		else if(e.target.classList.contains("board-title"))
 			loadBoardAndDisplayListView(parseInt(e.target.parentNode.dataset.id));
 		else if(e.target.classList.contains("icon-star"))
 			toggleStar(e);
 		
 	},false);

 	// Show star when hovering on board
	boardsContainer.addEventListener("mouseover",function(e){
	 	if (e.target.classList.contains("board"))
 			e.target.getElementsByClassName("icon-star")[0].classList.add("opaque");
 		else if (e.target.parentNode.classList.contains("board"))
 			e.target.parentNode.getElementsByClassName("icon-star")[0].classList.add("opaque");		
 	},false);
 	boardsContainer.addEventListener("mouseout",function(e){
	 	if (e.target.classList.contains("board"))
 			e.target.getElementsByClassName("icon-star")[0].classList.remove("opaque");
 		else if (e.target.parentNode.classList.contains("board"))
 			e.target.parentNode.getElementsByClassName("icon-star")[0].classList.remove("opaque");	
 	},false);

 	// Bind the onclick of star button in list view to toggleStar 
 	var boardRibbonStar = document.getElementById("board_ribbon_star");
 	boardRibbonStar && boardRibbonStar.addEventListener("click",toggleStar,false);

 	// Boards popup: bind keystroke event to search for boards.
 	var searchInput = document.getElementById("search_boards_input");
 	searchInput.addEventListener("keyup",searchAndDisplayBoards,false);


 	// List view: display add list form upon clicking add list placeholder.
 	var addListLink = document.getElementById("add_list_link");
 	var addListInput = document.getElementById("add_list_form_input");
 	var addListForm = document.getElementById("add_list_form");
 	addListLink && addListLink.addEventListener("click", toggleAddListForm, false);	// show form
 	addListInput && addListInput.addEventListener("blur", toggleAddListForm, false);	// hide form on blur
 	addListForm && addListForm.addEventListener("submit", createList, false);

 	// List view display and manage add card form
 	/*listsContainer.addEventListener("click", function(e) {
 		if (event.target.classList.contains("add-card-placeholder")) {
 			toggleAddCardForm(e);
 		}
 	},false);*/
})();




