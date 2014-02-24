/*
 ===========================================
  数据缓存数组
 ============================================
*/

var shortage = (function(){
	function shortage(){
		this.shortages = [];
	};

	shortage.prototype.Add = function(obj){
		this.shortages.push(obj);
	}

	shortage.prototype.Empty = function(){
		this.shortages = [];
	}

	shortage.prototype.Count = function(){
		return this.shortages.length;
	}

	shortage.prototype.Get = function(index){
		if(index > -1 && index < this.shortages.length){
			return this.shortages[index];
		}
	}

	shortage.prototype.Insert = function(obj,index){
		var pointer = -1;
		if(index === 0){
			this.shortages.unshift(obj);
			pointer = index;
		}
		else if(index == this.shortages.length){
			this.shortages.push(obj);
			pointer = index;
		}
		else{
			for(var i = this.shortages.length; i >= index; i --){
				this.shortages[i] = this.shortages[i-1];
			}
			this.shortages[index] = obj;
		}
	}


	shortage.prototype.IndexOf = function(obj,startIndex){
		var index = startIndex || 0;
		var pointer = -1;
		while(index < this.shortages.length){
			if(this.shortages[index] == obj){
				pointer = index;
			}
			index ++;
		}
		return pointer;
	}


	shortage.prototype.RemoveIndexOf = function(index){
		if(!this.shortages[index]){
			return false;
		}
		if(index == 0){
			return this.shortages.shift();
		}
		else if(index == this.shortages.length){
			return this.shortages.pop();
		}
		else{
			this.shortages.splice(index,1);
		}
	}


	
	return shortage;
})();