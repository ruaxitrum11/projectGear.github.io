//carousel 
$('#mycarousel').carousel({
	interval: 5000
});

new WOW().init();

// ----- Header , Footer

$(".header-xs-details").hide();
$(".header-xs-search").hide();
$(".header-xs-cart").hide();
$(".header-xs-user").hide();
$(".header-xs-form-login").hide();
$(".header-xs-form-singin").hide();

$(".bar-item").click(function(){
	$(".header-xs-details").toggle(".header-xs-details-transition");
	$(".header-xs-search").hide(500);
	$(".header-xs-cart").hide(500);
	$(".header-xs-user").hide(500);
	$(".header-xs-form-singin").hide(500);
	$(".header-xs-form-login").hide(500);
});
$(".fa-search").click(function(){
	$(".header-xs-search").toggle(".header-xs-search-transition");
	$(".header-xs-details").hide(500);
	$(".header-xs-cart").hide(500);
	$(".header-xs-user").hide(500);
	$(".header-xs-form-singin").hide(500);
	$(".header-xs-form-login").hide(500);
});
$(".fa-shopping-cart").click(function(){
	$(".header-xs-cart").toggle(".header-xs-cart-transition");
	$(".header-xs-details").hide(500);
	$(".header-xs-search").hide(500);
	$(".header-xs-user").hide(500);
	$(".header-xs-form-singin").hide(500);
	$(".header-xs-form-login").hide(500);
})
$(".fa-user").click(function(){
	$(".header-xs-user").toggle(".header-xs-user-transition");
	$(".header-xs-details").hide(500);
	$(".header-xs-search").hide(500);
	$(".header-xs-cart").hide(500);
});
$(".header-xs-login").click(function(){
	$(".header-xs-form-login").toggle(".header-xs-form-login-transition");	
	$(".header-xs-form-singin").hide(500);
});
$(".header-xs-singin").click(function(){
	$(".header-xs-form-singin").toggle(".header-xs-form-singin-transition");	
	$(".header-xs-form-login").hide(500);
});

// ----- Homepage (index)

$(document).ready(function(){
	$('.new-product-right ul li').click(function(){
		$('li').removeClass("product-active");
		$(this).addClass("product-active");
	});
});



//review 
$(document).ready(function(){
	var stt = 0;
	var sttUser = 0;

	startReview = parseInt($(".review-content:first").attr("stt"));
	endReview = parseInt($(".review-content:last").attr("stt"));

	startUserInfo = parseInt($(".review-user:first").attr("stt"));
	endReUserInfo = parseInt($(".review-user:last").attr("stt"));

	$('.review-user').each(function(){
		if($(this).is(':visible')){
			sttUser = parseInt($(this).attr("stt"));
		}
	});

	$('.review-content').each(function(){
		if($(this).is(':visible')){
			stt = parseInt($(this).attr("stt"));
		}
	});


	$('.review-next').click(function(){
		
		next = stt ;
		nextUser = sttUser;

		if(next == endReview) {
			stt =startReview-1;
			sttUser = startUserInfo-1;
		}
		next = ++stt ;
		nextUser = ++sttUser;

		$('.review-content').hide();
		$('.review-content').eq(next).show();

		$('.review-user').hide();
		$('.review-user').eq(nextUser).show();
		
	});
	$('.review-previous').click(function(){
		
		previous = stt;
		previousUser = sttUser;

		if(previous == startReview) {
			stt = endReview+1;
			sttUser = endReUserInfo + 1;
		}
		previous = --stt;

		previousUser = --sttUser;

		$('.review-content').hide();
		$('.review-content').eq(previous).show();

		$('.review-user').hide();
		$('.review-user').eq(previousUser).show();

	});
});

$(document).ready(function(){
	var sttImage = [
	"/img/homepage/user1.jpg",
	"/img/homepage/user2.jpg",
	"/img/homepage/user3.jpg",
	"/img/homepage/user4.jpg",
	"/img/homepage/user5.jpg",
	"/img/homepage/user6.jpg",
	"/img/homepage/user7.jpg"
	];

	// $("#gallery-user1 img").attr("src",sttImage[0]);
	// $("#gallery-user2 img").attr("src",sttImage[1]);
	// $("#gallery-user3 img").attr("src",sttImage[2]);
	// $("#gallery-user4 img").attr("src",sttImage[3]);
	// $("#gallery-user5 img").attr("src",sttImage[4]);
	// $("#gallery-user6 img").attr("src",sttImage[5]);
	// $("#gallery-user7 img").attr("src",sttImage[6]);

	jQuery.each(sttImage, function(index, item) {
		var galleryUser = '#gallery-user' + (index + 1) + ' img';
		$(galleryUser).attr('src', item);
	});


	$('.review-previous').click(function(){
		sttImage.unshift(sttImage[6]);
		sttImage.pop();
		jQuery.each(sttImage, function(index, item) {
			var galleryUser = '#gallery-user' + (index + 1) + ' img';
			$(galleryUser).attr('src', item);
		});
	});

	$('.review-next').click(function(){
		sttImage.push(sttImage[0]);
		sttImage.shift();
		jQuery.each(sttImage, function(index, item) {
			var galleryUser = '#gallery-user' + (index + 1) + ' img';
			$(galleryUser).attr('src', item);
		});
	});

});

//Smoothie Scrool 
$(document).ready(function(){
  // Add smooth scrolling to all links
  $("a").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
      	scrollTop: $(hash).offset().top
      }, 1000, function(){

        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
    });
    } // End if
});
});


//// Register

function registerUser() {
	var userName = $('#register-userName').val();
	var email = $("#register-email").val();
	var password = $("#register-password").val();
	var password_confirm = $("#register-password-confirm").val();

	
	if (email=="") {
		$.alert({
			title: '<span class="text-danger">Lỗi !</span>',
			content: 'Vui lòng điền email của bạn !',
			type: 'red',
			typeAnimated: true,
		});
	}else{
		if (email && email !="") {
			if(!isEmail(email)){
				$.alert({
					title: '<span class="text-danger">Lỗi !</span>',
					content: 'Email không hợp lệ !</span>',
					type: 'red',
					typeAnimated: true,
				});
			}else{
				if (password=="") {
					$.alert({
						title: '<span class="text-danger">Lỗi !</span>',
						content: 'Vui lòng điền mật khẩu !',
						type: 'red',
						typeAnimated: true,
					});
				}else{
					if (password !=password_confirm) {
						$.alert({
							title: '<span class="text-danger">Lỗi !</span>',
							content: 'Mật khẩu không trùng khớp !',
							type: 'red',
							typeAnimated: true,
						});
					}else{
						$.ajax({
							url: '/user/create',
							type: 'POST',
							dataType: 'json',
							data: {
								userName : userName,
								email: email,
								password : password,
								password_confirm : password_confirm,
								_csrf: "<%= _csrf %>"
							}
						}).done(function(result){
							if (!result.status) {
								if (result.errors && result.errors.length) {
									$.alert({
										title: '<span class="text-danger">Lỗi !</span>',
										content: ''+result.errors[0].msg+'',
										type: 'red',
										typeAnimated: true,
									});
								}
							}else{
								$.alert({
									title: '<span class="text-success">Thành Công !</span>',
									content: 'Đăng kí thành công',
									type: 'green',
									typeAnimated: true,
								});
								$('#singin-modal').modal('hide');
							}
						})
					}
				}
			}
		}
	}
}

//Login 
function loginUser() {
	var username = $("input[name=username]").val();
	var password = $("input[name=password]").val();
	if (username == "") {
		$.alert({
			title: '<span class="text-danger">Lỗi !</span>',
			content: 'Vui lòng nhập tên tài khoản',
			type: 'red',
			typeAnimated: true,
		});
	}else if (password == ""){
		$.alert({
			title: '<span class="text-danger">Lỗi !</span>',
			content: 'Vui lòng nhập mật khẩu',
			type: 'red',
			typeAnimated: true,
		});
	} else {
		$.ajax({
			url: '/user/login',
			type: 'POST',
			dataType: 'json',
			data: {
				username : username,
				password : password,
				_csrf: "<%= _csrf %>"
			}
		}).done(function(result){
			if (result.status == false) {
				$.alert({
					title: '<span class="text-danger">Lỗi !</span>',
					content: ''+result.msg+'',
					type: 'red',
					typeAnimated: true,
				});
			}else{
				$.confirm({
					title: '<span class="text-success">Thông báo !</span>',
					content: 'Đăng nhập thành công',
					type: 'green',
					typeAnimated: true,
					buttons : {
						'Ok': function () {
							window.location.reload()
						}
					}
				});

			}
		})
	}
}

function isEmail(email) {
	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
}

var cart = localStorage.getItem('cart')

if(!cart){
	localStorage.setItem('cart',JSON.stringify([]))
}
// console.log(cart)



function addToCart(idProductCart,cart){


	
	var idColorCart = ($('.option-color-'+idProductCart+'.option-color-active span').attr('data-colorid'));
	// console.log(idColorCart)
	var cartId = $('.product-id-'+idProductCart).attr('data-id');
	// var cartName = $('.product-name-'+idProductCart).attr('data-name');
	// var cartThumb = $('.product-thumb-'+idProductCart).attr('data-thumb');
	var cartColorId = idColorCart
	// var cartColorCode = $('.option-color-'+idProductCart+'.option-color-active span').attr('data-colorCode');
	var cartColorQuantity = 1 ;
	// var cartColorPrice = $('.new-product-category-price-'+idProductCart+'>p').text().replace(/\D/g, '');

	var product = {}

	product.cartId = cartId;
	// product.cartName = cartName;
	// product.cartThumb = cartThumb
	product.cartColorId = cartColorId;
	// product.cartColorCode = cartColorCode;
	product.cartColorQuantity = cartColorQuantity;
	// product.cartColorPrice = cartColorPrice;

	// products.push(product)
	
	// console.log(product)


	if (localStorage && localStorage.getItem('cart')) {
		var cart = JSON.parse(localStorage.getItem('cart'));    
		// console.log(cart)        
		// console.log(product)

		// console.log(cart)
		
		if(cart && cart.length){
			var productIsExists = false;
			for (var i = 0; i < cart.length; i++) {
				// console.log("========")
				// console.log(product)
				if(cart[i].cartId == product.cartId && cart[i].cartColorId == product.cartColorId){
					cart[i].cartColorQuantity++
					localStorage.setItem('cart', JSON.stringify(cart));
					productIsExists = true;
					break;
				}
				
			}
			if(!productIsExists){
				cart.push(product)
				localStorage.setItem('cart', JSON.stringify(cart));
			}

		}else {
			cart.push(product)
			// console.log(cart)
			localStorage.setItem('cart', JSON.stringify(cart));

		}
	} 
	var numberOfItemCart = JSON.parse(localStorage.getItem('cart'));
	var xhtml = '';
	xhtml += numberOfItemCart.length
	$('.number-product-cart').html(xhtml)

	var dataLocal = JSON.parse(localStorage.getItem('cart'));

	// console.log(data)

	var postData = _.groupBy(dataLocal, function (item) {
		return item.cartId
	})

	// console.log(postData)



	$.ajax({
		url: '/product/addToCart',
		type: 'post',
		data: {
			postData : postData
		} ,
		dataType: 'json'
	}).done(function(results){
		// console.log(results.product)
		var xhtml = '';
		for (var i = 0; i < results.productCart.length; i++) {
			for(var j = 0 ; j < dataLocal.length;j++){
				if(results.productCart[i]._id == dataLocal[j].cartId && results.productCart[i].productColor.colorId == dataLocal[j].cartColorId){
					xhtml += '<div class="form-cart-content" id="cart-content-'+results.productCart[i].productColor.colorId+'-'+results.productCart[i]._id+'">';
					xhtml += '<div class="container-fluid">';
					xhtml += '<div class="cart-thumb col-xs-2">';
					xhtml += '<img src="/upload/thumbProduct/'+results.productCart[i].productThumb+'">';
					xhtml += '</div>';
					xhtml += '<div class="cart-product col-xs-4">';
					xhtml += '<p>'+results.productCart[i].productName+'</p>';
					xhtml += '</div>';

					xhtml += '<div class="cart-color col-xs-1" >';
					xhtml += '<p style="background-color:'+results.productCart[i].productColor.idColorLookup[0].colorCode+'"></p>';
					xhtml += '</div>';
					xhtml += '<div class="cart-quantum col-xs-2">';
					xhtml += '<input oninput="changeQuantum(\''+results.productCart[i].productColor.colorId+'\' , \''+results.productCart[i]._id+'\')" type="number" min="1" name="" value="'+dataLocal[j].cartColorQuantity+'" id="cart-quantum-'+results.productCart[i].productColor.colorId+'-'+results.productCart[i]._id+'">';
					xhtml += '<a href="#" class="remove-productCart" onclick="removeCartItem(\''+results.productCart[i].productColor.colorId+'\' , \''+results.productCart[i]._id+'\')">Xóa</a>';
					xhtml += '</div>';
					xhtml += '<div class="cart-price col-xs-3" data-colorPrice="'+results.productCart[i].productColor.colorPrice+'" id="cart-price-'+results.productCart[i].productColor.colorId+'-'+results.productCart[i]._id+'" style="padding:0">';
					xhtml += '<p>'+(dataLocal[j].cartColorQuantity*results.productCart[i].productColor.colorPrice).toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</p>';
					xhtml += '</div>';
					xhtml += '</div>';
					xhtml += '</div>';	
				}
			}
		}

		$('#myCart').html(xhtml)

		var totalCart = 0;

		var priceArray = $(".cart-price p");
		priceArray.each(function(){
			totalCart += (parseInt($(this).text().replace(/\D/g, '')));
		})
		// console.log(totalCart)

		if(numberOfItemCart.length > 0){
			var xhtmlCheckOut = '';
			xhtmlCheckOut += '<div class="cart-totalPayment">';
			xhtmlCheckOut += '<div class="container-fluid">';
			xhtmlCheckOut += '<div class="cart-totalPayment-title col-xs-6">';
			xhtmlCheckOut += '<p>Thành Tiền</p>';
			xhtmlCheckOut += '</div>';
			xhtmlCheckOut += '<div class="cart-totalPayment-price col-xs-6">';
			xhtmlCheckOut += '<p>'+totalCart.toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</p>';
			xhtmlCheckOut += '</div>';
			xhtmlCheckOut += '</div>';
			xhtmlCheckOut += '</div>';
			xhtmlCheckOut += '<div class="cart-button">';
			xhtmlCheckOut += '<div class="container-fluid">';
			xhtmlCheckOut += '<div class="cart-button-checkout">';
			xhtmlCheckOut += '<a href="/checkout">Thanh toán</a>';
			xhtmlCheckOut += '</div>';
			xhtmlCheckOut += '<div class="cart-button-continue">';
			xhtmlCheckOut += '<a href="#" data-dismiss="modal">Tiếp tục mua hàng</a>';
			xhtmlCheckOut += '</div>';
			xhtmlCheckOut += '</div>';
			xhtmlCheckOut += '</div>';
			$('.cart-footer').html(xhtmlCheckOut)
		}else{
			$('.cart-footer').html('')
		}
	})
}


$(document).ready(function(){
	var numberOfItemCart = JSON.parse(localStorage.getItem('cart'));
	var xhtml = '';
	xhtml += numberOfItemCart.length
	$('.number-product-cart').html(xhtml)
})

function openCart() {
	if (localStorage && localStorage.getItem('cart')) {
		var dataLocal = JSON.parse(localStorage.getItem('cart'));

		var postData = _.groupBy(dataLocal, function (item) {
			return item.cartId
		})

		$.ajax({
			url: '/product/addToCart',
			type: 'post',
			data: {
				postData : postData
			} ,
			dataType: 'json'
		}).done(function(results){
		// console.log(results.product)
		var xhtml = '';
		for (var i = 0; i < results.productCart.length; i++) {
			for(var j = 0 ; j < dataLocal.length;j++){
				if(results.productCart[i]._id == dataLocal[j].cartId && results.productCart[i].productColor.colorId == dataLocal[j].cartColorId){
					xhtml += '<div class="form-cart-content" id="cart-content-'+results.productCart[i].productColor.colorId+'-'+results.productCart[i]._id+'">';
					xhtml += '<div class="container-fluid">';
					xhtml += '<div class="cart-thumb col-xs-2">';
					xhtml += '<img src="/upload/thumbProduct/'+results.productCart[i].productThumb+'">';
					xhtml += '</div>';
					xhtml += '<div class="cart-product col-xs-4">';
					xhtml += '<p>'+results.productCart[i].productName+'</p>';
					xhtml += '</div>';
					xhtml += '<div class="cart-color col-xs-1" >';
					xhtml += '<p style="background-color:'+results.productCart[i].productColor.idColorLookup[0].colorCode+'"></p>';
					xhtml += '</div>';
					xhtml += '<div class="cart-quantum col-xs-2">';
					xhtml += '<input oninput="changeQuantum(\''+results.productCart[i].productColor.colorId+'\' , \''+results.productCart[i]._id+'\')" type="number" min="1" name="" value="'+dataLocal[j].cartColorQuantity+'" id="cart-quantum-'+results.productCart[i].productColor.colorId+'-'+results.productCart[i]._id+'">';
					xhtml += '<a href="#" class="remove-productCart" onclick="removeCartItem(\''+results.productCart[i].productColor.colorId+'\' , \''+results.productCart[i]._id+'\')">Xóa</a>';
					xhtml += '</div>';
					xhtml += '<div class="cart-price col-xs-3" data-colorPrice ="'+results.productCart[i].productColor.colorPrice+'" id="cart-price-'+results.productCart[i].productColor.colorId+'-'+results.productCart[i]._id+'" style="padding:0">';
					xhtml += '<p>'+(dataLocal[j].cartColorQuantity*results.productCart[i].productColor.colorPrice).toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</p>';
					xhtml += '</div>';
					xhtml += '</div>';
					xhtml += '</div>';	
				}
			}
		}
		$('#myCart').html(xhtml)
		
		var totalCart = 0;

		var priceArray = $(".cart-price p");
		priceArray.each(function(){
			totalCart += (parseInt($(this).text().replace(/\D/g, '')));
		})
		// console.log(totalCart)
	

		var numberOfItemCart = JSON.parse(localStorage.getItem('cart'));

		if(numberOfItemCart.length > 0){
			var xhtmlCheckOut = '';
			xhtmlCheckOut += '<div class="cart-totalPayment">';
			xhtmlCheckOut += '<div class="container-fluid">';
			xhtmlCheckOut += '<div class="cart-totalPayment-title col-xs-6">';
			xhtmlCheckOut += '<p>Thành Tiền</p>';
			xhtmlCheckOut += '</div>';
			xhtmlCheckOut += '<div class="cart-totalPayment-price col-xs-6">';
			xhtmlCheckOut += '<p>'+totalCart.toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</p>';
			xhtmlCheckOut += '</div>';
			xhtmlCheckOut += '</div>';
			xhtmlCheckOut += '</div>';
			xhtmlCheckOut += '<div class="cart-button">';
			xhtmlCheckOut += '<div class="container-fluid">';
			xhtmlCheckOut += '<div class="cart-button-checkout">';
			xhtmlCheckOut += '<a href="/checkout">Thanh toán</a>';
			xhtmlCheckOut += '</div>';
			xhtmlCheckOut += '<div class="cart-button-continue">';
			xhtmlCheckOut += '<a href="#" data-dismiss="modal">Tiếp tục mua hàng</a>';
			xhtmlCheckOut += '</div>';
			xhtmlCheckOut += '</div>';
			xhtmlCheckOut += '</div>';
			$('.cart-footer').html(xhtmlCheckOut)
		}else{
			$('.cart-footer').html('')
		}
	})

	}
}



function removeCartItem (idColorRemove , idProductRemove){
	$('#cart-content-'+idColorRemove+'-'+idProductRemove).remove()
	var totalCart = 0;

	var priceArray = $(".cart-price p");
	priceArray.each(function(){
		totalCart += (parseInt($(this).text().replace(/\D/g,'')));
	})
	

	var cartRemoved = JSON.parse(localStorage.getItem('cart'));

	// console.log(cartRemoved)

	for(var i = 0 ; i<cartRemoved.length ;i++){
		if(cartRemoved[i].cartId == idProductRemove && cartRemoved[i].cartColorId == idColorRemove){
			cartRemoved.splice(i,1)
		}
	}
	localStorage.setItem("cart",JSON.stringify(cartRemoved))

	var numberOfItemCart = JSON.parse(localStorage.getItem('cart'));
	var xhtml = '';
	xhtml += numberOfItemCart.length
	$('.number-product-cart').html(xhtml)

	if(numberOfItemCart.length > 0){
		var xhtmlCheckOut = '';
		xhtmlCheckOut += '<div class="cart-totalPayment">';
		xhtmlCheckOut += '<div class="container-fluid">';
		xhtmlCheckOut += '<div class="cart-totalPayment-title col-xs-6">';
		xhtmlCheckOut += '<p>Thành Tiền</p>';
		xhtmlCheckOut += '</div>';
		xhtmlCheckOut += '<div class="cart-totalPayment-price col-xs-6">';
		xhtmlCheckOut += '<p>'+totalCart.toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</p>';
		xhtmlCheckOut += '</div>';
		xhtmlCheckOut += '</div>';
		xhtmlCheckOut += '</div>';
		xhtmlCheckOut += '<div class="cart-button">';
		xhtmlCheckOut += '<div class="container-fluid">';
		xhtmlCheckOut += '<div class="cart-button-checkout">';
		xhtmlCheckOut += '<a href="/checkout">Thanh toán</a>';
		xhtmlCheckOut += '</div>';
		xhtmlCheckOut += '<div class="cart-button-continue">';
		xhtmlCheckOut += '<a href="#" data-dismiss="modal">Tiếp tục mua hàng</a>';
		xhtmlCheckOut += '</div>';
		xhtmlCheckOut += '</div>';
		xhtmlCheckOut += '</div>';
		$('.cart-footer').html(xhtmlCheckOut)
	}else{
		$('.cart-footer').html('')
		$('#myCart').html('Giỏ Hàng Của Bạn Không Có Sản Phẩm Nào !')
	}
}



function changeQuantum(idColorChange , idProductChange){
	// console.log(idColorChange);
	// console.log(idProductChange)
	var productQuantumCart = $('#cart-quantum-'+idColorChange+'-'+idProductChange).val();
	// console.log(productQuantumCart)
	// console.log('#cart-price-'+id)
	var productPriceCart = $('#cart-price-'+idColorChange+'-'+idProductChange).attr('data-colorPrice');

	// console.log(productPriceCart)

	console.log('#cart-price-'+idColorChange+'-'+idProductChange+' p')

	totalPricePerItem = productPriceCart*productQuantumCart

	console.log(totalPricePerItem)

	$('#cart-price-'+idColorChange+'-'+idProductChange+' p').html(''+totalPricePerItem.toLocaleString('vi', {style : 'currency', currency : 'VND'})+'');

	var dataLocal = JSON.parse(localStorage.getItem('cart'));

	// console.log(dataLocal)

	// console.log(productQuantumCart)

	for (var i = 0; i < dataLocal.length; i++) {
		if (dataLocal[i].cartId == idProductChange && dataLocal[i].cartColorId == idColorChange) {
			dataLocal[i].cartColorQuantity = productQuantumCart
		}
	}

	localStorage.setItem("cart",JSON.stringify(dataLocal));

	var totalCart = 0;

	var priceArray = $(".cart-price p");
	priceArray.each(function(){
		totalCart+= (parseInt($(this).text().replace(/\D/g, '')));
	})
	// console.log(totalCart)

	$('.cart-totalPayment-price>p').html(totalCart.toLocaleString('vi', {style : 'currency', currency : 'VND'}))
}
