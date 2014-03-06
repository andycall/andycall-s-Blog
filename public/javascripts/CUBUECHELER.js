/* CWBUECHELER Main ================================================== */

var testme;

// Document Ready ===================================
$(document).ready(function() {

	// Show/Hide Menu
	$('#linkMainMenu').on('click', function(e){
		e.preventDefault();
		$('#listMainMenu').toggle();
	})

	//Embed Tumblr Blog
	if ($('#myposts').length){

		$('#myposts').embedTumblr('http://api.tumblr.com/v2/blog/cwbuecheler.tumblr.com/posts/?api_key=gcvX0Fv0c10XQLAd5XTE6rPOMa0lP6RrfiABmc5yPF8GWp7YCW', {
			postsPerPage: 5,
			pagination: false,
			currentPage: 1,
			loading: '<p class="loading">Loading...</p>',
			error: '<h4>Error!</h4><p>There was an error accessing the Tumblr API</p>'
		});

		// Show Post Content
		$('#myposts').on('click', 'a.linkshowpost', function(e) {
			var thisPostID =  '#' + $(this).attr('data-thispost');
			if($('.content').width() < 501 && $(thisPostID + ' .postcontent').is(":hidden")) {
				e.preventDefault();
				$(thisPostID + ' .postcontent').show();
				$(thisPostID + ' .showpostlinkwrap').hide();
			}
		});

	};


	//Embed DrinkShouts
	if ($('#drinkshouts').length) {

		$('#drinkshouts').embedTumblr('http://api.tumblr.com/v2/blog/drinkshouts.com/posts/?api_key=gcvX0Fv0c10XQLAd5XTE6rPOMa0lP6RrfiABmc5yPF8GWp7YCW', {
			postsPerPage: 1,
			pagination: false,
			currentPage: 1,
			loading: '<p class="loading">Loading...</p>',
			error: '<h4>Error!</h4><p>There was an error accessing the Tumblr API</p>'
		});

		// Show Post Content
		$('#drinkshouts').on('click', 'a.linkshowpost', function(e) {
			e.preventDefault();
			var thisPostID =  '#' + $(this).attr('data-thispost');
			$(thisPostID + ' .postcontent').show();
		});

	};

	// Beer Page Show More
	if ($('.beerlist').length) {
		$('.beerlist').on('click', 'a.morelink', function(e) {
			e.preventDefault();
			var thisBeerDiv = $(this).attr('data-morediv');
			$(thisBeerDiv).show();
			$(this).parent('span').hide();
		})
	};

	// Copyright Date
	if ($('#copydate').length) {
		$("#copydate").html(copyYear());
	};

	// Contact Form
	if ($('#contactsubmit').length) {
		$('#contactsubmit').click(function(e) {
			e.preventDefault();
			var contactName = $("#contactname").val();
			var contactEmail = $("#contactemail").val();
			var contactComment = $("#contactmessage").val();
			var contactCaptcha = $("#recaptcha_challenge_field").val();
			if (validateContact(contactName,contactEmail,contactComment,contactCaptcha) == true) {
				bodyContent = $.ajax({
					url: "verify.php",
					global: false,
					type: "POST",
					data: ({recaptcha_challenge_field : $("#recaptcha_challenge_field").val(), recaptcha_response_field : $("#recaptcha_response_field").val()}),
					dataType: "html",
					async:false,
					success: function(msg){
						if (msg > 0) {
							// All Good. Send It.
							$('#catch1').val('1');
							$('#catch2').val('1');
							$('#cwbcontact').submit();
						}
						else {
							alert("Sorry, the captcha text is incorrect. Please try again.");
						}
					}
				}).responseText;
			}
			else {
				alert("Please fill in all the fields");
			}
		});
	};

});

// Functions ========================================

function copyYear() {
	var d=new Date();
	return d.getFullYear();
}

// Validate Contact Form
function validateContact(contactName,contactEmail,contactBody,contactCaptcha) {
	var catchError = 0;
	if (contactName == "") { catchError = catchError + 1; }
	if (contactEmail == "") { catchError = catchError + 1; }
	if (contactEmail == "") { catchError = catchError + 1; }
	if (contactCaptcha == "") { catchError = catchError + 1; }
	if (catchError > 0) {
		return false;
	}
	else {
		return true;
	}
}


/* Plugins =========================================================== */


/* Tumblr API read-only plugin for snagging blog posts. Based on
work by Ian Ainley - https://github.com/Iaaan/jQuery-plugin-for-Tumblr-API */

/*
jQuery plugin for embedding Tumblr via Tumblr API read-only implementation.
For more info on the Tumblr API, please visit http://www.tumblr.com/docs/en/api/v2
2011 ian.ainley (@ gmail)
Modified 2013 by Christopher Buecheler
*/

(function ($) {

var windowWidth = $(window).width();
var stringCut = 0;
if (windowWidth < 380) {
	stringCut = 25;
}
else if (windowWidth < 500) {
	stringCut = 30;
}
else if (windowWidth < 800) {
	stringCut = 35;
}
else {
	stringCut = 40;
}

$.fn.embedTumblr = function (APIKey, options) {
	return this.each(function(){
		var target = $(this);

		if (target.data('embedTumblr')) return;

		var tumblrPosts = new AccessTumlbrApi(target, APIKey, options);

		target.data('embedTumblr', tumblrPosts);

		tumblrPosts.init();
	});
};

$.fn.embedTumblr.defaults = {
	postsPerPage: 3,
	pagination: true,
	currentPage: 1,
	loading: '<p>Loading...</p>',
	previousBtn: '&laquo; Prev',
	nextBtn: 'Next &raquo;',
	error: '<h2>Error!</h2><p>There was an error accessing the Tumblr API.</p>'
};

function AccessTumlbrApi(target, APIKey, options){
	var s = this;

	s.settings = $.extend({}, $.fn.embedTumblr.defaults, options);

	/*** POSTS ***/
	var formatPosts = function (blog, data) {
		var frag = $("<div />");

		$.each(data.response.posts, function () {
			var postType = this.type;
			var thisPost = $("<article class='post'/>");
			var mnames = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
			var d = new Date(this.timestamp * 1000);
			var curr_date = d.getDate();
			var curr_month = d.getMonth();
			var curr_year = d.getFullYear();
			var postDate = mnames[curr_month] + ' ' + curr_date + ', ' + curr_year;
			var linkURL = this.post_url;

			switch (postType) {

			/*** AUDIO POST ***/
			case "audio":
				var audioTitle = 'AUDIO: ' + this.artist + ' - ' + this.track_name,
					imgSRC = this.album_art ? '<img src="' + this.album_art + '"/>' : " ";

				thisPost.addClass('audio-post')
						.attr('id', 'post' + this.id)
						.append(
							'<p class="post-date">' + postDate + '</p>',
							'<h4><a href="' + linkURL + '" class="linkshowpost" data-thispost="post' + this.id + '" target="_blank">' + audioTitle + '</a></h4>',
							'<div class="postcontent">' + imgSRC + this.player + this.caption + '</div>',
							'<span class="showpostlinkwrap" data-thispost="post' + this.id + '"><a href="#" title="Show Post Content" class="linkshowpost" data-thispost="post' + this.id + '">Show Post</a> &bull; </span>',
							'<a href="' + linkURL + '" target="_blank" class="viewontumblr">View on Tumblr</a>'
						);
				frag.append(thisPost);
				break; /*** END AUDIO POST***/

			/*** TEXT POST ***/
			case "text":
				thisPost.addClass('text-post')
						.attr('id', 'post' + this.id)
						.append(
							'<p class="post-date">' + postDate + '</p>',
							'<h4><a href="' + linkURL + '" class="linkshowpost" data-thispost="post' + this.id + '" target="_blank">' + this.title + '</a></h4>',
							'<div class="postcontent">' + this.body + '</div>',
							'<span class="showpostlinkwrap" data-thispost="post' + this.id + '"><a href="#" title="Show Post Content" class="linkshowpost" data-thispost="post' + this.id + '">Show Post</a> &bull; </span>',
							'<a href="' + linkURL + '" target="_blank" class="viewontumblr">View on Tumblr</a>'
						);
				frag.append(thisPost);
				break; /*** END TEXT POST***/

			/*** PHOTO POST ***/
			case "photo":
				testme = this.photos;
				var photos = this.photos,
					photoContainer = $('<div class="tumblr-photos" />');

				for (i = 0; i < photos.length; i++) {
					var figure = $('<figure />');
					// Check for photo size options. Prevents really large original images from being called.
					if (photos[i].alt_sizes[0].width >= 1000) {
						var photoSizeURL = photos[i].alt_sizes[1].url;
					}
					else {
						var photoSizeURL = photos[i].original_size.url;
								console.log(photoSizeURL);
					}
					if (photos.length > 1) {
						photoContainer.addClass("multi-photo");
					}
					if (photos[i].caption != "") {
						var caption = $('<figcaption />');
						caption.append(photos[i].caption);
					} else {
						var caption = "";
					}
					figure.append('<a href="' + photos[i].original_size.url + '" target="_blank" title="' + photos[i].caption + '"><img src="' + photoSizeURL + '"/></a>', caption);
					photoContainer.append(figure);
				}

				var thisPostContent = $('<div class="postcontent" />');
				thisPostContent.append(photoContainer, this.caption);
				var snippet = this.caption;
				snippet = $(snippet).text();
				snippet = snippet.substring(0,stringCut);

				thisPost.addClass('photo-post')
						.attr('id', 'post' + this.id)
						.append(
							'<p class="post-date">' + postDate + '</p>',
							'<h4><a href="' + linkURL + '" class="linkshowpost" data-thispost="post' + this.id + '" target="_blank">Photo - <span class="snippet">'+ snippet + '&hellip;</span></a></h4>',
							thisPostContent,
							'<span class="showpostlinkwrap" data-thispost="post' + this.id + '"><a href="#" title="Show Post Content" class="linkshowpost" data-thispost="post' + this.id + '">Show Post</a> &bull; </span>',
							'<a href="' + linkURL + '" target="_blank" class="viewontumblr">View on Tumblr</a>'
						);
				frag.append(thisPost);
				break; /*** END PHOTO POST***/

			/*** QUOTE POST ***/
			case "quote":

				var snippet = this.text;
				//snippet = $(snippet).html();
				snippet = snippet.substring(0,stringCut);

				thisPost.addClass('quote-post')
						.attr('id', 'post' + this.id)
						.append(
							'<p class="post-date">' + postDate + '</p>',
							'<h4><a href="' + linkURL + '" class="linkshowpost" data-thispost="post' + this.id + '" target="_blank">Quote - <span class="snippet">'+ snippet + '&hellip;</span></a></h4>',
							'<div class="postcontent">' + '<blockquote class="quote-text">' + this.text + '</blockquote>' + '<p class="quote-author"> &#8212; ' + this.source + '</p>' + '</div>',
							'<span class="showpostlinkwrap" data-thispost="post' + this.id + '"><a href="#" title="Show Post Content" class="linkshowpost" data-thispost="post' + this.id + '">Show Post</a> &bull; </span>',
							'<a href="' + linkURL + '" target="_blank" class="viewontumblr">View on Tumblr</a>'
						);
				frag.append(thisPost);
				break; /*** END QUOTE POST***/

			/*** VIDEO POST ***/
			case "video":

				var snippet = this.caption;
				snippet = $(snippet).text();
				snippet = snippet.substring(0,stringCut);

				thisPost.addClass('video-post')
						.attr('id', 'post' + this.id)
						.append(
							'<p class="post-date">' + postDate + '</p>',
							'<h4><a href="' + linkURL + '" class="linkshowpost" data-thispost="post' + this.id + '" target="_blank">Video - <span class="snippet">'+ snippet + '&hellip;</span></a></h4>',
							'<div class="postcontent">' + this.player[2].embed_code + this.caption + '</div>',
							'<span class="showpostlinkwrap" data-thispost="post' + this.id + '"><a href="#" title="Show Post Content" class="linkshowpost" data-thispost="post' + this.id + '">Show Post</a> &bull; </span>',
							'<a href="' + linkURL + '" target="_blank" class="viewontumblr">View on Tumblr</a>'
						);
				frag.append(thisPost);
				break; /*** END VIDEO POST ***/

			/*** LINK POST ***/
			case "link":
				var description;

				if (this.description){
					description = this.description;
				} else {
					description = "No Description";
				}

				var snippet = this.description;
				snippet = $(snippet).text();
				snippet = snippet.substring(0,stringCut);

				thisPost.addClass('link-post')
						.attr('id', 'post' + this.id)
						.append(
							'<p class="post-date">' + postDate + '</p>',
							'<h4><a href="' + linkURL + '" class="linkshowpost" data-thispost="post' + this.id + '" target="_blank">Link - <span class="snippet">'+ snippet + '&hellip;</span></a></h4>',
							'<div class="postcontent">' + '<h5><a href="' + this.url + '">' + this.title + '</a></h5>' + description + '</div>',
							'<span class="showpostlinkwrap" data-thispost="post' + this.id + '"><a href="#" title="Show Post Content" class="linkshowpost" data-thispost="post' + this.id + '">Show Post</a> &bull; </span>',
							'<a href="' + linkURL + '" target="_blank" class="viewontumblr">View on Tumblr</a>'
						);
				frag.append(thisPost);
				break; /*** END LINK POST ***/

			/*** CHAT POST ***/
			case "chat":
				thisPost.addClass('chat-post')
						.attr('id', 'post' + this.id)
						.append(
							'<p class="post-date">' + postDate + '</p>',
							'<h4><a href="' + linkURL + '" class="linkshowpost" data-thispost="post' + this.id + '" target="_blank">Chat</a></h4>'
						);

				var thisCollection = $('<div />');

				for (i = 0; i < this.dialogue.length; i++){
					thisCollection.append(
						'<span class="chat-post-name">' + this.dialogue[i].name + '</span>',
						'<p class="chat-post-phrase">' + this.dialogue[i].phrase + '</p>'
					);
				}

				var thisPostContent = $('<div class="postcontent" />');
				thisPostContent.append(thisCollection);

				thisPost.append(
					thisPostContent,
					'<span class="showpostlinkwrap" data-thispost="post' + this.id + '"><a href="#" title="Show Post Content" class="linkshowpost" data-thispost="post' + this.id + '">Show Post</a> &bull; </span>',
					'<a href="' + linkURL + '" target="_blank" class="viewontumblr">View on Tumblr</a>'
				);

				frag.append(thisPost);
				break; /*** END CHAT POST ***/
			}
		});

		blog.append(frag);
	} /*** END POSTS ***/

	/***  PAGINATION ***/
	var createPagination = function (target, APIKey, data, postsPerPage, currentPage) {
		if (s.settings.pagination === true) {
			var paginationContainer = $("<div class='blog-pagination clearfix'></div>");

			   if (Math.ceil(data.response.total_posts / postsPerPage) !== currentPage) {
				   var nextBtn = $("<div class='blog-btn next'>" + s.settings.nextBtn + "</div>").css({
					   "cursor": "pointer"
				   });
				   paginationContainer.append(nextBtn);
			   }
			   if (currentPage !== 1) {
				   var prevBtn = $("<div class='blog-btn prev'>" + s.settings.previousBtn + "</div>").css({
					   "cursor": "pointer"
				   });
				   paginationContainer.append(prevBtn);
			   }

			target.append(paginationContainer);
			bindPagination(target, APIKey);
		}
	}

	var bindPagination = function (target, APIKey) {
		$('.blog-btn').on('click.embedTumblr', function(){
			if ($(this).hasClass('next')) {
				s.settings.currentPage++;
			}
			if ($(this).hasClass('prev')) {
				s.settings.currentPage--;
			}

			target.data('embedTumblr').getPosts(target, APIKey);
		});
	}  /***  END PAGINATION ***/

	s.getPosts = function (target, APIKey) {
		var postsPerPage = s.settings.postsPerPage, currentPage = s.settings.currentPage;

		$.ajax({
				url: APIKey + "&limit=" + postsPerPage + "&offset=" + (currentPage - 1) * postsPerPage,
				dataType: "jsonp",
				jsonp: "&jsonp",
				beforeSend: function () {
					target.html(s.settings.loading);    // While Loading...
				},
				success: function (data) {
					target.html("");
					formatPosts(target, data);
					createPagination(target, APIKey, data, postsPerPage, currentPage);
				},
				error: function () {
					target.append(s.settings.error);
				}
		});
	}

	s.init = function () {
		s.getPosts(target, APIKey);
	}

	s.destroy = function (clearContainer) {
		if(clearContainer === true) {
			target.html("");
		}

		$('.blog-btn').off('.embedTumblr');

		target.removeData('embedTumblr');
	}
}

})(jQuery);