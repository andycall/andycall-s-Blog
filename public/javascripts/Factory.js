

var parent = document.querySelector('.blog-main');
var RandomBox = function(){
	'use strict';
	var fragment = document.createDocumentFragment();
/* 
   =======================================================
    公共用法
   =======================================================
*/
	//获取适合当前浏览器的属性
	var pfx = (function () {
        var style = document.createElement('dummy').style,
            prefixes = 'Webkit Moz O ms Khtml'.split(' '),
            memory = {};
        
        return function ( prop ) {
            if ( typeof memory[ prop ] === "undefined" ) {
                
                var ucProp  = prop.charAt(0).toUpperCase() + prop.substr(1),
                    props   = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(' ');
                
                memory[ prop ] = null;
                for ( var i in props ) {
                    if ( style[ props[i] ] !== undefined ) {
                        memory[ prop ] = props[i];
                        break;
                    }
                }
            
            }
            
            return memory[ prop ];
        };
    
    })();
    //遍历CSS属性
    var css = function ( el, props ) {
        var key, pkey;
        for ( key in props ) {
            if ( props.hasOwnProperty(key) ) {
                pkey = pfx(key);
                if ( pkey !== null ) {
                    el.style[pkey] = props[key];
                }
            }
        }
        return el;
    };
/*
  ==============================================
  END
  ==============================================
*/

    function getClientWidth(percentage){
    	return document.body.clientWidth * percentage;
    }
    function getClientHeight(percentage){
    	return document.body.clientHeight * percentage;
    }

	function getRandom(min,max){
		return min + (max - min) * Math.random();
	}

	


	function createMainContent(left,top,background){
		var contentBox = document.createElement('div');
		var background = background || "#fff";
		var props = {
			left : left + 'px',
			top : top + 'px',
			background : background
		}
		css(contentBox,props);
		contentBox.classList.add('main-content');
		return contentBox;
	}
	// 位置数组
	var position = [
		[0,0,0],
		[0,0,0],
		[0,0,0]
	];
	// 构建散列坐标
	var init = function(){
		for(var i = 0; i < 3; i ++){
			for(var j = 0; j< 3; j ++){
				var borderLeft = (j  %  3) * getClientWidth(0.32);
				// var borderRight = getClientWidth(0.015) + getClientWidth(0.3);
				var borderTop = (i   %  3 )* getClientHeight(0.3);
				var left = borderLeft +  getRandom(0,getClientWidth(0.015));
				var top = borderTop + getRandom(0,getClientHeight(0.03));
				var newBox = createMainContent(left,top);
				fragment.appendChild(newBox);
				position[i][j] = left + " " + top;
			}
		}
		parent.appendChild(fragment);
	}
	var getPosition = function(){
		return position;
	}
	var clear = function(){
		while(parent.firstChild){
			parent.removeChild(parent.firstChild);
		}
	}	
	var refresh = function(){
		clear();
		init();
	}
	// console.log(position);

	return {
		init : init,
		getPosition : getPosition,
		clear: clear,
		refresh : refresh
	}
}(parent);






