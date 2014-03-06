function writeCookie(name,value,days){
	//By default ,there is no expiration so the cookie is temporary
	var expires = "";

	//Specifying a number of days makes the cookie persistent
	if(days){
		var date = new Date();
		date.setTime(date.getTime() + date * 24 * 60 * 60 * 1000);
		expires = '; expries=' + date.toGMTString();
	}


	document.cookie = name + '=' + value + expires + '; path=/';
 }

 function readCookie(name){
 	//find the specified cookie and return its value
 	var searchName = name + '=';
 	var cookie = document.cookie.split(';');
 	for(var i =0; i< cookie.length; i++){
 		var c = cookie[i];
 		while(c.charAt(0) == " ") c = c.substring(1,c.length);
 		if(c.indexOf(searchName) == 0) return c.substring(searchName.length,c.length);
 	}
 	return null;
 }

 function eraseCookie(name){
 	writeCookie(name,"",-12);
 }

function moveElement(elementId,final_x,final_y,interval){
	if(!document.getElementById) return false;
	if(!document.getElementById(elementId)) return false;
	var elem = document.getElementById(elementId);
	var xpos = parseInt(elem.style.left);
	var ypos = parseInt(elem.style.top);
	if(xpos == final_x && ypos == final_y) return true;
	if(xpos < final_x){
		xpos++;
	}
	if(xpos > final_x) xpos--;
	if(ypos < final_y) ypos++;
	if(ypos > final_y) ypos--;
	elem.style.left = xpos + 'px';
	elem.style.top = ypos + 'px';
	var repeat =  "moveElement('" + elementId + "'," + final_x + "," + final_y + "," + interval + ")";
	movement = setTimeout(repeat,interval);
}
