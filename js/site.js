// Make cJS global. This object holds the core methods and properties.
// defined in coreJS.js
var cJS = new CoreJS();

/* The _currentPopup variable holds the node of the popup displayed currently. 
	It is used to hide the popup when another event occured.
*/
_currentPopup = null;
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
	if(typeof(position)==='object'){
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
	console.log(e.target);
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


