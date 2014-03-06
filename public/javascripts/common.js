/* 
	==============================
	通用工具函数库
	==============================
*/

function extend(obj,extension){
		for(var key in obj){
			extension[key] = obj[key];
		}
	}

function convertToArray(obj){
	return Array.prototype.splice.call(obj,0);
}


function scrollY() {
		return window.pageYOffset || docElem.scrollTop;
	}
/*
	================================================
	兼容的类添加方法
	使用说明： 
	Example:
	var p = document.createElement('p');
	p.hasClass('hello') //判断p标签是否有hello类
	p.addClass('hello') //添加hello类到p标签里
	p.removeClass('hello') //从p标签里删除hello类
	================================================
*/
(function(window){


"use strict";

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

var hasClass, addClass, removeClass;




if('classList' in document.documentElement){
	Element.prototype.hasClass = function(elem,c){
		return elem.classList.contain(c);
	};

	Element.prototype.addClass = function(elem,c){
		return elem.classList.add(c);
	};
	Element.prototype.removeClass = function(elem,c){
		if(!elem.hasClass(c)){
			return elem.classList.remove(c);
		}
		else{
			return 'Invaild ClassName';
		}
	}
}
else{
	Element.prototype.hasClass = function(elem,c){
		return classReg(c).test(elem.className);
	};

	Element.prototype.addClass = function(elem,c){
		if( !elem.hasClass(c)){
			elem.className = elem.className + ' ' + c;
		}
	};
	Element.prototype.removeClass = function(elem,c){
		elem.className = elem.className.replace(classReg(c)," ");
	}
}



})();


