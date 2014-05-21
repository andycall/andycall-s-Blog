var mongodb = require('./db.js');

function User(user){
	this.username = user.username;
	this.password = user.password;
	this.email = user.email;
    this.permission = user.permission;
    this.blogTitle = user.blogTitle;
    this.blogDescription = user.blogDescription;
}

module.exports = User;

User.prototype.save = function(callback){
	//this file will be save to database
	var user = {
		username : this.username,
		password : this.password,
		email : this.email,
        permission : this.permission,
        blogTitle : this.blogTitle,
        blogDescription : this.blogDescription
	};
	// open the database
	mongodb.open('users',function(err,collection){
			if(err){ 
				mongodb.close();
				return callback(err);
			}
			collection.insert(user,{
				safe : true
			},function(err,user){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,user[0]); // success ! return the user name
			})
	})
};

User.get = function(name,callback){
	mongodb.open('users',function(err,collection){
			if(err){
				mongodb.close();
				callback(err);
			}
			collection.findOne({
		        username: name
		      }, function (err, doc) {
		        mongodb.close();
		        if (err) {
		          return callback(err);//失败！返回 err 信息
		        }
		        callback(null, doc);//成功！返回查询的用户信息
		      });
	});
};

User.getAll = function(username,callback){
    if(typeof username == 'undefined'){
        console.log("the name is undefined");
    }

    mongodb.open("users",function(err,collection){
        if(err){
            mongodb.close();
            return callback(err);
        }

        var query = {};
        if(username){
            query.username = username;
        }

        collection.find(query).sort({time : -1}).toArray(function(err,users){
            mongodb.close();
            if(err){
                return callback(err);
            }

            callback(null,users);
        });
    });
};

User.remove = function(username,callback){
    mongodb.open('users',function(err,collection){
        if(err){
            mongodb.close();
            return callback(err);
        }

        collection.remove({
            "username" : username
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

User.updatePSW = function(username, password, callback){
    mongodb.open('users',function(err,collection){
        if(err){
            mongodb.close();
            return callback(err);
        }

        collection.update({
            "username" : username
        },{
            $set : { password: password }
        }, function(err){
            mongodb.close();
            if(err){
              return callback(err);
            }
            callback(null);
        })
    })
};

User.updateGeneral = function(username, description, title, callback){
    mongodb.open('users', function(err, collection){
        if(err){
            mongodb.close();
            return callback(err);
        }

        collection.update({
            "username" : username
        },{
            $set : {description : description, title : title }
        }, function(err){
            mongodb.close();
            if(err){
               return  callback(err);
            }
            callback(null);
        });
    })
};


