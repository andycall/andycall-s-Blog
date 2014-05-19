/*
*	Created by sublime Text 2
*   Author : AndyCALL
*	Date: 2013/8/3
*/
//<![CDATA[
function $(e){
	if(typeof e !== 'string') return false;  
	var findClass = /^\./;  
	var findId = /^\#/;
	if(findId.test(e)){  // if  it is an id object
		e = e.replace('#',"");
		return document.getElementById(e);
	}
	else if(findClass.test(e)){   // if it is a class object
		if(!document.getElementsByClassName){
			e = e.replace('.','');
			return getElementsByClassName(e);
		}
		else{
			e = e.replace('.','');
			return document.getElementsByClassName(e);
		}
	}
	else{  //if it is a Tag object
		return document.getElementsByTagName(e);
	}
}

var getElementsByClass = function(searchClass,node,tag) {  //created by Dustin Diaz
        var classElements = new Array();
        if ( node == null )
                node = document;
        if ( tag == null )
                tag = '*';
        var els = node.getElementsByTagName(tag);
        var elsLen = els.length;
        var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
        for (i = 0, j = 0; i < elsLen; i++) {
                if ( pattern.test(els[i].className) ) {
                        classElements[j] = els[i];
                        j++;
                }
        }
        return classElements;
}
// add a function to window.onload 
function addLoadEvent(func){
	var oldonload = window.onload;
	if(typeof window.onload != 'function'){
		window.onload = func;
	}
	else{
		window.onload = function(){
			oldonload();
			func();
		}
	}
}

//get a element's next Element node
function getNextElement(node){
	if(node.nodeType == '1'){
		return node;
	}
	else if(node.nextSibling){ 
		return getNextElement(node.nextSibling);
	}
	else
		return null;
}

//add a class to a element
function addClass(element,value){
	if(!element.className){
		element.className = value;
	}
	else{
		newClassName = element.className;
		newClassName += " ";
		newClassName += value;
		element.className = newClassName;
	}
}

//create a new function 
function curry(fn,scrope){
	scrope = scrope || window;
	var args = [];
	for(var i= 2; i< arguments.length; i ++){
		args.push(arguments[i]);
	}

	return function(){
		var otherArgs = [];
		for(var i =0; i< arguments.length; i++){
			otherArgs.push(arguments[i]);
		}
		var argsTotal = args.concat(otherArgs);
		
		fn.apply(scrope,argsTotal);
	}

}

function writeCookie(name,value,days){
	//By default ,there is no expiration so the cookie is temporary
	var expires = "";

	//Specifying a number of days makes the cookie persistent
	if(days){
		var date = new Date();
		date.setTime(date.getTime() + day * 24 * 60 * 60 * 1000);
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
 		if(c,indexOf(searchName) == 0) return c.substring(searchName.length,c.length);
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

//]]>