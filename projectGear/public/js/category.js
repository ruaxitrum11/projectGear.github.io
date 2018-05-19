var x = $(".fixed-product-category-area").offset();
$(window).bind('scroll', function () {
	if ($(window).scrollTop() > x.top) {
		$('.fixed-product-category-area').addClass('fixed');
	} else {
		$('.fixed-product-category-area').removeClass('fixed');
	}
});


function changeColor(idProduct,idColor){
	$.ajax({
		url: '/product/changeColor',
		type: 'post',
		data: {
			idProduct : idProduct,
			idColor : idColor
		},
		dataType: 'json',
	}).done(function(results){
		if(results.status){
			// console.log(results.productCurrent)
			var xhtmlPrice = '';
			xhtmlPrice += '<p>'+results.dataProductColorCategory.colorPrice.
			toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</p>';
			
			$('.new-product-category-price-'+results.productCurrent._id).html(xhtmlPrice);
		}
	})
	$('.option-color-'+idProduct).removeClass('option-color-active');
	$(this).addClass('option-color-active');
}

$(".option-color").click(function(){
	$(this).addClass("option-color-active");
})




// var cart = {}
// cart.products = [];
// localStorage.setItem('cart', JSON.stringify(cart));
let cart = localStorage.getItem('cart')

if(!cart){
	localStorage.setItem('cart',JSON.stringify([]))
}
// console.log(cart)

function addToCart(idProductCart,cart){
	// console.log(idProductCart)

	// console.log('vao day')

	// if (localStorage.getItem("myCart") === null) {
	// 	var client = [] 
	// }

	
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

	var dataLocal = JSON.parse(localStorage.getItem('cart'));

	// console.log(data)

	var postData = _.groupBy(dataLocal, function (item) {
		return item.cartId
	})

	// console.log(postData)

	// console.log('aaaaaaaaaaa')
	// var dataCartId = []
	// var dataCartColorId = []
	// var dataCartColorQuantity = []

	// for(var i = 0 ; i<data.length ; i++){
	// 	// console.log(data[i])
	// 	var cartIdArray = data[i].cartId
	// 	dataCartId.push(cartIdArray)

	// 	var cartColorIdArray = data[i].cartColorId
	// 	dataCartColorId.push(cartColorIdArray)

	// 	var cartColorQuantityArray = data[i].cartColorQuantity
	// 	dataCartColorQuantity.push(cartColorQuantityArray)
	// }

	// console.log(dataCartId)
	// console.log(dataCartColorId)
	// console.log(dataCartColorQuantity)


	$.ajax({
		url: '/product/addToCart',
		type: 'post',
		data: {
			postData : postData
		} ,
		dataType: 'json'
	}).done(function(results){
		console.log(results)
		
		console.log(dataLocal)
	})


	// if(data && data.length) {
	// 	var xhtml = '';
	// 	for (var i = 0; i < data.length; i++) {

	// 		xhtml += '<div class="form-cart-content">';
	// 		xhtml += '<div class="container-fluid">';
	// 		xhtml += '<div class="cart-thumb col-xs-2">';
	// 		xhtml += '<img src="/upload/thumbProduct/'+data[i].cartThumb+'">';
	// 		xhtml += '</div>';
	// 		xhtml += '<div class="cart-product col-xs-4" ';
	// 		xhtml += '<p>'+data[i].cartName+'</p>';
	// 		xhtml += '</div>';

	// 		xhtml += '<div class="cart-color col-xs-1" >';
	// 		xhtml += '<p style="background-color:'+data[i].cartColorCode+'"></p>';
	// 		xhtml += '</div>';
	// 		xhtml += '<div class="cart-quantum col-xs-2" ">';
	// 		xhtml += '<input onchange=changeQuantum(\''+data[i].cartColorId+'\') type="number" min="1" name="" value="'+data[i].cartColorQuantity+'" id="cart-quantum-'+data[i].cartColorId+'">';
	// 		xhtml += '<a href="#" class="remove-productCart">Xóa</a>';
	// 		xhtml += '</div>';
	// 		xhtml += '<div class="cart-price col-xs-3" data-colorPrice="'+data[i].cartColorPrice+'" id="cart-price-'+data[i].cartColorId+'" style="padding:0">';
	// 		xhtml += '<p>'+data[i].cartColorPrice.toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</p>';
	// 		xhtml += '</div>';
	// 		xhtml += '</div>';
	// 		xhtml += '</div>';

	// 	}
	// }
	// $('#myCart').html(xhtml)
	
	
	// console.log('aaaaaaaaaaa')

	// $.ajax({

	// 	url: '/product/addToCart',
	// 	type: 'post',
	// 	data: {
	// 		idProductCart : idProductCart,
	// 		idColorCart : idColorCart , 
	// 		cart : cart
	// 	},
	// 	dataType: 'json'
	// }).done(function(results){
	// 	// console.log(results)
	// 	if (results.status) {
	// 		// console.log(results.productAddToCart)
	// 		// console.log(results)

	// 		// var xhtml = ''

	// 		// xhtml += '<div class="form-cart-content">';
	// 		// xhtml += '<div class="container-fluid">';
	// 		// xhtml += '<div class="cart-thumb col-xs-2">';
	// 		// xhtml += '<img src="/upload/thumbProduct/'+results.productAddToCart.productThumb+'">';
	// 		// xhtml += '</div>';
	// 		// xhtml += '<div class="cart-product col-xs-4" data-id ="'+results.productCartCurrent.colorId._id+'" id="cart-product-'+results.productCartCurrent.colorId._id+'">';
	// 		// xhtml += '<p>'+results.productAddToCart.productName+'</p>';
	// 		// xhtml += '</div>';

	// 		// xhtml += '<div class="cart-color col-xs-1" data-colorCode="'+results.productCartCurrent.colorId.colorCode+'" id="cart-color-'+results.productCartCurrent.colorId._id+'">';
	// 		// xhtml += '<p style="background-color:'+results.productCartCurrent.colorId.colorCode+'"></p>';
	// 		// xhtml += '</div>';
	// 		// xhtml += '<div class="cart-quantum col-xs-2" ">';
	// 		// xhtml += '<input onchange=changeQuantum(\''+results.productCartCurrent.colorId._id+'\') type="number" min="1" name="" value="1" id="cart-quantum-'+results.productCartCurrent.colorId._id+'">';
	// 		// xhtml += '<a href="#" class="remove-productCart">Xóa</a>';
	// 		// xhtml += '</div>';
	// 		// xhtml += '<div class="cart-price col-xs-3" data-colorPrice="'+results.productCartCurrent.colorPrice+'" id="cart-price-'+results.productCartCurrent.colorId._id+'" style="padding:0">';
	// 		// xhtml += '<p>'+results.productCartCurrent.colorPrice.toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</p>';
	// 		// xhtml += '</div>';
	// 		// xhtml += '</div>';
	// 		// xhtml += '</div>';


	// 		// $('.cart-content').html(xhtml)






	// 		// var productPriceCartFirst = parseInt($('#cart-price-'+results.productAddToCart._id).text());
	// 		// var productQuantumCartFirst = $('#cart-quantum-'+results.productAddToCart._id).val();

	// 		// totalPerProductCartFirst = productPriceCartFirst * productQuantumCartFirst
	// 	}
	// })

	$(document).ready(function() {
		$(document).on('click', '.remove-productCart', function() {
			$(this).parent('div').parent('div').remove();
		});
	})


}





function changeQuantum(id){
	var productPriceCart = parseInt($('#cart-price-'+id).text());
	var productQuantumCart = $('#cart-quantum-'+id).val();

	// console.log(productQuantumCart)

	var totalPerProduct = productPriceCart*productQuantumCart

	$('#cart-price-'+id+'>p').html(totalPerProduct)

	// console.log(totalPerProduct)
}

