(function(){

	function scrollY() {
		return window.pageYOffset || docElem.scrollTop;
	}

	// from http://stackoverflow.com/a/11381730/989439
	function mobilecheck() {
		var check = false;
		(function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
		return check;
	}


	var docElem = document.documentElement;


	var support = Modernizr.csstransitions,

	transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'msTransition': 'MSTransitionEnd',
			'transition': 'transitionend'
		},
		transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
		docscroll = 0,
		clickEvent = mobilecheck() ? "touchstart" : "click";

	function createComment(user,day,content){
		var comment = document.createElement('li');
		comment.classList.add('comment');
		var commentTemplate = "<div class='comment-body'>" +
									"<div class='comment-author'>" +
										"<!-- <span class='reply'>回复</span> -->" + 
										"<img src='" + settings.site + "/images/user.png' alt='User.png'>" +
										"<span class='user'>" + user + "</span>"+
										"<span class='says'>说道</span>" + 
									"</div>" + 
									"<div class='comment-date'>"+
										"<span class='day'>" +  day +  "</span>" + 
									"</div>" + 
									"<div class='comment-content'>"+content + "</div>" + 
								"</div>";

		comment.innerHTML = commentTemplate;

		return comment;
	}


	function init(){
		var turn_right = convertToArray(document.querySelectorAll('.turn_right'));
		var turn_left = document.querySelector('.turn_left');
		var comment = [];//评论缓存数组
		var publish = [];//文章缓存数组
		var commentFrag = document.createDocumentFragment();//评论块缓存
		var commentList = document.querySelector('.comment-list');
		var commentLength = document.getElementById('comments');
		convertToArray(document.querySelectorAll('.article')).forEach(function(value){
			var object = {
				time : value.getElementsByClassName('art_day')[0].innerHTML,
				title : value.getElementsByClassName('art_title')[0].innerHTML,
				publish : value.getElementsByClassName('art_publish')[0].innerHTML
			};
			publish.push(object);
		});
		convertToArray(document.querySelectorAll('.content')).forEach(function(value){
			comment.push(JSON.parse(value.dataset.comment));
		});
		var main = document.querySelector('.main');
		main.style.right = "0";
		var nowScroll = 0;
		turn_right.forEach(function(value){
			value.addEventListener(clickEvent,function(){
				main.style.right = "100%";
				var index = value.dataset.index;
				document.querySelector("input[name='article_date']").value = publish[index].time;
				document.querySelector("input[name='article_title']").value = publish[index].title;
					for(var j = 0,sections = comment[index].length; j < sections; j ++ ){
						var name = comment[index][j].name;
						var day  = comment[index][j].day;
						var content =  comment[index][j].content;
						var commentPiece = createComment(name,day,content); // 获取评论块HTML
						commentFrag.appendChild(commentPiece);
					}
				while(commentList.firstChild.nodeType === 3 || commentList.firstChild.getAttribute('class')== 'comment' ){
					commentList.removeChild(commentList.firstChild);
				}
				console.log(comment[index].length);
				commentLength.innerHTML = comment[index].length + "  Comments";
				commentList.insertBefore(commentFrag,commentList.firstChild);
				nowScroll = scrollY();
				window.scroll(0,0);		
			});
		});

		turn_left.addEventListener(clickEvent,function(){
			main.style.right = "0";
			setTimeout(function(){
				window.scroll(0,nowScroll);
			});
		});
	}

	init();


	// function copyNode(node,type){
	// 	var cache = [];
	// 	var parent = document.createElement(type);
	// 	var point = node.firstChild;
	// 	while(point.firstChild){
	// 		cache.push(point.firstChild);
	// 		console.log(point.firstChild);
	// 	}
	// 	parent.innerHTML = cache.join("");

	// 	return parent;
	// }





})();	


