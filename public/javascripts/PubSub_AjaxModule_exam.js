//为jQuery添加订阅方法

$ = pubSub($);




$.subscribe('/search/tags',function(tags){
	$('#searchResults').html('Searched for:' + tags + "");
});

$.subscribe('/search/result',function(e,results){
	$('#searchResults').append("<li><p>" + results +"</p></li>")
});


$('#flickSearch').submit(function(e){
	e.preventDefault();

	var tags = $(this).find('#query').val();
	if(!tags){
		return;
	}

	$.publish('/search/tags',[$.trim(tags)]);
});


$.subscribe('/search/tags',function(tags){
	$.ajax({
		url : "/AjaxModule",
		type : "POST",
		data : {
			"tags": tags
		},
		success : 	function(data,err){
			console.log(data);
		}
	})
	
})



