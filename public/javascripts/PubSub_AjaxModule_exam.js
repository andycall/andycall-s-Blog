//为jQuery添加订阅方法

$ = pubSub($);




$.subscribe('/search/tags',function(e,tags){
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


$.subscribe('/search/tags',function(e,tags){
	$.getJSON('http://localhost:1500/AjaxModule',
		{tags : tags},
		function(data){
			if(!data.items.length){
				return;
		}
		$.publish('/search/resultSet',data.items);
	})
	
})



