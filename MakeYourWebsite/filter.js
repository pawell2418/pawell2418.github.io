
//first lets make table of pictures with all their properties and list of tags
var AllPics = [];
var AllTags = {};

var allPicsA = document.querySelectorAll("#gallery a");
for (i = 0; i < allPicsA.length; i++) {
	var pic = allPicsA[i];
	pic.id = "p" + i;
	var tags = pic.firstChild.title.split(",");

	var picTag = {};
	picTag["id"] = i;
	picTag["r"] = parseInt(pic.getAttribute("data-r"));
	picTag["d"] = pic.getAttribute("data-d");
	picTag["t"] = tags;
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

//populate tags
var filterdiv = document.getElementById("filterOptionTags");
var tagsClick = [];
var tempAllTags = Object.entries(AllTags);
tempAllTags.sort(function(b, a) {
	return (a[1] - b[1]);
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

var inputRateMin = document.getElementById("Ratemin");
var inputRateMax = document.getElementById("Ratemax");
var inputDateMin = document.getElementById("Datefr");
var inputDateMax = document.getElementById("Dateto");
var inputSortDat = document.getElementById("sortdat");
var inputSortRat = document.getElementById("sortrat");
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

inputRateMin.addEventListener('change', function(){
    var min = parseInt(inputRateMin.value);
	var max = parseInt(inputRateMax.value);
	if (min > max) inputRateMax.value = min;
	filterPictures();
});
inputRateMax.addEventListener('change', function(){
	var max = parseInt(inputRateMax.value);
    var min = parseInt(inputRateMin.value);
	if (min > max) inputRateMin.value = max;
	filterPictures();
});
inputDateMin.addEventListener('change', function(){
	filterPictures();
});
inputDateMax.addEventListener('change', function(){
	filterPictures();
});
inputSortDat.addEventListener('change', function(){
	filterPictures();
});
inputSortRat.addEventListener('change', function(){
	filterPictures();
});
inputButReset.addEventListener('click', function(e){
	e.preventDefault();
	/*inputDateMax.value = null;
	inputDateMin.value = null;
	inputRateMax.value = 10;
	inputRateMin.value = 0;
	inputSortDat.checked = true;
	inputTags.value = "";
	filterPictures();*/
	
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
	
	if ((inputRateMin.value ?? 0) != 0) curedParam = curedParam + "ratemin=" + inputRateMin.value + "&";
	if ((inputRateMax.value ?? 10) != 10) curedParam = curedParam + "ratemax=" + inputRateMax.value + "&";
	if (check(inputDateMin.value) != null) curedParam = curedParam + "datefr=" + inputDateMin.value + "&";
	if (check(inputDateMax.value) != null) curedParam = curedParam + "dateto=" + inputDateMax.value + "&";
	if (inputSortRat.checked == true)  curedParam = curedParam + "sort=" + inputSortRat.value + "&";
	if (check(inputTags.value) != null) curedParam = curedParam + "tags=" + inputTags.value + "&";

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
	return value;
}
var beggining = document.getElementById("gallery");
function movetoend(id) {
	var temp = document.getElementById("p" + id);
	beggining.appendChild(temp);
}

function filterPictures() {
	
	if (inputSortRat.checked) {
		AllPics.sort(function(b, a){
			var v = a.r-b.r;
			if (v == 0) v = b.id - a.id;
			return v;
			});
	} else {
		AllPics.sort(function(b, a){
			if (a.d>b.d) return 1;
			if (a.d<b.d) return -1;
			return v = a.id - b.id;
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

	var ratingMin = parseInt(inputRateMin.value ?? 0);
	var ratingMax = parseInt(inputRateMax.value ?? 10);
	var dateMin = check(inputDateMin.value) ?? "1000-01-01";
	var dateMax = check(inputDateMax.value) ?? "3000-01-01";
	var passedTags = {};
	
	for (i = 0; i < AllPics.length; i++) {
		var pic = AllPics[i];
		hide("p" + pic.id);
		if (pic.r < ratingMin) continue;
		if (pic.r > ratingMax) continue;
		if (pic.d < dateMin) continue;
		if (pic.d > dateMax) continue;
		
		var hasTags = true;
		for (j = 0; j < plusTags.length; j++) {
			var wantedTag = plusTags[j];
			if (pic.t.includes(wantedTag)) continue;
			hasTags = false;
			break;
		}
		if (hasTags == false) continue;
		
		var noTags = false;
		for (j = 0; j < minusTags.length; j++) {
			var wantedTag = minusTags[j];
			if (pic.t.includes(wantedTag) == false) continue;
			noTags = true;
			break;
		}
		if (noTags == true) continue;

		show("p" + pic.id);
		movetoend(pic.id);
		
		//for tags counters
		for (j = 0; j < pic.t.length; j++) {
			var tag = pic.t[j];
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
	inputRateMin.value = 0;
	inputRateMax.value = 10;
	inputDateMin.value = null;
	inputDateMax.value = null;
	inputSortDat.checked = true;
	inputSortRat.checked = false;
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
	   
	   if (key == "ratemin") {
		   inputRateMin.value = value;
	   } else if (key == "ratemax") {
		   inputRateMax.value = value;
	   } else if (key == "datefr") {
		   inputDateMin.value = value;
	   } else if (key == "dateto") {
		   inputDateMax.value = value;
	   } else if (key == "sort") {
		   if (value == "rat") {
			   inputSortRat.checked = true;
		   }
		   
	   } else if (key == "tags") {
		   inputTags.value = value;
	   }
	}
	filterPictures();
	return;
}

prefillFilter();