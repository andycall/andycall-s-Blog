var Blog = {};

(function(){
	function ObserverList(){
		this.observerList = [];
	}

	ObserverList.prototype.Add = function(obj){
		return this.observerList.push(obj);
	}

	ObserverList.prototype.Empty = function(){
		this.observerList = [];
	}

	ObserverList.prototype.Count = function(){
		return this.observerList.length;
	}

	ObserverList.prototype.Get = function(index){
		if(index > -1 && index < this.observerList.length){
			return this.observerList[index];
		}
	}

	ObserverList.prototype.Insert = function(obj,index){
		var pointer = -1;
		if(index === 0){
			this.observerList.unshift(obj);
			pointer = index;
		}
		else if(index == this.observerList.length){
			this.observerList.push(obj);
			pointer = index;
		}
		else{
			for(var i = this.observerList.length; i >= index; i --){
				this.observerList[i] = this.observerList[i-1];
			}
			this.observerList[index] = obj;
		}
	}


	ObserverList.prototype.IndexOf = function(obj,startIndex){
		var index = startIndex || 0;
		var pointer = -1;
		while(index < this.observerList.length){
			if(this.observerList[index] == obj){
				pointer = index;
			}
			index ++;
		}
		return pointer;
	}


	ObserverList.prototype.RemoveIndexOf = function(index){
		if(!this.observerList[index]){
			return false;
		}
		if(index == 0){
			return this.observerList.shift();
		}
		else if(index == this.observerList.length){
			return this.observerList.pop();
		}
		else{
			this.observerList.splice(index,1);
		}
	}

	function extend(obj,extension){
		for(var key in obj){
			extension[key] = obj;
		}
	}

	function Subject(){
		this.observers = new ObserverList();
	}

	Subject.prototype.AddObserver = function(observer){
		this.observers.Add(observer);
	}

	Subject.prototype.RemoveObserver =  function(observer){
		this.observers.RemoveIndexOf(this.observers.IndexOf(observer));
	}

	Subject.prototype.Notify = function(context){
		var observerCount = this.observers.Count();
		for(var i = 0; i < observerCount; i ++){
			this.observers.Get(i).Update(context);
		}
	}

	function Observer(){
		this.Update = function(){}
	}


})();
