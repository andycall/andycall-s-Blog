var pubsub = {};

(function(pub){
	var topics = {};
	pub.publish = function(topic,args){
		if(topics[topic]){
			var thisTopic = topics[topic];
			thisArgs = args || [];


			for(var i = 0, j = thisTopic.length; i < j ; i ++){
				thisTopic[i].apply(pub,thisArgs);
			}
		}
	}

	pub.subscribe = function( topic, callback ){
		if(!topics[topic]){
			topics[topic] = [];
		}


		topics[ topic ].push(callback);


		return {
			topic : topic,
			callback : callback
		};
	};


	pub.unsubscribe = function(handle){
		var topic = handle.topic;

		if(topics[topic]){
			var thisTopic = topics[topic];

			for(var i = 0, j = thisTopic.length; i < j; i++ ){
				if(thisTopic[i] === handle.callback){
					thisTopic.splice(i,1);
				}
			}
		}
	}
})(pubsub);