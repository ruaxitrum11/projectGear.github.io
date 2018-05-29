var dataLocal = JSON.parse(localStorage.getItem('cart'));

var postData = _.groupBy(dataLocal, function (item) {
    return item.cartId
})


$( document ).ready(function() {
// console.log(dataLocal)
// console.log(user)

// var user = JSON.stringify(<%=user%>)
// console.log(userPromotion)

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
                xhtml += '<div class="form-cart-content" id="cart-content-'+results.productCart[i].productColor.colorId+'-'+results.productCart[i]._id+'" data-productId="'+results.productCart[i]._id+'" data-productName="'+results.productCart[i].productName+'" data-productImage = "'+results.productCart[i].productThumb+'" data-productColor="'+results.productCart[i].productColor.idColorLookup[0].colorCode+'" data-productColorId ="'+results.productCart[i].productColor.colorId+'" data-productQuantity="'+dataLocal[j].cartColorQuantity+'" data-productPrice ="'+results.productCart[i].productColor.colorPrice+'">';
                xhtml += '<div class="container-fluid">';
                xhtml += '<div class="cart-thumb col-xs-3">';
                xhtml += '<img src="/upload/thumbProduct/'+results.productCart[i].productThumb+'">';
                xhtml += '</div>';
                xhtml += '<div class="cart-product col-xs-4" > ';
                xhtml += '<p style="font-size:2rem;text-transform:capitalize;">'+results.productCart[i].productName+'</p>';
                xhtml += '</div>';

                xhtml += '<div class="cart-color col-xs-1">';
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
    xhtmlCheckOut += '<div class="checkOutPrice">'
    xhtmlCheckOut += '<h2>Tổng hóa đơn :</h2>'
    xhtmlCheckOut += '<p style="font-size:2rem;color:#000;font-weight:bold;width:25%;">'+totalCart.toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</p>'

    xhtmlCheckOut += '</div>'
    // console.log(userData)
    if( userData.level == 0 || userData.level == 1 ){
        xhtmlCheckOut += '<div class="checkOutPromotion">'
        xhtmlCheckOut += '<h2>Khuyến mãi :</h2>'
        xhtmlCheckOut += '<p style="width:25%;font-size:2rem;color:#000">0%</p>'
        xhtmlCheckOut += '</div>'
        var totalCheckOut = totalCart*1
    }else if(userData.level == 2){
        xhtmlCheckOut += '<div class="checkOutPromotion">'
        xhtmlCheckOut += '<h2>Khuyến mãi :</h2>'
        xhtmlCheckOut += '<p style="width:25%;font-size:2rem;color:#000">3%</p>'
        xhtmlCheckOut += '</div>'
        var totalCheckOut = totalCart*0.97
    }else if(userData.level == 3) {
        xhtmlCheckOut += '<div class="checkOutPromotion">'
        xhtmlCheckOut += '<h2>Khuyến mãi :</h2>'
        xhtmlCheckOut += '<p style="width:25%;font-size:2rem;color:#000">6%</p>'
        xhtmlCheckOut += '</div>'
        var totalCheckOut = totalCart*0.94
    }else if(userData.level == 4) {
        xhtmlCheckOut += '<div class="checkOutPromotion">'
        xhtmlCheckOut += '<h2>Khuyến mãi :</h2>'
        xhtmlCheckOut += '<p style="width:25%;font-size:2rem;color:#000">10%</p>'
        xhtmlCheckOut += '</div>'
        var totalCheckOut = totalCart*0.9
    }


    // console.log(totalCheckOut)

    xhtmlCheckOut += '<div class="checkOutToTalPrice">'
    xhtmlCheckOut += '<h2>Thành Tiền :</h2>'
    xhtmlCheckOut += '<p style="width:25%;">'+totalCheckOut.toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</p>'
    $('.checkout-item-totalPay').html(xhtmlCheckOut)
    xhtmlCheckOut += '</div>'
    


    
})
if(dataLocal.length > 0){

    var xhtmlButtonPay = '';
    xhtmlButtonPay += '<a style="cursor:pointer" onclick=addBill()>Thanh toán</a>'
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
        xhtmlCheckOut += '<div class="checkOutPrice">'
        xhtmlCheckOut += '<h2>Tổng hóa đơn :</h2>'
        xhtmlCheckOut += '<p style="font-size:2rem;color:#000;font-weight:bold;width:25%;">'+totalCart.toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</p>'

        xhtmlCheckOut += '</div>'
        // console.log(userData)
        if( userData.level == 0 || userData.level == 1 ){
            xhtmlCheckOut += '<div class="checkOutPromotion">'
            xhtmlCheckOut += '<h2>Khuyến mãi :</h2>'
            xhtmlCheckOut += '<p style="width:25%;font-size:2rem;color:#000">0%</p>'
            xhtmlCheckOut += '</div>'
            var totalCheckOut = totalCart*1
        }else if(userData.level == 2){
            xhtmlCheckOut += '<div class="checkOutPromotion">'
            xhtmlCheckOut += '<h2>Khuyến mãi :</h2>'
            xhtmlCheckOut += '<p style="width:25%;font-size:2rem;color:#000">3%</p>'
            xhtmlCheckOut += '</div>'
            var totalCheckOut = totalCart*0.97
        }else if(userData.level == 3) {
            xhtmlCheckOut += '<div class="checkOutPromotion">'
            xhtmlCheckOut += '<h2>Khuyến mãi :</h2>'
            xhtmlCheckOut += '<p style="width:25%;font-size:2rem;color:#000">6%</p>'
            xhtmlCheckOut += '</div>'
            var totalCheckOut = totalCart*0.94
        }else if(userData.level == 4) {
            xhtmlCheckOut += '<div class="checkOutPromotion">'
            xhtmlCheckOut += '<h2>Khuyến mãi :</h2>'
            xhtmlCheckOut += '<p style="width:25%;font-size:2rem;color:#000">10%</p>'
            xhtmlCheckOut += '</div>'
            var totalCheckOut = totalCart*0.9
        }

        xhtmlCheckOut += '<div class="checkOutToTalPrice">'
        xhtmlCheckOut += '<h2>Thành Tiền :</h2>'
        xhtmlCheckOut += '<p style="width:25%;">'+totalCheckOut.toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</p>'
        $('.checkout-item-totalPay').html(xhtmlCheckOut)
        xhtmlCheckOut += '</div>'

        var xhtmlButtonPay = '';
        xhtmlButtonPay += '<a style="cursor:pointer" onclick="addBill()">Thanh toán</a>'
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
    // console.log(idColorChange)
    // console.log('#cart-price-'+id)
    var productPriceCart = $('#cart-price-'+idColorChange+'-'+idProductChange).attr('data-colorPrice');

    $('#cart-quantum-'+idColorChange+'-'+idProductChange).val(productQuantumCart)
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
    // console.log(totalCart)
    var totalCheckOut = totalCart*(1-parseInt($('.checkOutPromotion p').text().replace(/\D/g, ''))/100) 
    $('.checkOutPrice p').html(totalCart.toLocaleString('vi', {style : 'currency', currency : 'VND'}))
    $('.checkOutToTalPrice p').html(totalCheckOut.toLocaleString('vi', {style : 'currency', currency : 'VND'}))
}

function addBill(){

    var productInfos = []

    var productInfoArray = $('.form-cart-content')

    for (var i = 0; i < productInfoArray.length; i++) {
        // console.log(productInfoArray[i])
        var productInfo = {}
        productInfo.productId = $(productInfoArray[i]).attr('data-productId')
        productInfo.productColorId = $(productInfoArray[i]).attr('data-productColorId')
        productInfo.productName =  $(productInfoArray[i]).attr('data-productName')
        productInfo.productImage =  $(productInfoArray[i]).attr('data-productImage')
        productInfo.productColorCode =  $(productInfoArray[i]).attr('data-productColor')
        productInfo.productQuantity =  $(productInfoArray[i]).find("input").val()
        productInfo.productPrice =  ($(productInfoArray[i]).attr('data-productPrice'))*productInfo.productQuantity

        productInfos.push(productInfo)

        
    }
    // console.log(productInfos)
    var billPrice = $('.checkOutPrice p').text().replace(/\D/g, '');

    var billPromotion = $('.checkOutPromotion p').text().replace(/\D/g, '');

    var totalPrice = $('.checkOutToTalPrice p').text().replace(/\D/g, '');

    // console.log(totalPrice)
    var clientName = $('input[name="nameUser"]').val();

    var clientEmail = $('input[name="email"]').val();

    var clientPhoneNumber = $('input[name="phoneNumber"]').val();

    var clientAddress = $('input[name="address"]').val();

    var clientDescription = $('textarea').val()

    // console.log(productInfos)
    // console.log(totalPrice)

    // console.log(clientName)

    // console.log(email)

    // console.log(phoneNumber)

    // console.log(address)

    $.ajax({
        url: '/checkout/addBill',
        type: 'post',
        data: {
            productInfos : productInfos ,
            totalPrice : totalPrice , 
            billPrice : billPrice , 
            billPromotion : billPromotion,
            clientName : clientName , 
            clientEmail : clientEmail ,
            clientPhoneNumber : clientPhoneNumber ,
            clientAddress : clientAddress ,
            clientDescription : clientDescription
        } ,
        dataType: 'json'
    }).done(function(results){
      if (results.status == true) {
        $.confirm({
          title: 'Thông Báo!',
          content: 
          '<span class="text-success"><strong class="fa fa-check"></strong>Cảm ơn quý khách ! Hóa đơn của quý khách đã được tạo thành công .</span>'
          ,
          buttons: {
            'Tiếp tục mua hàng': function () {
              window.location.replace("/");
              localStorage.removeItem("cart");
          }
      }
  });
    }else{
        console.log(results.errors)
        $.alert({
          title: 'Thông Báo !',
          content: '<span class="text-danger"><strong class="fa fa-close"></strong>'+results.errors[0].msg+'</span>',
      })
    }
})


}