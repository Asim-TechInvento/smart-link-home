// NOTICE!! THIS IS REQUIRED TO MAKE YOUR NETO SHOPPING CART WORK
// DO NOT REMOVE UNLESS YOU REALLY KNOW WHAT YOU ARE DOING

(function($) {
	$.extend({
		initPageFuncs: function() {
			// Ajax Wish List
			$.addToWishList({
				'class': 'wishlist_toggle',
				'textclass': 'wishlist_text',
				'htmlon': '<i class="fa fa-heart"></i>',
				'htmloff': '<i class="fa fa-heart"></i>',
				'tooltip_css': 'whltooltips'
			});
			// Ajax Add To Cart
			$.addToCartInit({
				'async' : 'true',
				'cart_id' :  'cartcontents',
				'target_id': 'cartcontentsheader',
				'image_rel': 'itmimg'
			});

			$(".disp_ajax_templ").unbind();
			$(".disp_ajax_templ").change(function() {
				var sku = $(this).val();
				var rel = $(this).attr('rel');
				$.load_ajax_template(rel, {'sku':sku, 'showloading':true, 'procdata':'n'}, {onLoad: function (){$.initPageFuncs();}});
			});
			// This renders the instant search results - edit design of ajax results here
			$.initSearchField({
				'result_header'		: '<ul class="nav nav-list">',
				'result_body'		: '<li><a href="##url##" search-keyword="##keyword##"><img border="0" src="##thumb##" width="36" height="36"/><span class="title">##model##</span></a></li>',
				'result_footer'		: '</ul>',
				'category_header'	: '<ul class="nav nav-list">',
				'category_body'		: '<li><a href="##url##"><span class="thumb"><img border="0" src="##thumb##" width="36" height="36"/></span><span class="title">##fullname##</span> <span class="label label-default">##typename##</span></a></li>',
				'category_footer'	: '</ul>'
			});
		},

// For child product multi-add to cart function
		checkValidQty: function() {
			var found = 0;
			$("#multiitemadd :input").each(function() {
				if ($(this).attr('id').match(/^qty/)) {
					if ($(this).val() > 0) {
						found = 1;
					}
				}
			});
			if (found == 0) {
				$.fancybox("Please specify a quantity before adding to cart");
				return false;
			}
			return true;
		},

		modQtyByMulti: function(obj,act) {
			var mul = 1;
			var maxm;
			var minm = 0;
			var objid = obj.replace(/^qty/,'');
			if ($('#qty'+objid).length > 0) {
				if ($('#multiplier_qty'+objid).length > 0) {
					mul = $('#multiplier_qty'+objid).val();
				}
				if ($('#min_qty'+objid).length > 0) {
					minm = $('#min_qty'+objid).val();
				}
				if ($('#max_qty'+objid).length > 0) {
					maxm = $('#max_qty'+objid).val();
				}

				var cur = $('#'+obj).val();
				if (isNaN(cur)) {
					cur = 0;
				}

				if (act == 'add') {
					cur = parseInt(cur) + parseInt(mul);
					if (!isNaN(maxm) && cur > maxm) {
						cur = maxm;
					}
				}
				else if (act == 'subtract') {
					cur = parseInt(cur) - parseInt(mul);
					if (cur < minm) {
						cur = minm;
					}
				}

				$('#qty'+objid).val(cur);
			}
		}
	});
})(jQuery);

$(document).ready(function() {
	// Popup Credit Card CCV Description At Checkout
	$("#card_ccv").fancybox();

	// Popup Terms At Checkout
	$("#terms").fancybox({
		'width' : 850,
		'height': 650
	});

	// Jquery Ui Date Picker
	$(".datepicker").datepicker({ dateFormat: "dd/mm/yy" });
	$.initPageFuncs();

	// Carousel
	$('.carousel').carousel();
});

// Show button loading animation for 3 seconds
function buttonLoading() {
	$(this).button("loading");
	var pendingbutton=this;
	setTimeout(function(){
		$(pendingbutton).button("reset");
	},3000);
}
$(".btn-loads").click(buttonLoading);

// Fancybox
$(document).ready(function() {
	$(".fancybox").fancybox();
});

// Tooltip
$('.tipsy').tooltip({trigger:'hover',placement:'bottom'});

$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

// Who needs AddThis?
function windowPopup(url, width, height) {
	// Calculate the position of the popup so
	// it’s centered on the screen.
	var left = (screen.width / 2) - (width / 2),
		top = (screen.height / 2) - (height / 2);
	window.open(url,"","menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left);
}
$(".js-social-share").on("click", function(e) {
	e.preventDefault();
	windowPopup($(this).attr("href"), 500, 300);
});

$('.nToggleMenu').click(function(){
	var toggleTarget = $(this).attr('data-target')
	$(toggleTarget).slideToggle();
});
var focused = $('body');
var lastFocused = $('body');
// Capture the current element the user focused in
$(document).on('focusin', function(){ focused = document.activeElement; });
// Capture the last item focused
function updateFocused(){ lastFocused = focused; };
// Place focus on popup
$(document).ready(function(){
	var popUp = document.getElementById('npopupDesc');
	// Configuration of the observer:
	var config = {childList: true};
	// Create an observer instance
	var popUpObserver = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		// Initial observer
		if(mutation.addedNodes["0"]){
			updateFocused();
			// focus on the popup
			$(popUp).attr('tabindex', '-1').focus();
		}else{
			$(popUp).attr('tabindex', '').blur();
			// Observer closing popup
			$(lastFocused).focus();
		}
	  });
	});
	// Pass in the target node, as well as the observer options
	if(popUp){ popUpObserver.observe(popUp, config);}
});
$('#_jstl__buying_options').on('click', '.js-notifymodal-in-stock', function(e){
	e.preventDefault();
	// Get values
	var sku = $(this).attr('data-sku');
	var $wrapper = $('#notifymodal .checkbox');
	var $terms = $('#notifymodal .terms_box');
	var $helpText = $('#notifymodal .checkbox .help-block');
	// Validate form
	if(!$.isChecked($terms)){
		$wrapper.addClass('has-error');
		$helpText.removeClass('hidden');
		return false;
	}else{
		$wrapper.removeClass('has-error');
		$helpText.addClass('hidden');
		// Dismiss modal
		$('#notifymodal').modal('hide');
		// Send information
		$.addNotifyBackInStock(sku, '');
		$terms.attr('checked', false);
		return true;
	}
});

// Custom JS

// Mobile Menu
function openMenu() {
	document.getElementById("mobileMenu").style.width = "350px";
}
function closeMenu() {
	document.getElementById("mobileMenu").style.width = "0";
}

// Animations
;(function($, win) {
  $.fn.inViewport = function(cb) {
     return this.each(function(i,el){

       function visPx(){
         var H = $(this).height(),
             r = el.getBoundingClientRect(), t=r.top, b=r.bottom;
         return cb.call(el, Math.max(0, t>0? H-t : (b<H?b:H)));
       } visPx();

       $(win).on("resize scroll", visPx);
     });
  };
}(jQuery, window));

jQuery(document).ready(function() {
    jQuery(".fadein").inViewport(function(px){
        if(px) jQuery(this).addClass("animated") ;
    });
    jQuery("main section").inViewport(function(px){
        if(px) jQuery(this).addClass("animated") ;
    });
		jQuery(".fadeinslow").inViewport(function(px){
				if(px) jQuery(this).addClass("animated") ;
		});
});

//Scroll to Top
jQuery(document).ready(function($) {
	$(window).scroll(function () {
		if ($(this).scrollTop() > 50) {
		  $(".scrolltop:hidden").stop(true, true).fadeIn();
		} else {
		  $(".scrolltop").stop(true, true).fadeOut();
		}
	});
	$(function () {
		$(".scroll").click(function () {
		  $("html,body").animate({ scrollTop: $("body").offset().top }, "1000");
		  return false;
		});
	});	  

	// $("#n_checkout img.img-responsive").jqZoom({
	// 	selectorWidth: 30,
	// 	selectorHeight: 30,
	// 	viewerWidth: 400,
	// 	viewerHeight: 300
	// });
});

function incrementValue(e) {
	  e.preventDefault();
	  var fieldName = $(e.target).data('field');
	  var parent = $(e.target).closest('div');
	  var currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);

	  if (!isNaN(currentVal)) {
	    parent.find('input[name=' + fieldName + ']').val(currentVal + 1);
	  } else {
	    parent.find('input[name=' + fieldName + ']').val(0);
	  }
	}

function decrementValue(e) {
	  e.preventDefault();
	  var fieldName = $(e.target).data('field');
	  var parent = $(e.target).closest('div');
	  var currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);

	  if (!isNaN(currentVal) && currentVal > 0) {
	    parent.find('input[name=' + fieldName + ']').val(currentVal - 1);
	  } else {
	    parent.find('input[name=' + fieldName + ']').val(0);
	  }
	}

	$('.input-group').on('click', '.button-plus', function(e) {
	  incrementValue(e);
	});

	$('.input-group').on('click', '.button-minus', function(e) {
	  decrementValue(e);
	});
	
	
	jQuery(function($){ 
        $( '._delivery_select label' ).html( 'Preferred delivery/pickup date <small class="text-muted">optional</small>' );
    });

    // if(window.location.href== "https://jlj-group-australia-pty-ltd.neto.com.au/_mycart") {
    //     $("body").addClass("cartpage");
    // }
    $(function() {
      var loc = window.location.href; // returns the full URL
      if(/_mycart/.test(loc)) {
        $('body').addClass('cartpage');
      }
    });