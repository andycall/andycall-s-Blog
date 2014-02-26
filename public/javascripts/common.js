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

