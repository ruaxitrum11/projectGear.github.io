



jQuery(function(){
	jQuery('#product-color-first').click();
});

function showProduct(idColor , idProduct){
	// console.log(idColor)
	// console.log("=========")
	// console.log(idProduct)
	$.ajax({
		url: '/product/showProduct',
		type: 'post',
		data: {
			idColor : idColor ,
			idProduct : idProduct
		},
		dataType: 'json',
	}).done(function(results){
		// console.log(results.dataProductColor.colorImages[0])
		if (results.status) {
			// console.log(results)
			if(results.dataProductColor.colorImages && results.dataProductColor.colorImages.length) {
				var ext = results.dataProductColor.colorImages[0].split('.').pop()
				if(ext == "png") {
					$('.product-details-area').addClass('product-details-area-80')
					$('.product-details-area').css({'background-image':'url(/upload/thumbProduct/'+results.dataProductColor.colorImages[0]+')'})
				}else {
					$('.product-details-area').removeClass('product-details-area-80')
					$('.product-details-area').css({'background-image':'url(/upload/thumbProduct/'+results.dataProductColor.colorImages[0]+')'})
				}
			}
			//show price product
			var xhtmlPrice = '';
			xhtmlPrice += results.dataProductColor.colorPrice.
			toLocaleString('vi', {style : 'currency', currency : 'VND'});
			
			$('.product-details-price p').html(xhtmlPrice);

			//show image product
			var xhtmlImages = '';
			xhtmlImages += '<ul class="product-thumb-color-'+results.dataProductColor.colorId+'">';
			if(results.dataProductColor.colorImages && results.dataProductColor.colorImages.length) {
				for (var i = 0; i < results.dataProductColor.colorImages.length; i++) {
					// console.log(results.dataProductColor.colorImages[i])
					if (i == 0) {
						xhtmlImages += '<li id="product-thumb-first" class="product-thumb  product-thumb-active" style="background-image:url(/upload/thumbProduct/'+results.dataProductColor.colorImages[i]+')" onclick=showBanner(\''+results.dataProductColor.colorImages[i]+'\')></li>';
					}else {
						xhtmlImages += '<li class="product-thumb" style="background-image:url(/upload/thumbProduct/'+results.dataProductColor.colorImages[i]+')" onclick=showBanner(\''+results.dataProductColor.colorImages[i]+'\')></li>';
					}
				}
				
			}
			xhtmlImages += '</ul>';
			$('.product-details-thumb').html(xhtmlImages);

			//show price product fixed 
			var xhtmlPriceFixed = '';
			xhtmlPriceFixed += results.dataProductColor.colorPrice.
			toLocaleString('vi', {style : 'currency', currency : 'VND'});
			
			$('.product-price-fixed p').html(xhtmlPriceFixed)
		}
	})
}


// $(document).ready(function() {
// 	$(document).on('click', '.product-thumb', function() {
// 		$('#product-thumb-first').click();
// 	});
// })
//click add class
$(document).ready(function() {
	$(document).on('click', '.product-thumb', function(e) {
		
		e.preventDefault();
		$('.product-thumb').removeClass('product-thumb-active');
		$(this).addClass('product-thumb-active');
	});
})

$('.product-color').click(function(e) {
	e.preventDefault();
	$('.product-color').removeClass('color-active');
	$(this).addClass('color-active');
});

// change image when click color


// click change BgI
// $('.product-thumb1').click(function(){
// 	$('.product-details-area').css({
// 		'background-image':'url(../img/product_headset/ab_1.jpg)'
// 	});
// });
function showBanner(name){
	// console.log(name)
	var ext = name.split('.').pop()
	console.log(ext)
	if(ext == 'png') {
		$('.product-details-area').addClass('product-details-area-80')
		$('.product-details-area').css({'background-image':'url(/upload/thumbProduct/'+name+')'})
	}else {
		$('.product-details-area').removeClass('product-details-area-80')
		$('.product-details-area').css({'background-image':'url(/upload/thumbProduct/'+name+')'})
	}
}

//scroll fixed
$('.product-main-menu-fixed').hide();
$(document).scroll(function() {
	var y = $(this).scrollTop();
	if (y > 650) {
		$('.product-main-menu-fixed').show();
	} else {
		$('.product-main-menu-fixed').hide();
	}
});

//popup youtube
$(document).ready(function() {
	$('.popup-youtube').magnificPopup({
		type: 'iframe',
		iframe: {
			patterns: {
				youtube: {
			      index: 'youtube.com/', // String that detects type of video (in this case YouTube). Simply via url.indexOf(index).
			      id: 'v=',
			      src: 'https://www.youtube.com/embed/%id%?autoplay=1&rel=0' // URL that will be set as a source for iframe.
			  },
			}
		},
	});
});

//toggle

function showSpecificationsContent (id){
	$('.toggle-'+id).toggleClass('specifications-item-toggle-title-active')
	$('.toggle-content-'+id).toggle(100);
}