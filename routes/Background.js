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
		Publish.getAll(null,function(err,docs){
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
            isUser : false // 这里要进行判断,
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

})



router.get('/config/user', checkLogin);
router.get('/config/user', function(req,res){
    res.render("Background/config",{
        title : "Settings",
        user : req.session.user,
        success : req.flash("success").toString(),
        error : req.flash("error").toString(),
        site : settings.site,
        isUser : true // 这里要进行判断
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
            req.flash('success','the page had published successfully!');
            res.redirect('/andycall');
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