// Make cJS global. This object holds the core methods and properties.
// defined in coreJS.js
var drello = new Drello();

/* Populate DOM form the data stored in localStorage */
drello.fromLocal();
drello.populateBoards();


/* The _currentPopup variable holds the node of the popup displayed currently. 
	It is used to hide the popup when another event occured.
*/
var _currentPopup = null;
function closePopups(){
	if(_currentPopup!=null){
		_currentPopup.classList.add("no-display");
		_currentPopup = null;
	}
	if(document.getElementById("overlay").classList.contains("visible"))
		document.getElementById("overlay").classList.remove("visible");
	return true;
}

function showOverlay(){
	document.getElementById("overlay").classList.add("visible");
}
// Hide all popusps when clicked outside the popup 
document.getElementsByTagName("main")[0].onclick = closePopups;

function hideToggle(node){
	if(node.classList.contains("show")){
		node.classList.remove("show");
	}
	else{
		node.classList.add("show");
	}
}
// behaviour for the search box on header.
function focusSearch(node){
	node.parentNode.classList.add("focused");
	node.parentNode.children[1].classList.remove("no-display");
	node.parentNode.children[2].classList.remove("no-display");

	return;
}
function blurSearch(node){
	node.parentNode.classList.remove("focused");
	node.parentNode.children[0].value = "";
	node.parentNode.children[1].classList.add("no-display");
	node.parentNode.children[2].classList.add("no-display");

	return;
}
function showHideSidebarToggle(){
	var menu = document.getElementById("board_menu");
	hideToggle(menu);
	return;
}
function showHideSidebarMenuToggle(){
	var menu = document.querySelectorAll("#board_menu ul")[0];
	hideToggle(menu);

	return;
}
function createBoardPrvacyToggle(node){
	if(node.id === "change"){
		
		hideToggle(document.getElementById("privacy_preview"));
		hideToggle(document.getElementById("privacy_options"));
	}
	else{
		//change the value on the privacy form
		
		hideToggle(document.getElementById("privacy_preview"));
		hideToggle(document.getElementById("privacy_options"));
	}
}
function showPopup(name,position){
	position = position || undefined;
	var popup = document.getElementById(name);
	if(typeof(position) ==='object'){
		popup.style.left = position.left+"px";
		//popup.style.top = (position.top-80)+"px";
		popup.style.bottom = (document.body.getBoundingClientRect().height-(position.bottom+100)+"px");
	}

	if(_currentPopup!=null){
		_currentPopup.classList.add("no-display");
		_currentPopup = null;
	}
	if(popup.classList.contains("no-display")){
		popup.classList.remove("no-display");
		_currentPopup = popup;
	}
}
function showCreateBoardPopup(e){
	/* the default behaviour of click on content is to hide the popups 
	 * We need to override that.
	*/
	e = e || window.event
	e.stopPropagation();
	drello.log(e.target);
	/* get the position of event target to calculate the position of the popup */
	var position = {};
	position.left = e.target.getBoundingClientRect().left;
	//position.top = e.target.getBoundingClientRect().top;
	position.bottom = e.target.getBoundingClientRect().bottom;
	showPopup("create_board_popup",position);

	return false;
}
function showBoardsPopupToggle(){

	showPopup("boards_popup");

	return false;
}
function showProfilePopupToggle(){

	showPopup("profile_popup");

	return false;
}
function showCreateNewPopupToggle(){

	showPopup("create_new_popup");

	return false;
}
function showCardPopupToggle(e){
	/* the default behaviour of click on content is to hide the popups 
	 * We need to override that.
	*/
	e = e || window.event
	e.stopPropagation();
	showOverlay();
	showPopup('card_display_popup');
	return false;
}

/* Bind an event when a user submit the create board form create a new Board and put it to
 * boards list of drello object and then save to  local storage.
 */
function createBoard(event) {
	var _form = event.target;
	var name = _form.getElementsByTagName("input")[0].value;
	// Create a new Board node and add to DOM
	var board = new Board(name,drello.getUniqueBoardId());
	board.createNode();
	board.selfAppend();
	// Save the node to local storage
	drello.boards.push(board);
	drello.saveToLocal();

	return false;
}

/* Call to bind all known events to various elements in the DOM */
(function bindAllEvents(){
	// Bind createBoard function to submit event of the create_board_form in the create_board-popup
	document.getElementById("create_board_form").addEventListener("submit",createBoard,false);

	/* When user clicks on a board in boards list page set the data-id attribute value as a reference for
	 * boards-display to load that board.
	 */
	 var boards = document.querySelectorAll(".board");
	 for (var i = boards.length - 1; i >= 0; i--) {
	 	boards[i].addEventListener("click",function(e){
	 		drello.log("Loading board - "+ this.dataset.id);
	 		localStorage.setItem("currentBoard",this.dataset.id);
	 	},false);
	 };

})();