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

router.get('/andycall',checkLogin);
router.get('/andycall',function(req,res){
    var page = req.query.page ? parseInt(req.query.page) : 1;
		Publish.getAll(req.session.user.username,function(err,docs){
			if(err){
				docs = [];
			}
			console.log(docs);
			res.render('Background/background',{
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


router.post("/andycall", checkLogin);
router.post('/andycall', function(req,res){
    var page = req.query.page ? parseInt(req.query.page) : 1;
    Publish.getAll(null,function(err,docs){
        if(err){
            docs = [];
        }
        res.json(docs);
    });

});

router.get('/config', checkLogin);
router.get('/config', function(req,res){
    res.redirect("/config/general");
});


router.get('/config/manage', checkLogin);
router.get('/config/manage', function(req , res){
    if(req.session.user.permission < 7){
        req.flash('error',"Not Authorization ");
        return res.redirect('back');
    }

    User.getAll(null, function(err,users){
        if(err){
            req.flash('error', err);
            return res.redirect("back");
        }
        res.render('Background/config',{
            title : "AndyCall's blog",
            users : users,
            user : req.session.user,
            success : req.flash("success").toString(),
            error : req.flash("error").toString(),
            site : settings.site,
            isUser : false, // 这里要进行判断,
            isAddUser : false,
            isManage : true
        });

    });
});

router.get('/deleteUser/:name', checkLogin);
router.get('/deleteUser/:name', function(req, res){
    if(req.session.user.permission < 7){
        req.flash('error',"Only admin can delete user");
        return res.redirect("back");
    }

    var username = req.params.name;

    User.remove(username, function(err){
        if(err){
            req.flash('error', err);
            return res.redirect('back');
        }

        req.flash('success', "the User " + username + " had been removed");
        res.redirect('back');
    });



});



router.get('/config/general', checkLogin);
router.get('/config/general', function(req,res){
    User.get(req.session.user.username, function(err,docs){
        if(err){
            docs = [];
        }
        console.log(docs);
        res.render('Background/config',{
            title : "AndyCall's blog",
            docs : docs,
            user : req.session.user,
            success : req.flash("success").toString(),
            error : req.flash("error").toString(),
            site : settings.site,
            isUser : false, // 这里要进行判断,
            isAddUser : false,
            isManage : false
        });
    });
});

router.post('/config/general', checkLogin);
router.post('/config/general', function(req, res){
    var description = req.body.description,
        title = req.body.title;

    User.updateGeneral(req.session.user.username, description, title, function(err){
        if(err){
            req.flash("error", err);
            res.redirect('back');
        }

        req.flash('success',"update success!");
        res.redirect("/andycall");
    });

});

router.get('/config/addUser', checkLogin);
router.get('/config/addUser', function(req, res){
    res.render("Background/config",{
        title : "Settings",
        user : req.session.user,
        success : req.flash("success").toString(),
        error : req.flash("error").toString(),
        site : settings.site,
        isUser : false, // 这里要进行判断
        isAddUser : true,
        isManage: false
    });
});

router.post('/config/addUser', checkLogin);
router.post('/config/addUser', function(req, res){
    // check permission
    if(req.session.user.permission < 7){
        req.flash('error', "authorization Error");
        console.log(req.session.user);
        return res.redirect("back");
    }

    var newUserName = req.body.newUsername,
        UserGroup = req.body.newUserGroup,
        Userpsw = req.body.UserPassword,
        UserEmail = req.body.UserEmail;

    var md5 = crypto.createHash("md5");

    Userpsw = md5.update(Userpsw).digest('hex');

    var newUser = new User({
        username : newUserName,
        password : Userpsw,
        email : UserEmail,
        permission : UserGroup,
        score : 0
    });

    User.get(newUser.username , function(err,user){
        if(user){
            req.flash('error','the user is already exist!');
            return res.redirect('/addUser');
        }
        newUser.save(function(err, name){

            if(err){
                req.flash('error', err);
                return res.redirect("back");
            }

            req.flash('success', "New User added");
            console.log(err, name);
            res.redirect("/andycall");
        });
    });

});



router.get('/config/user', checkLogin);
router.get('/config/user', function(req,res){
    res.render("Background/config",{
        title : "Settings",
        user : req.session.user,
        success : req.flash("success").toString(),
        error : req.flash("error").toString(),
        site : settings.site,
        isUser : true, // 这里要进行判断
        isAddUser : false
    });
});


router.post('/config/user', checkLogin);
router.post('/config/user', function(req, res){
    var oldPassword = req.body.oldPassword,
        newPassword = req.body.newPassword,
        verifPassword = req.body.verifPassword;

    var md5 = crypto.createHash("md5");
    oldPassword = md5.update(oldPassword).digest("hex");


    if(oldPassword != req.session.user.password){
        req.flash("error", "Password error!");
        res.redirect("back");
    }


    if(newPassword != verifPassword){
        req.flash('error', "verify password error!");
        res.redirect("back");
    }

    var md6 = crypto.createHash('md5');
    newPassword = md6.update(newPassword).digest("hex");

    console.log(oldPassword);
    User.updatePSW(req.session.user.username, newPassword, function(err){
        if(err){
            req.flash("error", err);
            res.redirect("back");
        }

        req.flash("success","change password success!");
        res.redirect("/andycall");

    });

});



router.get('/publish',checkLogin);
router.get('/publish',function(req,res){
    res.render('Background/publish',{
        title : "Publish",
        user : req.session.user,
        success : req.flash('success').toString(),
        error : req.flash('error').toString(),
        site : settings.site
    });
});
router.post('/publish',checkLogin);
router.post('/publish',function(req,res){
    var name = req.session.user.username;
    var title = req.body.title;
    var content = req.body.publish;
    var label = req.body.label;
    var saveDraft = req.body.saveDraft;
    saveDraft = saveDraft || 'off';
    // console.log(saveDraft);
    var newPublish = new Publish(name,title,content,label);
    // console.log(newPublish);
    if(saveDraft == "off"){
        newPublish.save(function(err,content){
            if(err){
                req.flash('error',err);
                return res.redirect('/publish');
            }
            User.addScroe(req.session.user.username, function(err){
                if(err){
                    req.flash("error", err);
                    return res.redirect("back");
                }
                console.log('123');
                req.flash('success','the page had published successfully!');
                res.redirect('/andycall');
            });

        });
    }

    else{
        newPublish.saveDraft(function(err,content){
            if(err){
                req.flash('error',err);
                return res.redirect('/publish');
            }
            req.flash('success','the draft had saved');
            res.redirect('/andycall');
        });
    }

});



router.get('/userAdmin',checkLogin);

module.exports = router;