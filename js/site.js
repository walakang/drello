// Make cJS global. This object holds the core methods and properties.
// defined in coreJS.js
var cJS = new coreJS();

/* The _currentPopup variable holds the node of the popup displayed currently. 
	It is used to hide the popup when another event occured.
*/
_currentPopup = null;
function closePopups(){
	if(_currentPopup!=null){
		_currentPopup.classList.add("hide");
		_currentPopup = null;
	}
	return true;
}
// Hide all popusps when clicked outside the popup 
document.getElementsByClassName("container-main")[0].onclick = closePopups;

function hideToggle(node){
	if(node.className === "show"){
		node.className = "";
	}
	else{
		node.className = "show";
	}
}
// behaviour for the search box on header.
function focusSearch(node){
	node.parentNode.classList.add("focused");
	node.parentNode.children[1].classList.remove("hide");
	node.parentNode.children[2].classList.remove("hide");

	return;
}
function blurSearch(node){
	node.parentNode.classList.remove("focused");
	node.parentNode.children[0].value = "";
	node.parentNode.children[1].classList.add("hide");
	node.parentNode.children[2].classList.add("hide");

	return;
}
function showHideSidebarToggle(){
	var menu = document.getElementById("board-menu");
	hideToggle(menu);
	return;
}
function showHideSidebarMenuToggle(){
	var menu = document.querySelectorAll("#board-menu ul")[0];
	hideToggle(menu);

	return;
}
function createBoardPrvacyToggle(node){
	if(node.id === "change"){
		
		hideToggle(document.getElementById("preview"));
		hideToggle(document.getElementById("options"));
	}
	else{
		//change the value on the privacy form
		
		hideToggle(document.getElementById("preview"));
		hideToggle(document.getElementById("options"));
	}
}
function showPopup(name,position){
	position = position || undefined;
	var popup = document.getElementById(name);
	if(typeof(position)==='object'){
		popup.style.left = position.left+"px";
		popup.style.top = (position.top-80)+"px";
	}

	if(_currentPopup!=null){
		_currentPopup.classList.add("hide");
		_currentPopup = null;
	}
	if(popup.classList.contains("hide")){
		popup.classList.remove("hide");
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
	position.top = e.target.getBoundingClientRect().top;
	showPopup("create-board-popup",position);

	return false;
}
function showBoardsPopupToggle(){

	showPopup("boards-popup");

	return false;
}
function showProfilePopupToggle(){

	showPopup("profile-popup");

	return false;
}