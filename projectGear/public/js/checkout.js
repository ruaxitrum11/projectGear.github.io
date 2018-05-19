var dataLocal = JSON.parse(localStorage.getItem('cart'));

var postData = _.groupBy(dataLocal, function (item) {
    return item.cartId
})

$( document ).ready(function() {

// console.log(dataLocal)
$.ajax({
    url: '/product/addToCart',
    type: 'post',
    data: {
        postData : postData
    } ,
    dataType: 'json'
}).done(function(results){
    var xhtml = '';
    for (var i = 0; i < results.productCart.length; i++) {
        for(var j = 0 ; j < dataLocal.length;j++){
            if(results.productCart[i]._id == dataLocal[j].cartId && results.productCart[i].productColor.colorId == dataLocal[j].cartColorId){
                xhtml += '<div class="form-cart-content" id="cart-content-'+results.productCart[i].productColor.colorId+'-'+results.productCart[i]._id+'">';
                xhtml += '<div class="container-fluid">';
                xhtml += '<div class="cart-thumb col-xs-3">';
                xhtml += '<img src="/upload/thumbProduct/'+results.productCart[i].productThumb+'">';
                xhtml += '</div>';
                xhtml += '<div class="cart-product col-xs-4"> ';
                xhtml += '<p style="font-size:2rem;text-transform:capitalize;">'+results.productCart[i].productName+'</p>';
                xhtml += '</div>';

                xhtml += '<div class="cart-color col-xs-1" >';
                xhtml += '<p style="background-color:'+results.productCart[i].productColor.idColorLookup[0].colorCode+'"></p>';
                xhtml += '</div>';
                xhtml += '<div class="cart-quantum col-xs-2" >';
                xhtml += '<input oninput="changeQuantum(\''+results.productCart[i].productColor.colorId+'\' , \''+results.productCart[i]._id+'\')" type="number" min="1" name="" value="'+dataLocal[j].cartColorQuantity+'" id="cart-quantum-'+results.productCart[i].productColor.colorId+'-'+results.productCart[i]._id+'">';
                xhtml += '<a href="#" class="remove-productCart" onclick="removeCartItem(\''+results.productCart[i].productColor.colorId+'\' , \''+results.productCart[i]._id+'\')">Xóa</a>';
                xhtml += '</div>';
                xhtml += '<div class="cart-price col-xs-2" data-colorPrice="'+results.productCart[i].productColor.colorPrice+'" id="cart-price-'+results.productCart[i].productColor.colorId+'-'+results.productCart[i]._id+'">';
                xhtml += '<p style="font-size:1.6rem;">'+(dataLocal[j].cartColorQuantity*results.productCart[i].productColor.colorPrice).toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</p>';
                xhtml += '</div>';
                xhtml += '</div>';
                xhtml += '</div>';  
            }
        }
    }

    $('.checkout-item-content').html(xhtml)
    var totalCart = 0;

    var priceArray = $(".cart-price p");
    priceArray.each(function(){
        totalCart += (parseInt($(this).text().replace(/\D/g, '')));
    })


    var xhtmlCheckOut = '';
    xhtmlCheckOut += '<h2>Thành Tiền :</h2>'
    xhtmlCheckOut += '<p>'+totalCart.toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</p>'
    $('.checkout-item-totalPay').html(xhtmlCheckOut)
    


    
})
if(dataLocal.length > 0){

    var xhtmlButtonPay = '';
    xhtmlButtonPay += '<a href="#">Mua Sản Phẩm</a>'
    $('.checkout-confirm-area div').html(xhtmlButtonPay)

}else{
   $('.checkout-item-totalPay').html('')
   $('.checkout-item-content').html('Vui lòng quay trở lại trang chủ để chọn sản phẩm !')

   var xhtmlButtonBack = '';
   xhtmlButtonBack += '<a href="/">Trở lại trang chủ</a>'
   $('.checkout-confirm-area div').html(xhtmlButtonBack)
}  
})


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
        xhtmlCheckOut += '<h2>Thành Tiền :</h2>'
        xhtmlCheckOut += '<p>'+totalCart.toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</p>'
        $('.checkout-item-totalPay').html(xhtmlCheckOut)

        var xhtmlButtonPay = '';
        xhtmlButtonPay += '<a href="#">Mua Sản Phẩm</a>'
        $('.checkout-confirm-area div').html(xhtmlButtonPay)
    }else{
        $('.checkout-item-totalPay').html('')

        $('.checkout-item-content').html('Vui lòng quay trở lại trang chủ để chọn sản phẩm !')

        var xhtmlButtonBack = '';
        xhtmlButtonBack += '<a href="/">Trở lại trang chủ</a>'
        $('.checkout-confirm-area div').html(xhtmlButtonBack)
    }
}

function changeQuantum(idColorChange , idProductChange){
    // console.log(idColorChange);
    // console.log(idProductChange)
    var productQuantumCart = $('#cart-quantum-'+idColorChange+'-'+idProductChange).val();
    // console.log(productQuantumCart)
    console.log(idColorChange)
    // console.log('#cart-price-'+id)
    var productPriceCart = $('#cart-price-'+idColorChange+'-'+idProductChange).attr('data-colorPrice');

    // console.log('#cart-price-'+idColorChange+'-'+idProductChange+' p')

    totalPricePerItem = productPriceCart*productQuantumCart

    // console.log(totalPricePerItem)

    $('#cart-price-'+idColorChange+'-'+idProductChange+' p').html(''+totalPricePerItem.toLocaleString('vi', {style : 'currency', currency : 'VND'})+'');

    var dataLocalChange = JSON.parse(localStorage.getItem('cart'));

    // console.log(dataLocal)

    // console.log(productQuantumCart)

    for (var i = 0; i < dataLocalChange.length; i++) {
        if (dataLocalChange[i].cartId == idProductChange && dataLocalChange[i].cartColorId == idColorChange) {
            dataLocalChange[i].cartColorQuantity = productQuantumCart
        }
    }

    localStorage.setItem("cart",JSON.stringify(dataLocalChange));

    var totalCart = 0;

    var priceArray = $(".cart-price p");
    priceArray.each(function(){
        totalCart+= (parseInt($(this).text().replace(/\D/g, '')));
    })
    console.log(totalCart)

    $('.checkout-item-totalPay>p').html(totalCart.toLocaleString('vi', {style : 'currency', currency : 'VND'}))
}