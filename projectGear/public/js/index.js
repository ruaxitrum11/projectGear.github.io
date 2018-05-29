//carousel 
$('#mycarousel').carousel({
	interval: 5000
});

new WOW().init();

// <!--Start of Tawk.to Script-->

var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
	var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
	s1.async=true;
	s1.src='https://embed.tawk.to/5b02c1ac13d5ab375e376d67/default';
	s1.charset='UTF-8';
	s1.setAttribute('crossorigin','*');
	s0.parentNode.insertBefore(s1,s0);
})();


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


$(document).on('click', '.review-next', function(){
	// console.log(review[0])
	review.push(review[0]);
	review.shift()
	console.log(review)

	if(review && review.length){
		var xhtml = '';

		xhtml += '<div class="review-gallery">';
		xhtml += '<ul>';

		for(var i =0 ; i<review.length ; i++){
			if(i==(review.length-1)/2 || i == review.length /2){
				xhtml += '<li class="review-gallery-user review-active" >';
				xhtml += '<img src="/upload/avatar/'+review[i].reviewImage+'">';
				xhtml += '</li>';
			}else{
				xhtml += '<li class="review-gallery-user" >';
				xhtml += '<img src="/upload/avatar/'+review[i].reviewImage+'" >';
				xhtml += '</li>';
			}
		}

		xhtml += '</ul>';
		xhtml += '</div>';

		for(var i =0 ; i<review.length ; i++){
			if(i==(review.length-1)/2 || i == review.length /2){
				xhtml += '<div class="review-user" >';
				xhtml += '<p class="review-user-name">'+review[i].reviewName+'</p>';
				xhtml += '<p class="review-user-address">'+review[i].reviewDescription+'</p>';
				xhtml += '</div>';
			}else{
				xhtml += '<div class="review-user"  style="display: none;">';
				xhtml += '<p class="review-user-name">'+review[i].reviewName+'</p>';
				xhtml += '<p class="review-user-address">'+review[i].reviewDescription+'</p>';
				xhtml += '</div>';
			}
		}
		
		xhtml += '<div class="review-information">';
		xhtml += '<span class="review-button review-previous"><i class="fa fa-chevron-left" aria-hidden="true"></i></span>';

		for(var i =0 ; i<review.length ; i++){
			if(i==(review.length-1)/2 || i == review.length /2){
				xhtml += '<span class="review-content">'+review[i].reviewContent+'</span>';
			}else{
				xhtml += '<span class="review-content" style="display: none;">'+review[i].reviewContent+'</span>';
			}
		}
		
		xhtml += '<span class="review-button review-next"><i class="fa fa-chevron-right" aria-hidden="true"></i></span>';
		xhtml += '</div>';

		$('.review-social').html(xhtml)
	}
})


$(document).on('click', '.review-previous', function(){
	// console.log(review[0])
	review.unshift(review[review.length-1]);
	review.pop()
	console.log(review)

	if(review && review.length){
		var xhtml = '';

		xhtml += '<div class="review-gallery">';
		xhtml += '<ul>';

		for(var i =0 ; i<review.length ; i++){
			if(i==(review.length-1)/2 || i == review.length /2){
				xhtml += '<li class="review-gallery-user review-active" >';
				xhtml += '<img src="/upload/avatar/'+review[i].reviewImage+'">';
				xhtml += '</li>';
			}else{
				xhtml += '<li class="review-gallery-user" >';
				xhtml += '<img src="/upload/avatar/'+review[i].reviewImage+'" >';
				xhtml += '</li>';
			}
		}

		xhtml += '</ul>';
		xhtml += '</div>';

		for(var i =0 ; i<review.length ; i++){
			if(i==(review.length-1)/2 || i == review.length /2){
				xhtml += '<div class="review-user" >';
				xhtml += '<p class="review-user-name">'+review[i].reviewName+'</p>';
				xhtml += '<p class="review-user-address">'+review[i].reviewDescription+'</p>';
				xhtml += '</div>';
			}else{
				xhtml += '<div class="review-user"  style="display: none;">';
				xhtml += '<p class="review-user-name">'+review[i].reviewName+'</p>';
				xhtml += '<p class="review-user-address">'+review[i].reviewDescription+'</p>';
				xhtml += '</div>';
			}
		}
		
		xhtml += '<div class="review-information">';
		xhtml += '<span class="review-button review-previous"><i class="fa fa-chevron-left" aria-hidden="true"></i></span>';

		for(var i =0 ; i<review.length ; i++){
			if(i==(review.length-1)/2 || i == review.length /2){
				xhtml += '<span class="review-content">'+review[i].reviewContent+'</span>';
			}else{
				xhtml += '<span class="review-content" style="display: none;">'+review[i].reviewContent+'</span>';
			}
		}
		
		xhtml += '<span class="review-button review-next"><i class="fa fa-chevron-right" aria-hidden="true"></i></span>';
		xhtml += '</div>';

		$('.review-social').html(xhtml)
	}
})



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

function forgotPassword  (){
	var userName = $('input[name=username]').val()
	$.ajax({
		url: '/user/forgotPassword',
		type: 'post',
		data: {
			userName : userName
		} ,
		dataType: 'json'
	}).done(function(results){
		if (results.status == true) {
			$.confirm({
				title: 'Thông báo!',
				content:'<span class="text-success"><strong class="fa fa-check"></strong> Vui lòng truy cập email của bạn để nhận mật khẩu mới !</span>',
				buttons: {
					'Ok': function () {
						window.location.reload();
					}
				}

			});

		}else{
			// console.log(results.errors)
			$.alert({
				title: 'Thông Báo !',
				content: '<span class="text-danger"><strong class="fa fa-close"></strong>'+results.errors[0].msg+'</span>'
			})

		}
	})

}

$('.searchProduct').keyup(function(){
	// console.log('vao day')
	var search_product = $('input[name=searchProduct]').val()
	// console.log(search_product)
	$.ajax({
		url: '/product/search/product',
		type: 'get',
		data: {
			search_product : search_product
		} ,
		dataType: 'json'
	}).done(function(results){
		if(results.status == true) {
			var xhtml = '';
			if(results.productSearch && results.productSearch.length){
				for (var i = 0; i < results.productSearch.length; i++) {
					xhtml += '<li style="list-style-type: none; float: left;width: 90%;padding:10px 0;border-bottom:1px solid #eee;">';
					xhtml += '<a href="/product/'+results.productSearch[i]._id+'" style="color: #000;">';
					xhtml += '<span style="padding-top: 15px; float: left;">'+results.productSearch[i].productName+'</span>';
					xhtml += '<img style="width: 10%;float: right;" src="/upload/thumbProduct/'+results.productSearch[i].productThumb+'">';
					xhtml += '</a>';
					xhtml += '</li>';
				}
				$('.modal-search-product ul').html(xhtml)
			}else {
				xhtml += '<li style="list-style-type: none; float: left;width: 90%;padding:10px 0;border-bottom:1px solid #eee;">Không tìm thấy!</li>';
				$('.modal-search-product ul').html(xhtml)
			}	
		}
	})
})

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

	var idColorProduct = ($('.product-color-'+idProductCart+'.color-active').attr('data-idproduct'))
	// console.log(idColorProduct)
	
	var idColorCart = ($('.option-color-'+idProductCart+'.option-color-active span').attr('data-colorid'));
	// console.log(idColorCart)
	// var cartId = $('.product-id-'+idProductCart).attr('data-id');
	cartId = idProductCart
	// var cartName = $('.product-name-'+idProductCart).attr('data-name');
	// var cartThumb = $('.product-thumb-'+idProductCart).attr('data-thumb');
	if(idColorCart){
		var cartColorId = idColorCart
	}else if(idColorProduct){
		var cartColorId = idColorProduct
	}
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
					xhtml += '<div class="cart-quantum col-xs-2" style="padding-left:0">';
					xhtml += '<input oninput="changeQuantum(\''+results.productCart[i].productColor.colorId+'\' , \''+results.productCart[i]._id+'\')" type="number" min="1" name="" value="'+dataLocal[j].cartColorQuantity+'" id="cart-quantum-'+results.productCart[i].productColor.colorId+'-'+results.productCart[i]._id+'">';
					xhtml += '<a style="cursor : pointer" class="remove-productCart" onclick="removeCartItem(\''+results.productCart[i].productColor.colorId+'\' , \''+results.productCart[i]._id+'\')">Xóa</a>';
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
					xhtml += '<div class="cart-quantum col-xs-2" style="padding-left:0">';
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
