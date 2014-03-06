
var crypto = require('crypto');
var User = require('../modules/user.js');
var Publish = require('../modules/publish.js');
var Comment = require('../modules/comments.js');
var settings = require('../settings.js');
var fs = require('fs');


module.exports = function(app){
	function checkLogin(req,res,next){
		if(!req.session.user){
			req.flash('error','not login in ');
			return res.redirect('/login')
		}
		next();
	}	
	app.get('/andycall',checkLogin);
	app.get('/andycall',function(req,res){
		var page = req.query.page ? parseInt(req.query.page) : 1;
		Publish.getAll(null,function(err,docs){
			if(err){
				docs = [];
			}
			console.log(docs);
			res.render('background',{
				title : "AndyCall's blog",
				docs : docs,
				page : page,
				user : req.session.user,
				success : req.flash('success').toString(),
				error : req.flash('error').toString(),
				site : settings.site
			});
		});
	});
}