(function(){
	var comment_box = document.getElementById('comment_box');
	comment_box.addEventListener('submit',function(e){
		e.preventDefault();
		var name = readCookie('name') || document.getElementById('name').value;
		var email = readCookie('email') || document.getElementById('email').value;
		var website = readCookie('website') || document.getElementById('website').value;
		writeCookie('name',name,30);
		writeCookie('email',email,30);
		writeCookie('website',website,30);
		e.returnValue = true;
	});

	function form_init(){
		var name = readCookie('name');
		var email = readCookie('email');
		var website = readCookie('website');

		document.getElementById('name').value = name;
		document.getElementById('email').value = email;
		document.getElementById('website').value = website;
	}

	form_init();

})();