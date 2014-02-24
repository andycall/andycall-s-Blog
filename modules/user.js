var mongodb = require('./db.js');

function User(user){
	this.username = user.username;
	this.password = user.password;
	this.email = user.email;
}

module.exports = User;

User.prototype.save = function(callback){
	//this file will be save to database
	var user = {
		username : this.username,
		password : this.password,
		email : this.email
	};
	// open the database
	mongodb.open(function(err,db){
		if(err){
			return callback(err);// error , return the error info
		}

		//read the user info
		db.collection('users',function(err,collection){
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
	})
}

User.get = function(name,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}

		//read user
		db.collection('users',function(err,collection){
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

		})
	});
}
