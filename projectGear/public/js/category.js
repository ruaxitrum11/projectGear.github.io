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

