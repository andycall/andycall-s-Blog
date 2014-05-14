var settings = require('../settings.js'),
	DB = require("mongodb").Db,
	Connection  = require('mongodb').Connection,
	Server = require('mongodb').Server;

var Db = new DB(settings.DB,new Server(settings.host, Connection.DEFAULT_PORT), { safe : true });

var mongodb = {};
mongodb.open = function(callback){
	Db.open(function(err,db){



		if(!err){
			console.log('Connected to database');
            if(settings.username !== "" && settings.password !== ""){
                try{
                    db.authenticate(settings.username,settings.password,function(err,res){
                        if(!err){
                            console.log('Authenticated');
                            callback(err,db);
                        }
                        else{
                            console.log('Error in authenticate');
                            console.log(err);
                        }
                    })
                }
                catch (e){
                    throw  new Error(e);
                }
            }
            else{
                callback(err,db);
            }

		}
		else{
			console.log('Error in open');
			console.log(err);
		}
	})
}
mongodb.close = function(){
	Db.close();
}
module.exports = mongodb;