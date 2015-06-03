function coreJS(){

	this.boards = [];
	this.organizations = [];
	this.getAll = function(selectors){
		document.querySelectorAll(selectors);
	}
	this.saveToLocal = function(){
		localStorage.boards = JSON.stringify(this.boards);
		localStorage.organizations = JSON.stringify(this.organizations);
	}
	this.fromLocal = function(){
		this.boards = JSON.parse(localStorage.boards);
		this.organizations = JSON.parse(localStorage.organizations);
	}

}
function Board(name){
	// public vars
	this.name = name;
	this.id = null;
	this.lists = [];
	this.star = false;
	this.organization = null;
	this.node =  null;
	this.isPublic = false;

	this.addList = function(list){
		// be modular
		this.lists.push(list);
	}
	this.removeList = function(item){
		if(typeof(item)=="object" && item instanceof List){
			var index = this.lists.indexOf(item);
			this.lists.splice(index,1);
		}
		else if(typeof(item)=="number"){
			this.lists.splice(index,1);
		}
	}
	this.isPublic = function(){
		return this.isPublic;
	}
	this.createNode = function(){
		this.node = document.createElement("li");
		this.node.className = "board";
		// create children
		var a = document.createElement("a");
		a.href = "board-display.html";
		var title = document.createElement("span");
		title.className = "bold";
		title.innerHTML = this.name;
		var star = document.createElement("span");
		star.className = "star";
		star.title = "Click to star this board. It will be shown at the top of the list";
		a.appendChild(title);
		a.appendChild(star);
		this.node.appendChild(a);

	}
}
function List(name){
	// public vars
	this.name = name;
	this.id = null;
	this.cards = [];
	this.node = null;

	this.addCard = function(card){
		this.cards.push(card);
	}
}

function Card(name){

	this.name = name;
	this.id = null;
	this.description = null;
	this.attachments = [];
	this.colors = [];
	this.node = null;

}