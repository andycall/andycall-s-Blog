var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../modules/user.js');
var Publish = require('../modules/publish.js');
var Comment = require('../modules/comments.js');
var settings = require('../settings.js');
var fs = require('fs');

function checkLogin(req,res,next){
    if(!req.session.user){
        req.flash('error','not login in ');
        return res.redirect('/login')
    }
    next();
}

function checkAdmin(req, res, next){
    if(!req.session.user.permission != 'admin'){
        req.flash('error', 'Not Admin!');
        return res.redirect("/");
    }
    next();
}

function checkVar(variable){
    return Object.prototype.toString.call(variable);
}



function checkNotLogin(req,res,next){
    if(req.session.user){
        req.flash('error','already login in ');
        return res.redirect('back');
    }
    next();
}



router.get('/',function(req,res){
        var page = req.query.page ? parseInt(req.query.page) : 1;
        var name = req.query.name;
        var time = req.query.time;
        var title = req.query.title;
        var user =  "andycall";
        Publish.getTen(null,page,function(err,docs,total){
            if(err){
                docs = [];
            }
            res.render('main_page/index',{
                title : "AndyCall's blog",
                docs : docs,
                page : page,
                isFirstPage : (page - 1) == 0,
                isLastPage : ((page -1) * 10 + docs.length) == total,
                user : user,
                success : req.flash('success').toString(),
                error : req.flash('error').toString(),
                site: settings.site
            });
        });
    });

router.post('/',function(req,res){
        var date = new Date();
        var name = req.body.username || 'andycall';
        var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' +  date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? ("0" + date.getMinutes()) : date.getMinutes())
        if(req.body.content == "" && req.body.name == ''){
            req.flash('error','empty message');
            return res.redirect('back');
        }
        var comment = {
            name : req.body.name,
            day : time,
            email : req.body.email,
            content  : req.body.content
        };
        var newComment = new Comment(name,req.body.article_date,req.body.article_title,comment);
        // console.log(newComment);
        newComment.save(function(err){
            if(err){
                req.flash('error',err);
                return res.redirect('back');
            }
            req.flash('success','leave message success!');
            res.redirect('back');
        });

    });
//router.get('/Develope',function(req,res){
//        var user = "andycall";
//        var page = req.query.page ? parseInt(req.query.page) : 1;
//        Publish.classify(user,"Develope",page,function(err,docs,total){
//            if(err){
//                docs = [];
//            }
//            docs = docs || [];
//            // console.log(docs);
//            res.render("index",{
//                title : "AndyCall's blog",
//                docs : docs,
//                user : user,
//                isFirstPage : (page - 1) == 0,
//                isLastPage : ((page -1) * 10 + docs.length) == total,
//                success : req.flash('success').toString(),
//                error : req.flash('error').toString(),
//                site: settings.site
//            })
//        })
//    });
router.get('/login',checkNotLogin);
router.get('/login',function(req,res){

    User.getAll(null, function(err,user){
        if(!user[0]){
            res.redirect("/register");
        }

        res.render('login',{
            title : "Login",
            user : req.session.user,
            success : req.flash('success'),
            error : req.flash('error'),
            site : settings.site
        });

    });
});
router.post('/login',checkNotLogin);
router.post('/login',function(req,res){
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('hex');

        User.get(req.body.username,function(err,user){
            if(!user){
                req.flash('error','the username is not exist');
                return res.redirect('/login');
            }
            // console.log(user);
            if(user.password != password){
                req.flash('error','password wrong');
                return  res.redirect('/login');
            }

            req.session.user = user;
            req.flash('success','login success!');
            res.redirect('/andycall');
        })
    });

router.get("/addUser", checkNotLogin);
router.get('/addUser', checkAdmin);
router.get('/addUser', function(req,res){
        res.render("register", {
            title : "add Admin User",
            user : req.session.user,
            success : req.flash('success').toString(),
            error : req.flash('error').toString(),
            site : settings.site
        });
});

router.post('/addUser', checkNotLogin);
router.post('/addUser', checkAdmin);
router.post('/addUser', function(req,res){
    var name = req.body.username;
    var password = req.body.psw;
    var re_password = req.body.repsw;
    var email = req.body.email,
        permission = req.body.permission;

    if(password != re_password){
        req.flash('error', "the password is not fit!");
        return res.redirect("/addUser");
    }

    var md5 = crypto.createHash("md5");
    var password = md5.update(req.body.psw).digest('hex');

    var newUser = new User({
        username : name,
        password : password,
        email : email,
        permission: permission
    });

    User.get(newUser.username , function(err,user){
        if(user){
            req.flash('error','the user is already exist!');
            return res.redirect('/addUser');
        }

        newUser.save(function(err,user){
            if(err){
                req.flash('error',error);
                return res.redirect('/addUser');
            }
            req.session.user = user;
            req.flash('success','register success!');
            res.redirect('/');
        });
    });


});

router.get('/register',checkNotLogin);
router.get('/register',function(req,res){
        res.render('main_page/register',{
            title : "Register",
            user : req.session.user,
            success : req.flash('success').toString(),
            error : req.flash('error').toString(),
            site: settings.site
        });
    });


router.post('/register',checkNotLogin);
router.post('/register',function(req,res){
        var name = req.body.username;
        var password = req.body.psw;
        var re_password = req.body.repsw;
        var email = req.body.email,
            permission = req.body.permission;

        if(password != re_password){
            // console.log('error1');
            req.flash('error','the password is not fit!');
            return res.redirect('/register');
        }

        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.psw).digest('hex');

        var newUser = new User({
            username : name,
            password : password,
            email : email,
            permission: permission
        });

        //check the username is exist
        User.get(newUser.username, function(err,user){
            if(user){
                req.flash('error','the user is already exist!');
                return res.redirect('/register');
            }
            newUser.save(function(err,user){
                if(err){
                    req.flash('error',error);
                    return res.redirect('/register');
                }
                req.session.user = user;
                req.flash('success','register success!');
                res.redirect('/');
            })
        });
    });

router.get('/loginout',checkLogin);
router.get('/loginout',function(req,res){
        req.session.user = null;
        req.flash('success','login out success');
        res.redirect('/');
    });


    router.get('/upload',checkLogin);
    router.get('/upload',function(req,res){
        res.render('upload',{
            title : 'Upload',
            user : req.session.user,
            success : req.flash('success').toString(),
            error : req.flash('error').toString(),
            site : settings.site
        });
    });

    router.post('/upload',checkLogin);
    router.post('/upload',function(req,res){
        for(var i in req.files){
            if(req.files[i].size == 0){
                fs.unlinkSync(req.files[i].path);
                console.log('successfully removed an empty file!');
            }
            else{
                var target_path = './public/images/' + req.files[i].name;
                fs.renameSync(req.files[i].path,target_path);
                //console.log(target_path);
                console.log('successfully rename a file!');
            }
        }
        req.flash('success','file uploading success !');
        res.redirect('/upload');
    });
    // router.get('/:name',function(req,res){
    // 	var page = req.query.page ? parseInt(req.query.page) : 1;
    // 	User.get(req.params.name,function(err,user){
    // 		if(!user){
    // 			// req.flash('err','the user is not exist!');
    // 			// return res.redirect('/');
    // 			return res.render('404');
    // 		}
    // 		// Publish.getAll(user.username,function(err,docs){
    // 		// 	if(err){
    // 		// 		req.flash('err',err);
    // 		// 		return res.redirect('/');
    // 		// 	}
    // 		// 	console.log(docs);
    // 		// 	res.render('user',{
    // 		// 		title : req.session.user.username,
    // 		// 		docs : docs,
    // 		// 		user : req.session.user,
    // 		// 		success : req.flash('success').toString(),
    // 		// 		error : req.flash('error').toString()
    // 		// 	});
    // 		// });
    // 		Publish.getTen(user.name,page,function(err,docs,total){
    // 			if(err){
    // 				req.flash('error',err);
    // 				return res.redirec('/');

    // 			}
    // 			res.render('user',{
    // 				title : "Andycall's Blog",
    // 				docs : docs,
    // 				user : req.session.user,
    // 				page : page,
    // 				isFirstPage : (page -1 ) == 0,
    // 				isLastPage : ((page -1 ) * 10 + docs.length) == total,
    // 				success : req.flash('success').toString(),
    // 				error : req.flash('error').toString()
    // 			});
    // 		});
    // 	});
    // });

    // router.get('/:name/:day/:title',checkLogin);
    router.get('/:name/:day/:title',function(req,res){
        Publish.getOne(req.params.name,req.params.day,req.params.title,function(err,publish){
            if(checkVar(publish) === "[object Null]"|| checkVar(publish) === "[object Undefined]"){
                return res.render('404');
            }

            if(err){
                req.flash('error','err');
                return res.redirect('/');
            }
            res.render('article',{
                title : "AndyCall's blog",
                doc : publish, // the page content
                user : req.session.user, // the user
                success : req.flash('success').toString(), // success log
                error : req.flash('error').toString(), // error log,
                site : settings.site
            });
        });
    });
//	router.post('/:name/:day/:title',checkLogin);
router.post('/:name/:day/:title',function(req,res){
        var date = new Date();
        var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' +  date.getDate() + ' ' + date.getHours() + ':' + (date.getMinutes() < 10 ? 0 + date.getMinutes() : date.getMinutes())
        if(req.body.content == "" && req.body.name == ''){
            req.flash('error','empty message');
            return res.redirect('back');
        }
        var comment = {
            name : req.body.name,
            day : time,
            email : req.body.email,
            content  : req.body.content
        };
        var newComment = new Comment(req.params.name,req.params.day,req.params.title,comment);
        newComment.save(function(err){
            if(err){
                req.flash('error',err);
                return res.redirect('back');
            }
            req.flash('success','leave message success!');
            res.redirect('back');
        });

    });


router.get('/edit/:name/:day/:title',checkLogin);
router.get('/edit/:name/:day/:title',function(req,res){
        var currentUser = req.session.user;
        if(currentUser.username !== req.params.name){
            req.flash('error','permission denined');
            return res.redirect('back');
        }
        Publish.edit(currentUser.username,req.params.day,req.params.title,function(err,publish){
            if(err){
                req.flash('error',err);
                return res.redirect('/');
            }
            //console.log(publish);
            res.render('Background/edit',{
                title : "Edit",
                doc : publish,
                user : req.session.user,
                success : req.flash('success').toString(),
                error : req.flash('error').toString(),
                site : settings.site
            });
        });
    });


router.post('/edit/:name/:day/:title',checkLogin);
router.post('/edit/:name/:day/:title',function(req,res){
        var title = req.body.title;
        var publish = req.body.publish;
        Publish.update(req.params.name,req.params.day,title,publish,function(err,pub){
            var url = '/' + req.params.name + '/' + req.params.day + '/' + req.params.title;
            if(err){
                req.flash('error',err);
                res.redirect('back');
            }
            req.flash('success','update success!');
            res.redirect('/andycall');
        });
    });

router.get('/delete/:name/:day/:title',checkLogin);
router.get('/delete/:name/:day/:title',function(req,res){
        var currentUser = req.session.user;
        if(currentUser.username !== req.params.name){
            req.flash('error','permission denined');
            return res.redirect('back');
        }
        var name = req.params.name;
        var day = req.params.day;
        var title = req.params.title;
        Publish.remove(name,day,title,function(err){
            if(err){
                req.flash('error',err);
                return res.redirect('back');
            }
            req.flash('success','delete successs!');
            res.redirect('/andycall');
        });
    });


module.exports = router;
