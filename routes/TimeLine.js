var crypto = require('crypto');
var User = require('../modules/user.js');
var Publish = require('../modules/publish.js');
var Comment = require('../modules/comments.js');
var settings = require('../settings.js');
var fs = require('fs');


module.exports = function(app){
	app.get('/TimeLine',function(req,res){
		res.render('Timeline_style/index',{
			site : "http://localhost:1500"
		})
	});
	app.get('/FlexBox',function(req,res){
		res.render('Timeline_style/FlexBox',{
			site : "http://localhost:1500"
		});
	});



}