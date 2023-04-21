
//first lets make table of pictures with all their properties and list of tags
var AllPics = [];
var AllTags = {};

var allPicsA = document.querySelectorAll("#bookpile .bok");
for (i = 0; i < allPicsA.length; i++) {
	var pic = allPicsA[i];
	pic.id = "p" + i;
	var tags = pic.children[0].children[0].getAttribute("alt").split(",");
	
	var picTag = {};
	picTag["id"] = i;
	picTag["author"] = pic.children[1].firstChild.nodeValue.toLowerCase().trim();
	picTag["title"] = pic.children[2].firstChild.nodeValue.toLowerCase().trim();
	picTag["tags"] = tags;
	AllPics.push(picTag);
	
	for (j = 0; j < tags.length; j++) {
		var tag = tags[j];
		var temp = AllTags[tag];
		if (temp == null) {
			AllTags[tag] = 1;
		} else {
			AllTags[tag] = temp + 1;
		}
	}
}

function getTagValue(tag) {
	var value = tag;
	switch (tag) {
	case "beg":
		value = "01"
		break;
	case "persp":
		value = "02"
		break;
	case "figure":
		value = "03"
		break;
	case "cloth":
		value = "04"
		break;
	case "color":
		value = "05"
		break;
	case "render":
		value = "06"
		break;
	case "design":
		value = "07"
		break;
	case "ref":
		value = "08"
		break;
	case "design":
		value = "07"
		break;
	case "animat":
		value = "08"
		break;
	case "body":
		value = "09"
		break;
	case "master":
		value = "10"
		break;
	case "think":
		value = "11"
		break;
	}
	return value;
}

//populate tags
var filterdiv = document.getElementById("filterOptionTags");
var tagsClick = [];
var tempAllTags = Object.entries(AllTags);
tempAllTags.sort(function(a, b) {
	return (getTagValue(a[0]).localeCompare(getTagValue(b[0])));
});
for (var i = 0; i < tempAllTags.length; i++) {
	var tagg = tempAllTags[i];
	var key = tagg[0];
	var value = tagg[1];
	var tag = document.createElement("div");
	tag.innerHTML  = key + " " + value;
	tag.id = "tag"+key;
    filterdiv.appendChild(tag);
	tagsClick.push(tag);
}

var inputSearch = document.getElementById("SText");
var inputSortTitle = document.getElementById("sorttitle");
var inputSortAuthor = document.getElementById("sortauthor");
var inputSortTag = document.getElementById("sorttag");
var inputTags = document.getElementById("Tags");
var inputButFilter = document.getElementById("SubmitButton");
var inputButReset = document.getElementById("Reset");


for(i = 0; i < tagsClick.length; i++) {
	tagsClick[i].addEventListener('click', function(){
		if (this.className == "zerotag") return;
		
		var actualtag = this.id.substring(3);
		var currentTags = inputTags.value;
		if (currentTags.includes("-" + actualtag)) {
			currentTags = currentTags.replace("-" + actualtag, "");
		} else if (currentTags.includes("~" + actualtag)) {
			currentTags = currentTags.replace("~" + actualtag, "-" + actualtag)
		} else {
			currentTags = currentTags + "~" + actualtag;
		}
		inputTags.value = currentTags;
		filterPictures();
		return;
	});
}

inputSearch.addEventListener('input', function(){
	filterPictures();
});
inputSearch.addEventListener('change', function(){
	filterPictures();
})
inputSortTitle.addEventListener('change', function(){
	filterPictures();
});
inputSortAuthor.addEventListener('change', function(){
	filterPictures();
});
inputSortTag.addEventListener('change', function(){
	filterPictures();
});
inputButReset.addEventListener('click', function(e){
	e.preventDefault();
	//here i wanted to simply edit url but it seems even in 2023 this is behavior most browsers hate so i chose a simple reloading the webpage with clean url
	var temp = window.location.href.split('?');
	var baseURL = temp[0];
	window.location.href = baseURL;
	return;
});
inputButFilter.addEventListener('click', function(e){
	e.preventDefault();
	var temp = window.location.href.split('?');
	var baseURL = temp[0];
	var curedParam = "";
	
	if (inputSortTitle.checked == true)  curedParam = curedParam + "sort=" + inputSortTitle.value + "&";
	if (inputSortAuthor.checked == true)  curedParam = curedParam + "sort=" + inputSortAuthor.value + "&";
	// inputTags selected by default
	if (check(inputTags.value) != null) curedParam = curedParam + "tags=" + inputTags.value + "&";
	if (check(inputSearch.value) != null) curedParam = curedParam + "search=" + inputSearch.value.trim() + "&";

	if (curedParam.length > 0) {
		window.location.href = baseURL + "?" + curedParam.substring(0, curedParam.length - 1);
	} else {
		window.location.href = baseURL;
	}
	return;
});


function hide(id) {
	document.getElementById(id).style.display = "none";
	return;
}
function show(id) {
	document.getElementById(id).style.display = "block";
	return;
}
function check(value) {
	if (value == null) return null;
	if (value.length < 1) return null;
	if (typeof value === 'string' || value instanceof String) {
		if (value.trim() < 1 ) return null;
	} 
	return value;
}
var beggining = document.getElementById("bookpile");
function movetoend(id) {
	var temp = document.getElementById("p" + id);
	beggining.appendChild(temp);
}

function filterPictures() {
	
	if (inputSortTitle.checked) {
		AllPics.sort(function(a, b){
			var v = a.title.localeCompare(b.title);
			if (v == 0) v = a.author.localeCompare(b.author);
			if (v == 0) v = b.id - a.id;
			return v;
			});
	} else if (inputSortAuthor.checked) {
		AllPics.sort(function(a, b){
			var v = a.author.localeCompare(b.author);
			if (v == 0) v = a.title.localeCompare(b.title);
			if (v == 0) v = b.id - a.id;
			return v;
			});
	} else { //tags
		AllPics.sort(function(a, b){ 
			var v = getTagValue(a.tags[0]).localeCompare(getTagValue(b.tags[0]));
			if (v == 0) v = a.author.localeCompare(b.author);
			if (v == 0) v = a.title.localeCompare(b.title);
			if (v == 0) v = b.id - a.id;
			return v;
		});
	}
	
	var plusTags = [];
	var minusTags = [];
	var temp = inputTags.value ?? "";
	while (temp.length > 0) {
		var positive = true;
		if (temp[0]=="-") positive = false;
		temp = temp.substring(1);
		//step letter by letter until you find ~- or end
		var i;
		for (i = 0; i< temp.length; i++) {
			var letter = temp[i];
			if ((letter == "-") || (letter == "~")) {
				//i = i - 1;
				break;
			} 
		}
		var theTag = temp.substring(0, i);
		temp = temp.substring(i);
		if (positive) plusTags.push(theTag);
		else minusTags.push(theTag);
	}

	var passedTags = {};
	
	for (i = 0; i < AllPics.length; i++) {
		var pic = AllPics[i];
		hide("p" + pic.id);
		
		var hasTags = true;
		for (j = 0; j < plusTags.length; j++) {
			var wantedTag = plusTags[j];
			if (pic.tags.includes(wantedTag)) continue;
			hasTags = false;
			break;
		}
		if (hasTags == false) continue;
		
		if (check(inputSearch.value) != null) {
			var stext = inputSearch.value.toLowerCase().trim();
			
			if (pic.author.includes(stext)) {
				//ok
			} else if (pic.title.includes(stext)) {
				//ok
			} else {
				continue;
			}
		}
		
		var noTags = false;
		for (j = 0; j < minusTags.length; j++) {
			var wantedTag = minusTags[j];
			if (pic.tags.includes(wantedTag) == false) continue;
			noTags = true;
			break;
		}
		if (noTags == true) continue;

		show("p" + pic.id);
		movetoend(pic.id);
		
		//for tags counters
		for (j = 0; j < pic.tags.length; j++) {
			var tag = pic.tags[j];
			var temp = passedTags[tag];
			if (temp == null) {
				passedTags[tag] = 1;
			} else {
				passedTags[tag] = temp + 1;
			}
		}
	}
	
	//resolve tags in filter
	for (j = 0; j < minusTags.length; j++) {
		passedTags[minusTags[j]] = -1;
	}
	for (var [key, value] of Object.entries(AllTags)) {
		var tagElement = document.getElementById("tag" + key);
		var count = passedTags[key] ?? 0;
		tagElement.innerHTML = key + " " + count;
		if (count > 0) {
			tagElement.className = "normaltag";
		} else if (count == -1) {
			tagElement.className = "negativetag";
		} else {
			tagElement.className = "zerotag";
		}
}
	
	return;
}

function prefillFilter() {

	inputSearch.value = null;
	inputSortTag.checked = true;
	inputSortTitle.checked = false;
	inputSortAuthor.checked = false;
	inputTags.value = null;
	
	var temp = window.location.href.split('?');
	var baseURL = temp[0];
	if (temp.length < 2) return;
	var paramString = temp[1];
	paramString = paramString.replaceAll("%7E", "~");
	var params_arr = paramString.split('&');
	for (var i = 0; i < params_arr.length; i++) {
	   var pair = params_arr[i].split('=');
	   var key = check(pair[0]);
	   var value = check(pair[1]);
	   if (key == null) continue;
	   if (value == null) continue;
	   
	   if (key == "sort") {
		   if (value == "title") {
			   inputSortTitle.checked = true;
		   } else if ( value == "author") {
			   inputSortAuthor.checked = true;
		   } else {
			   inputSortTag = true;
		   }
	   } else if (key == "tags") {
		   inputTags.value = value;
	   } else if (key == "search") {
		   var pom = value.replaceAll("%20", " ")
		   inputSearch.value = pom;
	   }
	}
	filterPictures();
	return;
}

prefillFilter();
filterPictures();