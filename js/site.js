// The __currentPopup variable holds the node of the pop-up displayed currently. 
var __currentPopup = null;
var boardController = new BoardController();
var listController = new ListController();
var cardController = new CardController();
var dragManager = new DragManager();

// Generate DOM nodes for loadeed boards and display them.
boardController.populateBoards();

function refreshBoardsView() {
	boardController.populateBoards();
}
function refreshListView() {

	listController.populateLists(boardController.getBoard(getCurrentBoardId()));
	dragManager.clearAll();

	// Initialize drag events
	dragManager.addDrag(new DragDrop({
		container: "#board_content",
		handle: "card",
		dragClass: "dragging",
		dropZone: ".list-body",

		start: function(e) {
			var data = this.dataTransfer;
			data.card = parseInt(e.currentTarget.dataset.id);
			data.srcList = parseInt(e.currentTarget.dataset.list);
			data.dstList = null;
		},
		hover: function(e, target) {
			var data = this.dataTransfer;		
			data.dstList = parseInt(target.parentNode.dataset.id);
		},
		drop: function(e) {
			var data = this.dataTransfer;
			if (data.dstList >= 0) {
				boardController.moveCardToList(getCurrentBoardId(), data.card, data.srcList, data.dstList, data.dropPosition);
				boardController.saveEverything();
				refreshListView();
			}
		}
	}));
	dragManager.addDrag(new DragDrop({
		container: "#board_content",
		handle: "list",
		dragClass: "dragging",
		dropZone: "#board_content",

		start: function(e) {
			var data = this.dataTransfer;
			data.board = getCurrentBoardId();
			data.src = parseInt(e.currentTarget.dataset.id);
			data.dst = null;
		},
		hover: function(e, target) {	
			var data = this.dataTransfer;	
			if (parseInt(e.target.parentNode.dataset.id) >= 0 )
				data.dst = parseInt(target.parentNode.dataset.id);
		},
		drop: function(e) {
			var data = this.dataTransfer;
			if (data.dropPosition >= 0) {
				boardController.moveList(getCurrentBoardId(), data.src, data.dropPosition);
				boardController.saveEverything();
				refreshListView();
			}
		}
	}));
}
/* calls when a user submit the create board form create a new Board and put it to
 * boards list of drello object and then save to  local storage.
 */
function createBoard(e) {
	e.preventDefault();
	var form = e.target;
	var nameBox = form.getElementsByTagName("input")[0];

	// No boards with empty name
	if(!nameBox.value.trim()) return false;

	// Create a new Board node and add to DOM.
	var id = boardController.addNewBoard(nameBox.value);
	boardController.saveEverything();	// always save after a change has been committed.

	// refresh the boards container view
	refreshBoardsView();
	loadBoardAndDisplayListView(id);

	// Clear the text field
	nameBox.value = "";
	return false;
}

/* called when user submits the add list form
 */
function createList(e) {
	e.preventDefault();
	var form = e.target;
	var nameBox = form.getElementsByTagName("input")[0];

	// No lists with empty name
	if(!nameBox.value.trim()) return false;

	var boardId = parseInt(document.getElementById("board_ribbon_star").dataset.id);
	// Create a new List node and add to DOM
	var b = boardController.addNewList(nameBox.value,boardId);
	boardController.saveEverything();

	// refresh the list container view
	refreshListView();

	// Clear the text field
	nameBox.value = "";
}

/* called when user submits the add card form */
function createCard(e) {
	e.preventDefault();
	var form = e.target;
	var nameBox = form.getElementsByTagName("input")[0];

	// No cards with empty name
	if(!nameBox.value.trim()) return false;

	var listId = parseInt(form.dataset.id);
	var boardId = parseInt(document.getElementById("board_ribbon_star").dataset.id);

	var b = boardController.addNewCard(nameBox.value,listId,boardId);
	boardController.saveEverything();

	// refresh the list container view
	refreshListView();

	// Clear the text field
	nameBox.value = "";
}

/* Returns the id of the board currently displayed.
 * The ID is storred in board_ribbon_star's dataset
/* Loads a board by its ID and display the lists view.
 */
 function getCurrentBoardId () {
 	return parseInt(localStorage.getItem("currentBoard"));
 }

function setCurrentBoardId (id) {
	document.getElementById("board_ribbon_star").dataset.id = id;
	localStorage.setItem("currentBoard",id);
}

function loadBoardAndDisplayListView(id) {
 	if (typeof id === 'number') {
 		var board = boardController.getBoard(id);
 		if (board) {
 			console.log("Found board - "+board._getName());
 			setCurrentBoardId(id);
 			// Change to list view
 			refreshListView();
 			document.getElementById("boards_view_container").classList.add("no-display");
 			document.getElementById("list_view_container").classList.remove("no-display");
 			document.getElementById("board_ribbon_title").innerHTML = board._getName();

 			if(board._isStarred()) document.getElementById("board_ribbon_star").classList.add("starred");
 			else document.getElementById("board_ribbon_star").classList.remove("starred");

 			// change url without reloading
 			//window.history.pushState('ListViewState', 'ListView', '/boards/'+id+"/");
 		}
 		else {
 			console.log("No board found for ID: "+id);
 		}
 	}
 	else console.log("Failed to load board - Invalid ID.");
}

/* Called when user clicked on the star icon on a board */
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
	document.getElementById("boards_popup_my").classList.add("no-display");
	document.getElementById("boards_popup_starred").classList.add("no-display");
	document.getElementById("boards_popup_results").classList.remove("no-display");
	// do not display any result if query string is empty
	if(!key) return;
	var boardNodes = boardController.searchBoards(key);
	if (boardNodes) {
		for(i = 0, len = boardNodes.length; i < len; i++) {
			listContainer.appendChild(boardNodes[i].node);
		}
	}
}

/* Called after a user submits the edit card desc form */
function changeCardDesc (e) {
	e.preventDefault();
	var form = e.target;
	var desc = form.getElementsByTagName("textarea")[0].value;
	var container = document.getElementById("card_display_popup");
	var cardId = parseInt(container.dataset.card);
	var listId = parseInt(container.dataset.list);
	var card = boardController.getBoard(getCurrentBoardId()).getList(listId).getCard(cardId);

	card.setDesc(desc);
	// save things
	boardController.saveEverything();

	// refresh popup
	closePopups(e, true);
	showCardPopup.call({dataset: {id: cardId, list: listId}}, e);
	refreshListView();
	//container.querySelector(".card-description p").innerHTML = desc;
	
	// hide the form
	toggleEditCardDescForm(e);
	return false;
}

function uploadAttachmentToCurrentCard(e) {
	e.preventDefault();

	var container = document.getElementById("card_display_popup");
	var cardId = parseInt(container.dataset.card);
	var listId = parseInt(container.dataset.list);

	console.log("uploading attachment image");
	var files = e.target.files;
	for (var i = files.length - 1; i >= 0; i--) {
		if (!files[i].type.match('image.*')) continue; // Only process image files.

		try {
			var reader = new FileReader();
			reader.onload = (function(file) {
				return function(e) {
					// Save attachment
					var attch = {};
					attch.data = e.target.result;
					attch.name = file.name;
					var d = new Date();
					attch.date = d.toDateString()+" "+d.toLocaleTimeString();
					boardController.getBoard(getCurrentBoardId()).getList(listId).getCard(cardId).addAttachment(attch);
					boardController.saveEverything();

					//refresh view
					closePopups(e, true);
					showCardPopup.call({dataset: {id: cardId, list: listId}}, e);
					refreshListView();
				};
			})(files[i]);
			reader.readAsDataURL(files[i]);
		} catch (e) {
			console.error("Error while reading from file");
		}
	}
}

function deleteAttachmentFromCurrentCard(e) {
	e.preventDefault();

	var container = document.getElementById("card_display_popup");
	var cardId = parseInt(container.dataset.card);
	var listId = parseInt(container.dataset.list);

	console.log("removing attachment image");
	boardController.getBoard(getCurrentBoardId()).getList(listId).getCard(cardId).removeAttachment(parseInt(e.target.dataset.id));
	boardController.saveEverything();

	//refresh view
	closePopups(e, true);
	showCardPopup.call({dataset: {id: cardId, list: listId}}, e);
	refreshListView();
}

function setCoverOfCurrentCard  (e) {
	e.preventDefault();

	var container = document.getElementById("card_display_popup");
	var cardId = parseInt(container.dataset.card);
	var listId = parseInt(container.dataset.list);

	console.log("changing card cover image");
	boardController.getBoard(getCurrentBoardId()).getList(listId).getCard(cardId).setCover(parseInt(e.target.dataset.id));
	boardController.saveEverything();

	//refresh view
	closePopups(e, true);
	showCardPopup.call({dataset: {id: cardId, list: listId}}, e);
	refreshListView();
}

function archiveCurrentCard (e) {
	var container = document.getElementById("card_display_popup");
	var cardId = parseInt(container.dataset.card);
	var listId = parseInt(container.dataset.list);

	console.log("archiving card");
	boardController.getBoard(getCurrentBoardId()).getList(listId).getCard(cardId).archive();
	boardController.saveEverything();

	//refresh view
	closePopups(e, true);
	refreshListView();
}

function EditCardDetails (e) {
	e.preventDefault();
	
	var form = e.target;
	var cardId = parseInt(form.dataset.card);
	var listId = parseInt(form.dataset.list);	

	var text = form.getElementsByTagName("textarea")[0].value;

	// No cards with empty name
	if(!text.trim()) return false;

	console.log("Editing card exerpt");
	boardController.getBoard(getCurrentBoardId()).getList(listId).getCard(cardId).changeName(text);
	boardController.saveEverything();

	//refresh view
	closePopups(e, true);
	refreshListView();

	return false;
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
		popup.style.top = (position.top)+"px";
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

		// remove events in the popup
		__currentPopup.parentNode.replaceChild(__currentPopup.cloneNode(true), __currentPopup);
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

	// Bind createBoard function to submit event of the create_board_form in the create_board-popup
	var createBoardForm = document.getElementById("create_board_form");
	createBoardForm && createBoardForm.addEventListener("submit",function(e){
		e.preventDefault();
		closePopups(e,true);
		createBoard(e);
	},false);

	// get the position of event target to calculate the position of the pop-up 
	showPopup("create_board_popup",e.target.getBoundingClientRect());

	return false;
}

function showListActionsPopop(e) {
	// Prevent event propogation.
	e = e || window.event
	e.stopPropagation();

	// Bind events
	var container = document.getElementById("list_actions_popup");
	if (!container) return false;
	var listId = parseInt(e.target.dataset.list);
	container.addEventListener("click", function (e) {
		
		if (e.target.id === "list_action_addcard") {
			// Show add card form in that list

		}
		else if (e.target.id === "list_action_archive_allcards") {
			// loop through all cards of that list and archive them all
			boardController.getBoard(getCurrentBoardId()).getList(listId).archiveAllCards();
			closePopups(e, true);
			boardController.saveEverything();
			refreshListView();
		}
		else if (e.target.id == "list_action_archive") {
			// put the list in trash
			boardController.getBoard(getCurrentBoardId()).getList(listId).archive();
			boardController.saveEverything();
			closePopups(e, true);
			refreshListView();
		}
	}, false);

	// get the position of event target to calculate the position of the pop-up 
	showPopup("list_actions_popup",e.target.getBoundingClientRect());
}

function showBoardsPopup(e){
	// Prevent event propogation.
	e = e || window.event
	e.stopPropagation();
	var boardNodes = boardController.searchBoards("");
	var i, len, starred = 0, node;
	var myList = document.querySelector("#boards_popup_my .boards-list");
	var starredList = document.querySelector("#boards_popup_starred .boards-list");
	
	// hide search results and show containers for boards and starred ones
	document.getElementById("boards_popup_my").classList.remove("no-display");
	document.getElementById("boards_popup_starred").classList.remove("no-display");
	document.getElementById("boards_popup_results").classList.add("no-display");
	
	// remove existing boards to avoid duplication
	starredList.innerHTML = "";
	myList.innerHTML = "";
	
	console.log("Boards popup: generating board nodes from data");
	if (boardNodes) {
		for(i = 0, len = boardNodes.length; i < len; i++) {
			node = boardNodes[i].node;
			myList.appendChild(node);
			if(boardNodes[i].starred) starredList.appendChild(node.cloneNode(true));
		}
	}

	// Boards popup: bind keystroke event to search for boards.
	var boardsPopup = document.getElementById("boards_popup");
 	var searchInput = document.getElementById("search_boards_input");
 	searchInput.addEventListener("keyup",searchAndDisplayBoards,false);
	boardsPopup.addEventListener("click",function(e){
	 	e.preventDefault();
	 	if(e.target.classList.contains("boards-list-item")) 
		loadBoardAndDisplayListView(parseInt(e.target.dataset.id));
 		else if(e.target.classList.contains("board-name"))
		loadBoardAndDisplayListView(parseInt(e.target.parentNode.dataset.id));
 		else if(e.target.classList.contains("icon-star"))
		toggleStar(e);
 		
 	},false);

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
	e = e || window.event
	e.stopPropagation();
	showPopup("create_new_popup");

	return false;
}
function showCardPopup(e){
	e = e || window.event;
	e.preventDefault();
	e.stopPropagation();

	// get data of the clicked card and popuplate DOM
	var container = document.getElementById("card_display_popup");
	var cardId = parseInt(this.dataset.id);
	var listId = parseInt(this.dataset.list);
	var list = boardController.getBoard(getCurrentBoardId()).getList(listId);
	var card = list.getCard(cardId);

	// set current card id to container
	container.dataset.card = cardId;
	container.dataset.list = listId;

	// attach cover image if one exists.
	var cover = card.getCoverImage();
	var cardCover = container.querySelector(".card-cover") || null;
	cardCover && (cardCover.innerHTML = "");
	if (cover && cardCover) cardCover.innerHTML = '<a href="#"><img src="'+cover.data+'" /></a>';

	// set card name in popup
	container.querySelector(".card-info-title-name").innerHTML = card._getName();
	// set list name
	container.querySelector(".card-info-title-extra-list").innerHTML = list._getName();
	// set description
	container.querySelector(".card-description p").innerHTML = card._getDesc();
	// display attachments
	var attachments = card._getAttachments();
	var attachmentsList = container.querySelector(".card-attachments");
	var i, len, attNode = null;
	if (attachments.length) {
		attachmentsList.innerHTML = "";
		for (i = 0, len = attachments.length; i < len; i++) {
			attNode = document.createElement("div");
			attNode.className = "card-attachments-item block";
			var text = (i == card._getCover()) ? "Remove Cover" : "Make Cover"
			attNode.innerHTML = '\
								<div class="card-attachments-item-image i-block middle">\
									<a href="#"><img src="'+attachments[i].data+'" /></a>\
								</div>\
								<div class="card-attachments-item-desc i-block middle">\
									<div class="light-text break-1">'+attachments[i].name+'</div>\
									<div class="light-text break-1">Added on '+attachments[i].date+'</div>\
									<div class="light-text break-1">\
										<!--<span class="icon-download pointer">Download</span>-->\
										<span class="attachment-makecover icon-tags pointer" data-id="'+i+'">'+text+'</span>\
										<span class="attachment-delete icon-cancel pointer" data-id="'+i+'">Delete</span>\
									</div>\
								</div>\
								';
			attachmentsList.appendChild(attNode);
		}
	} else attachmentsList.innerHTML = "Add an attachment and it will be here.";
		

	// Bind events
	// card display popup
	var editDescForm = document.getElementById("edit_card_desc_form");
	var fileInput = document.getElementById("card_add_attach_input");

	container && container.addEventListener("click", function (e) {	
		// when clicked on edit description button, show the input textarea.
		if (e.target.classList.contains("card-description-edit")) {
			e.preventDefault();
			toggleEditCardDescForm(e);
		}

		// when clicked on the cancel edit button hide form
		if (e.target.id === "edit_card_desc_form_close") {
			e.preventDefault();
			toggleEditCardDescForm(e);
		}

		// when clicked on delete attachment button
		if (e.target.classList.contains("attachment-delete")) {
			e.preventDefault();
			deleteAttachmentFromCurrentCard(e);
		}
		if (e.target.classList.contains("attachment-makecover")) {
			e.preventDefault();
			setCoverOfCurrentCard(e);
		}

		// archive a card
		if (e.target.id === "card_archive_button" || e.target.parentNode.id === "card_archive_button") {
				e.preventDefault();
				archiveCurrentCard(e);
		}

	}, false);
	// Save the data after submitting the form
	editDescForm && editDescForm.addEventListener("submit", changeCardDesc, false);

	// upload the attachment after the file input change
	fileInput.addEventListener("change", uploadAttachmentToCurrentCard,false);

	// Show time
	showOverlay();
	showPopup('card_display_popup');
	return false;
}

function showClosedBoardsPopup (e) {
	e = e || window.event
	e.stopPropagation();
	var list = document.querySelector("#closed_boards_popup .closed-boards-list");
	var boardNodes = boardController.getClosedBoards();

	console.log("ClosedBoards popup: generating board nodes from data");
	if (boardNodes.length>0) {
		for(i = 0, len = boardNodes.length; i < len; i++) {
			list.appendChild(boardNodes[i]);
		}
	}
	else {
		list.innerHTML = "Nothing to see here";
	}

	// Bind events
	list && list.addEventListener("click", function (e) {
		if (e.target.classList.contains("btn")) {
			boardController.openBoard(parseInt(e.target.dataset.id));
			boardController.saveEverything();
			refreshBoardsView();
			closePopups(e, true);
		}
	});

	// show time
	showOverlay();
	showPopup('closed_boards_popup');
}

function showCardEditPopup (e) {
	e = e || window.event
	e.stopPropagation();

	// clicked on the pencil icon
	var cardId = parseInt(e.target.parentNode.dataset.id);
	var listId = parseInt(e.target.parentNode.dataset.list);
	var form = document.getElementById("card_edit_popup").getElementsByTagName("form")[0];
	form.dataset.card = cardId;
	form.dataset.list = listId;
	form.getElementsByTagName("textarea")[0].value = e.target.parentNode.querySelector(".card-detail-exerpt").innerHTML;

	// Bind events
	form.addEventListener("submit", EditCardDetails, false);

	// Show time
	showOverlay();
	showPopup('card_edit_popup', e.target.parentNode.getBoundingClientRect());

	return false;
}
function showOverlay() {
	document.getElementById("overlay").classList.add("visible");
}


function toggleHide(node) {
	node.classList.toggle("show");
}
function toggleDisplay(node) {
	node.classList.toggle("no-display");
}

function SidebarToggle() {
	toggleHide(document.getElementById("board_menu"));
	return false;
}
function SidebarMenuToggle() {
	toggleHide(document.querySelectorAll("#board_menu ul")[0]);
	return false;
}
function toggleAddListForm(e) {
	var form = document.getElementById("add_list_form");
	toggleDisplay(form);
	form.getElementsByTagName("input")[0].focus();
}
function toggleAddCardForm(e) {
	var form = e.target.parentNode.parentNode.querySelector("#add_card_form");
	toggleDisplay(form);
	form.getElementsByTagName("input")[0].focus();
}
function toggleEditCardDescForm(e) {
	var form = document.getElementById("edit_card_desc_form");
	toggleDisplay(form);
	form.getElementsByTagName("textarea")[0].focus();
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

 	// Bind the onclick of star button in list view to toggleStar 
 	var boardRibbonStar = document.getElementById("board_ribbon_star");
 	boardRibbonStar && boardRibbonStar.addEventListener("click",toggleStar,false);

 	// List view: display add list form upon clicking add list placeholder.
 	var addListLink = document.getElementById("add_list_link");
 	var addListCloseButton = document.getElementById("add_list_form_close");
 	var addListForm = document.getElementById("add_list_form");
 	addListLink && addListLink.addEventListener("click", toggleAddListForm, false);	// show form
 	addListCloseButton && addListCloseButton.addEventListener("click", toggleAddListForm, true);	// hide form on blur
 	addListForm && addListForm.addEventListener("submit", createList, false);

	// Board actions in sidemenu
	var sidemenuActionsList = document.querySelector(".sidemenu-actions-list");
	sidemenuActionsList && sidemenuActionsList.addEventListener("click", function (e) {
		if (e.target.classList.contains("js-action-closeboard")) {
			// This does not delete the board.
			boardController.closeBoard(getCurrentBoardId());
			boardController.saveEverything();
			window.location = "main.html";
			console.log("closed current board");
		}
	}, false);

})();




