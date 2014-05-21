var mongodb = require('./db.js');
var markdown = require('markdown').markdown;

function Publish(name,title,publish,label){
	this.name = name;
	this.title = title;
	this.publish = publish;
	this.label = label;
}
module.exports = Publish;





Publish.prototype.save = function(callback){
	var date = new Date();
	var time = {
		date : date,
		year : date.getFullYear(),
		month :(date.getMonth() + 1) + '-' + date.getDate(),
		day :  date.getFullYear() + '-' + (date.getMonth()  + 1) + '-' +  date.getDate(),
		minute : date.getHours() + ':' + (date.getMinutes() < 10 ? (0 + date.getMinutes()) : date.getMinutes()  )
 	}

	var publish = {
			name : this.name,
			time : time,
			title : this.title,
			publish : this.publish,
			label : this.label,
			comment : []
	};



	mongodb.open('publishs',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.insert(publish,{
                safe : true
            },function(err,publish){
                if(err){
                    mongodb.close();
                    return callback(err);
                }
                mongodb.close();
                console.log("mongodb closed");
                return callback(null,publish[0]);
            })
    })
}
Publish.prototype.saveDraft = function(callback){
	var date = new Date();
	var time = {
		date : date,
		year : date.getFullYear(),
		month :(date.getMonth() + 1) + '-' + date.getDate(),
		day :  date.getFullYear() + '-' + (date.getMonth()  + 1) + '-' +  date.getDate(),
		minute : date.getFullYear() + '-' + (date.getMonth() + 1) + '-' +  date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? 0 + date.getMinutes() : date.getMinutes()  )
 	}

	var publish = {
			name : this.name,
			time : time,
			title : this.title,
			publish : this.publish,
			label : this.label
	};
	mongodb.open('drafts',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.insert(publish,{
				safe : true
			},function(err,publish){
				mongodb.close();
				if(err){
					return callback(err);
				}
				console.log("mongodb closed");
				return callback(null,publish[0]);
			});

	})
}



Publish.update = function(name,day,title,publish,callback){
	mongodb.open('publishs',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.update({
				"name" : name,
				"time.day" : day,
				"title" : title
			},{
				$set : {publish: publish}
			},function(err){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null);
			})

	});
};


Publish.classify = function(name,label,page,callback){
	mongodb.open('publishs',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if(name){
				query.name =name;
			}
			if(query){
				query.label = label;
			}
			collection.count(query,{
				skip : (page - 1) * 10,
				limit : 10
			},function(err,total){
				collection.find(query).sort({time : -1}).toArray(function(err,docs){
					mongodb.close();
					if(err){
						return callback(err);
					}
					callback(null,docs,total);
				})
			})

	});
}



Publish.getAll = function(name,callback){
	if(typeof name == 'undefined'){
		console.log('the name is undefined');
	}
	
	mongodb.open('publishs',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if(name){
				query.name = name;
			}
			collection.find(query).sort({time : -1}).toArray(function(err,docs){
				mongodb.close();
				if(err){
					return callback(err);
				}
				docs.forEach(function(doc){
					doc.publish = markdown.toHTML(doc.publish);
					doc.summary = doc.publish.substring(0,100);
				});
				callback(null,docs);
			})
	});
}
Publish.getOne = function(name,day,title,callback){
	mongodb.open('publishs',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.findOne({
				"name" : name,
				"title" : title,
				"time.day" : day
			},function(err,doc){
				mongodb.close();
				if(err) {
                    return callback(err);
                }
				if(doc){
					doc.summary = doc.publish.substring(0,500);
				}
				callback(null,doc);
			});
	});
}

Publish.getTitle = function(name,callback){
	mongodb.open('publishs',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.findOne({
				'name' : name
			},function(err,doc){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,doc);
			});
	})
}

//return the mark format
Publish.edit = function(name,day,title,callback){
	//console.log(name,day,title,callback);
	mongodb.open('publishs',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.findOne({
				"name" : name,
				"title" : title,
				"time.day" : day
				},function(err,doc){
					mongodb.close();
					if(err){
						return callback(err);
					}
					callback(null,doc);
				})
	})
}

Publish.remove = function(name,day,title,callback){
	mongodb.open('publishs',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			
			collection.remove({
				"name" : name,
				"time.day" : day,
				"title" : title
			},{
				w : 1
			},function(err){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null);
			})
	});
};


Publish.getTen = function(name,page,callback){
	mongodb.open('publishs',function(err,collection){
			if(err){
				mongodb.close();
				return  callback(err);
			}
			var query = {};
			if(name){
				query.name = name;
			}
			collection.count(query,function(err,total){
				collection.find(query,{
					skip : (page - 1) * 10,
					limit : 10
				}).sort({time : -1}).toArray(function(err,docs){
					mongodb.close();
					if(err){
						return callback(err);
					}
					// console.log(docs);
					docs.forEach(function(doc){
						doc.publish = markdown.toHTML(doc.publish);
						doc.summary = doc.publish.substring(0,100);
					})
				//	console.log('publishs',docs,total);
					callback(null,docs,total);
				});
			});

	});
}

