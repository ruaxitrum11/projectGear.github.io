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



function addToCart(idProductCart){
	// console.log(idProductCart)

	// var cookie_cart = [];

	var idColorCart = ($('.option-color-'+idProductCart+'.option-color-active span').attr('data-colorid'));
	// console.log(idColorCart)

	// var this_cart = {
	// 	id_Product : idProductCart,
	// 	id_Color : idColorCart,
	// 	quantity : 1
	// }

	// 
	

	// document.cookie = "username=John Doe";

	// console.log(document.cookie)

	// document.cookie = 'currentProductColorId='+cookie_cart+'';

	$.ajax({
		url: '/product/addToCart',
		type: 'post',
		data: {
			idProductCart : idProductCart,
			idColorCart : idColorCart
		},
		dataType: 'json',
	}).done(function(results){
		// console.log(results)
		if (results.status == true) {
			// console.log(results.productAddToCart)
			var xhtml = '';
			xhtml += '<div class="form-cart-content">';
			xhtml += '<div class="container-fluid">';
			xhtml += '<div class="cart-thumb col-xs-2">';
			xhtml += '<img src="/upload/thumbProduct/'+results.productAddToCart.productThumb+'">';
			xhtml += '</div>';
			xhtml += '<div class="cart-product col-xs-4" id="cart-product-'+results.productAddToCart._id+'">';
			xhtml += '<p>'+results.productAddToCart.productName+'</p>';
			xhtml += '</div>';
			console.log(results.productAddToCart.productColor)
			xhtml += '<div class="cart-color col-xs-1" id="cart-color-'+results.productAddToCart._id+'">';
			xhtml += '<p style="background-color:'+results.productAddToCart.productColor[0].colorId.colorCode+'"></p>';
			xhtml += '</div>';
			xhtml += '<div class="cart-quantum col-xs-2" ">';
			xhtml += '<input onchange=changeQuantum(\''+results.productAddToCart._id+'\') type="number" min="1" name="" value="1" id="cart-quantum-'+results.productAddToCart._id+'">';
			xhtml += '<a href="#" class="remove-productCart">Xóa</a>';
			xhtml += '</div>';
			xhtml += '<div class="cart-price col-xs-3" id="cart-price-'+results.productAddToCart._id+'" style="padding:0">';
			xhtml += '<p>'+results.productAddToCart.productColor[0].colorPrice.toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</p>';
			xhtml += '</div>';
			xhtml += '</div>';
			xhtml += '</div>';


			$('.cart-content').html(xhtml)

			localStorage.content=$('.cart-content').html()
			// var productPriceCartFirst = parseInt($('#cart-price-'+results.productAddToCart._id).text());
			// var productQuantumCartFirst = $('#cart-quantum-'+results.productAddToCart._id).val();

			// totalPerProductCartFirst = productPriceCartFirst * productQuantumCartFirst
			
		}
	})

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

	console.log(totalPerProduct)
}