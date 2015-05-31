// Make cJS global. This object holds the core methods and properties.
// defined in coreJS.js
var cJS = new coreJS();


function focusSearch(node){
	node.parentNode.classList.add("focused");
	node.parentNode.children[1].classList.remove("hide");
	node.parentNode.children[2].classList.remove("hide");
}
function blurSearch(node){
	node.parentNode.classList.remove("focused");
	node.parentNode.children[0].value = "";
	node.parentNode.children[1].classList.add("hide");
	node.parentNode.children[2].classList.add("hide");
}
function showHideSidebarToggle(){
	var menu = document.getElementById("board-menu");
	if(menu.className === "show"){
		menu.className = "";
	}
	else{
		menu.className = "show";
	}
}
function showHideSidebarMenuToggle(){
	var menu = document.querySelectorAll("#board-menu ul")[0];
	if(menu.className === "show"){
		menu.className = "";
	}
	else{
		menu.className = "show";
	}
}