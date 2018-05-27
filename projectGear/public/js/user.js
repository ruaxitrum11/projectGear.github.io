

$("#fileAvatar").change(function() {
	readURL(this);
});

//upload 
function updateUserInfo(userIdUpdate){
	var nameUser = $("input[name=nameUser]").val();
	var avatar =  $('input[type=file]')[0].files[0]
	var email = $("input[name=email]").val(); 
	var phoneNumber = $("input[name=phoneNumber]").val(); 
	var address = $("input[name=address]").val(); 
	var birthDay = $("input[name=birthDay]").val();
	var gender = $("input[name=gender]:checked").val(); 
	var userIdUpdate = userIdUpdate;
	var formData = new FormData();
	// console.log(nameUser)
	// console.log(avatar)
	// console.log(email)
	// console.log(phoneNumber)
	// console.log(dateOfBirth)
	// console.log(gender)
	// console.log(userIdUpdate)
	

	formData.append('nameUser',nameUser)
	formData.append('file',avatar)
	formData.append('email', email)
	formData.append('phoneNumber', phoneNumber)
	formData.append('address', address)
	formData.append('birthDay', birthDay)
	formData.append('gender', gender)
	formData.append('userIdUpdate', userIdUpdate)



	$.ajax({
		url: '/user/updateUserInfo',
		type: 'post',
		data: formData,
		contentType:false,
		processData:false
      // dataType: 'json',
    }).done(function(results){
     console.log(results);
     if (results.status == true) {
      $.confirm({
       title: 'Thông báo!',
       content:'<span class="text-success"><strong class="fa fa-check"></strong> Cập nhật tài khoản thành công !</span>',
       buttons: {
        'Ok': function () {
         window.location.reload();
       }
     }

   });
    }else{
      console.log(results)
      $.alert({
       title: 'Thông Báo !',
       content: '<span class="text-danger"><strong class="fa fa-close"></strong>'+results.errors+'</span>'
     })

    }

  })
  }


  $(document).ready(function(){
   $('.user-info-left ul li').click(function(){
    $('li').removeClass("user-info-left-active");
    $(this).addClass("user-info-left-active");
  });
 });

  function showInfoProfile(userIdCurrent){
   $.ajax({
    url: '/user/showInfoUser',
    type: 'post',
    data: {
     userIdCurrent : userIdCurrent
   },
   dataType: 'json',
      // dataType: 'json',
    }).done(function(results){
  	// console.log(results)

  	var xhtml = '';
  	xhtml += '<div class="user-info-profile">';
  	xhtml += '<h2 class="user-info-right-title">Thông tin cá nhân</h2>';
  	xhtml += '<div class="user-right-content">';
  	xhtml += '<div class="user-right-item">';
  	xhtml += '<p>Họ tên</p>';
  	xhtml += '<input type="text" name="nameUser" value="'+results.userInforProfile.nameUser+'">';
  	xhtml += '</div>';
  	xhtml += '<div class="user-right-item">';
  	xhtml += '<p>Ảnh đại diện</p>';
  	xhtml += '<input id="fileAvatar" type="file" name="file">';
  	xhtml += '<img id="avatarPreview" src="" style="width: 25%; margin : 15px 0" >';
  	xhtml += '</div>	';
  	xhtml += '<div class="user-right-item">';
  	xhtml += '<p>Email</p>';
  	xhtml += '<input type="text" disabled name="email" value="'+results.userInforProfile.email+'">';
  	xhtml += '</div>';
  	xhtml += '<div class="user-right-item">';
  	xhtml += '<p>Số điện thoại</p>';
  	xhtml += '<input type="text" disabled name="phoneNumber" value="'+results.userInforProfile.phoneNumber+'">';
  	xhtml += '</div>	';
  	xhtml += '<div class="user-right-item">';
  	xhtml += '<p>Địa chỉ</p>';
  	xhtml += '<input type="text" name="address" value="'+results.userInforProfile.address+'">';
  	xhtml += '</div>	';
  	xhtml += '<div class="user-right-item">';
  	xhtml += '<p>Ngày Sinh</p>';
  	xhtml += '<input type="date" name="birthDay" value="'+moment(results.userInforProfile.birthDay).format('YYYY-MM-DD')+'">';
  	xhtml += '</div>';
  	xhtml += '<div class="user-right-item">';
  	xhtml += '<p>Giới Tính</p>';
  	if(results.userInforProfile.gender == 0) {
  		xhtml += '<input type="radio" name="gender" value="0" style="width: 5%" checked><span style="font-size: 1.6rem;font-weight: 600" >Nam</span>';
  		xhtml += '<input type="radio" name="gender" value="1" style="width: 5%"><span style="font-size: 1.6rem;font-weight: 600" >Nữ</span>';
  	}else {
  		xhtml += '<input type="radio" name="gender" value="0" style="width: 5%"><span style="font-size: 1.6rem;font-weight: 600" >Nam</span>';
  		xhtml += '<input type="radio" name="gender" value="1" style="width: 5%;margin-left: 25px" checked><span style="font-size: 1.6rem;font-weight: 600" >Nữ</span>';
  		
  	}
  	xhtml += '</div>';
  	xhtml += '<div class="user-right-item user-right-item-button">';
  	xhtml += '<input type="button" name="" value="Cập nhật" onclick="updateUserInfo(\''+results.userInforProfile._id+'\')">';
  	xhtml += '</div>';
  	xhtml += '</div>';
  	xhtml += '</div>';

  	$('.user-info-main').html(xhtml)
  })

  }

  function showOderHistory(userIdCurrent,page){
    // console.log(page)
    $.ajax({
      url: '/user/showOderHistory',
      type: 'post',
      data: {
       userIdCurrent : userIdCurrent,
       page: page
     },
     dataType: 'json',
      // dataType: 'json',
    }).done(function(results){
     if(results.status){
      var xhtml = '';
  		// console.log(results.userInformation)
  		xhtml += ' <div class="user-info-order">';
  		xhtml += '<h2 class="user-info-right-title">Lịch sử giao dịch</h2>'
  		xhtml += '<div class="user-right-content">';
  		xhtml += '<table class="table table-hover" style="text-align:center">';
  		xhtml += '<thead>';
  		xhtml += '	<tr>';
  		xhtml += '<th style="text-align:center">Mã Giao Dịch</th>';
  		xhtml += '<th style="text-align:center">Tổng tiền</th>';
  		xhtml += '<th style="text-align:center">Thời gian tạo</th>';
      xhtml += '<th style="text-align:center">Thời gian cập nhật</th>';
      xhtml += '<th style="text-align:center">Trạng Thái</th>';
      xhtml += '<th style="text-align:center">Thao tác</th>';
      xhtml += '</tr>';
      xhtml += '</thead>';
      xhtml += '<tbody>';

  		// console.log(results.userInformation.emailForeign[0].productInfos)
  		if(results.userInformation.emailForeign && results.userInformation.emailForeign.length){
  			for (var i = 0; i < results.userInformation.emailForeign.length; i++) {
  				xhtml += '<tr>';
  				xhtml += '<td style ="font-weight:bold">'+results.userInformation.emailForeign[i].billNumber+'</td>';
  				xhtml += '<td>'+results.userInformation.emailForeign[i].totalPrice.toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</td>';
  				xhtml += '<td>'+moment(results.userInformation.emailForeign[i].createdAt).format('DD-MM-YYYY')+'</td>';
          xhtml += '<td>'+moment(results.userInformation.emailForeign[i].updatedAt).format('DD-MM-YYYY')+'</td>';
          if (results.userInformation.emailForeign[i].status == 1 ) {
           xhtml += '<td><span class="label label-primary">Đang xử lý</span></td>'
         } else if (results.userInformation.emailForeign[i].status == 2 ) {
           xhtml += '<td><span class="label label-success">Đã hoàn thành</span></td>'
         }else if (results.userInformation.emailForeign[i].status == 3 ) {
           xhtml += '<td><span class="label label-danger">Hủy bỏ</span></td>'
         }
         xhtml += '<td><a style="text-decoration : none ; cursor:pointer" data-toggle="modal" data-target="#modal-'+results.userInformation.emailForeign[i]._id+'"><span class="label label-primary">Xem </span></a>';
         if(results.userInformation.emailForeign[i].status == 1 ){
           xhtml += '<a style="text-decoration : none ; cursor:pointer ; margin-left:10px;" onclick="confirmCompleted(\''+results.userInformation.emailForeign[i]._id+'\')"><span class="label label-success"> Xác nhận</span></a>'
         }
  				// Modal info
  				xhtml += '<div class="modal fade" id="modal-'+results.userInformation.emailForeign[i]._id+'" role="dialog">';
  				xhtml += '<div class="modal-dialog orderDetails">';
  				xhtml += '<div class="modal-order-content modal-content">';
  				xhtml += '<div class="order-details id-recieved">';
  				xhtml += '<p>Mã Đơn hàng</p>';
  				xhtml += '<span>'+results.userInformation.emailForeign[i].billNumber+'</span>';
  				xhtml += '</div>';
  				xhtml += '<div class="order-details day-recieved">';
  				xhtml += '<p>Trạng thái</p>';
  				
  				if(results.userInformation.emailForeign[i].status == 1){
  					xhtml += '<span class="label label-primary"  style="width:30%!important;padding-top:10px ; padding-bottom:10px;margin-left:10%;">Đang xử lý</span>';
  				}else if(results.userInformation.emailForeign[i].status == 2){
  					xhtml += '<span class="label label-success"  style="width:30%!important;padding-top:10px ; padding-bottom:10px;margin-left:10%;">Đã hoàn thành</span>';
  				}else if(results.userInformation.emailForeign[i].status == 3){
  					xhtml += '<span class="label label-danger" style="width:30%!important;padding-top:10px ; padding-bottom:10px;margin-left:10%;">Hủy Bỏ</span>';
  				}
  				xhtml += '</div>';
  				xhtml += '<div class="order-details user-recieved">';
  				xhtml += '<p>Người nhận hàng</p>';
  				xhtml += '<span>'+results.userInformation.emailForeign[i].clientName+'</span>';
  				xhtml += '</div>';
  				xhtml += '<div class="order-details address-recieved">';
  				xhtml += '<p>Địa chỉ nhận hàng</p>';
  				xhtml += '<span>'+results.userInformation.emailForeign[i].clientAddress+'</span>';
  				xhtml += '</div>';
  				xhtml += '<div class="order-details phone-recieved">';
  				xhtml += '<p>Số điện thoại</p>';
  				xhtml += '<span>'+results.userInformation.emailForeign[i].clientPhoneNumber+'</span>';
  				xhtml += '</div>';
  				xhtml += '<div class="order-details email-recieved">';
  				xhtml += '<p>Email</p>';
  				xhtml += '<span>'+results.userInformation.emailForeign[i].clientEmail+'</span>';
  				xhtml += '</div>';
  				xhtml += '<div class="order-details day-recieved">';
  				xhtml += '<p>Ngày tạo đơn hàng</p>';
  				xhtml += '<span>'+moment(results.userInformation.emailForeign[i].createdAt).format('HH:mm , DD-MM-YYYY')+'</span>';
  				xhtml += '</div>';
          xhtml += '<div class="order-details day-recieved">';
          xhtml += '<p>Ngày cập nhật đơn hàng</p>';
          xhtml += '<span>'+moment(results.userInformation.emailForeign[i].updatedAt).format('HH:mm , DD-MM-YYYY')+'</span>';
          xhtml += '</div>';
          xhtml += '<div class="order-details day-recieved">';
          xhtml += '<p>Tổng hóa đơn (VNĐ)</p>';
          xhtml += '<span>'+results.userInformation.emailForeign[i].billPrice.toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</span>';
          xhtml += '</div>';
          xhtml += '<div class="order-details day-recieved">';
          xhtml += '<p>Khuyến mãi (VNĐ)</p>';
          xhtml += '<span>'+results.userInformation.emailForeign[i].billPromotion+' %</span>';
          xhtml += '</div>';
          xhtml += '<div class="order-details day-recieved">';
          xhtml += '<p>tổng thanh toán (VNĐ)</p>';
          xhtml += '<span>'+results.userInformation.emailForeign[i].totalPrice.toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</span>';
          xhtml += '</div>';
          xhtml += '<div class="order-details details-recieved">';
          xhtml += '<p>Chi tiết sản phẩm</p>';
          xhtml += '</div>';
          xhtml += '<div class="order-details product-recieved">';
          xhtml += '<div class="order-details product-recieved-drop">';
          xhtml += '<ul class="product-recieved-menu">';
          xhtml += '<li>Sản Phẩm</li>';
          xhtml += '<li>Hình ảnh</li>';
          xhtml += '<li>Giá(VNĐ)</li>';
          xhtml += '<li>Số lượng</li>';
          xhtml += '<li>Thành tiền(VNĐ)</li>';
          xhtml += '</ul>';
  				// console.log(results.userInformation.emailForeign[i])
  				for (var j = 0; j < results.userInformation.emailForeign[i].productInfos.length; j++) {	
  					// console.log(results.userInformation.emailForeign[i])
  					// console.log(results.userInformation.emailForeign[i].productInfos[j])
  					xhtml += '<ul class="product-recieved-content">';
  					xhtml +='<li>'+results.userInformation.emailForeign[i].productInfos[j].productName+'</li>';
  					xhtml +='<li><img src="/upload/thumbProduct/'+results.userInformation.emailForeign[i].productInfos[j].productImage+'"></li>';
  					var pricePerProduct = parseInt(results.userInformation.emailForeign[i].productInfos[j].productPrice)/ parseInt(results.userInformation.emailForeign[i].productInfos[j].productQuantity)
  					xhtml +='<li>'+pricePerProduct.toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</li>';
  					xhtml +='<li>'+results.userInformation.emailForeign[i].productInfos[j].productQuantity+'</li>';
  					

  					xhtml +='<li>'+results.userInformation.emailForeign[i].productInfos[j].productPrice.toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</li>';
  					xhtml += '</ul>';
  				}
  				xhtml += '</div>';
  				xhtml += '</div>';
  				
  				xhtml += '</div>';
  				xhtml += '</div>';
  				xhtml += '</div>';

  				//End modal


  				xhtml += '</tr>';
  				
  			}
  		}else {
  			xhtml += '<tr><td>Không tìm thấy giao dịch của bạn !</td></tr>'
  		}

  		xhtml += '</tbody>';
  		xhtml += '</table>';
  		xhtml += '</div>';
  		xhtml += '</div>';



  		$('.user-info-main').html(xhtml)

      if(results.totalPage > 1) {
        var pagiHtml = '';
        pagiHtml ='<ul class="pagination">';
        if (results.page != 1){ 
          var pagePriv = parseInt(results.page) - 1; 
          pagiHtml += '<li class="" ><a href="javascript:void(0)" onclick="listUser(1)""><i class="fa fa-step-backward" aria-hidden="true"></i></a></li>  ';                  
          pagiHtml += '<li class="" ><a href="javascript:void(0)" onclick="listUser('+ pagePriv +')"><i class="fa fa-chevron-left" aria-hidden="true"></i></a></li>';
        }

        var _begin =  results.page - 8; 
        var _end = results.page + 8;
        if (_begin < 1){ 
          _begin = 1;
        }
        if (_end > results.totalPage ) {
          _end = results.totalPage;
        } 
        for (var i = _begin; i <= _end; i++) {
          if(results.page == i) { 
            pagiHtml += '<li class="active" ><a href="javascript:void(0)">'+ i +'</a></li>';
          } else { 
            pagiHtml += '<li><a href="javascript:void(0)" onclick="listUser('+ i +')">'+i+'</a></li>';
          }
        } 
        if (results.page < results.totalPage ) {
          var pageNext = parseInt(results.page) + 1; 
          pagiHtml += '<li class="" ><a href="javascript:void(0)" onclick="listUser('+ pageNext +')"><i class="fa fa-chevron-right" aria-hidden="true"></i></a></li>';
          pagiHtml += '<li class="" ><a href="javascript:void(0)" onclick="listUser('+ results.totalPage +')"><i class="fa fa-step-forward" aria-hidden="true"></i></a></li>';
        } 
        pagiHtml += '</ul>';

        $('#pagination-list-user').html(pagiHtml);
      } else {
        $('#pagination-list-user').html('');
      }
    }
  })
}

function showInfoLevel(userIdCurrent){

	$.ajax({
		url: '/user/showInfoUser',
		type: 'post',
		data: {
			userIdCurrent : userIdCurrent
		},
		dataType: 'json',
      // dataType: 'json',
    }).done(function(results){
     var totalPrice = 0;
     for (var i = 0; i < results.userBill.emailForeign.length; i++) {
      totalPrice += results.userBill.emailForeign[i].totalPrice
    }
  	// console.log(totalPrice)
  	var xhtml =''
  	xhtml += '<div class="user-info-trophy">';
  	xhtml += '<h2 class="user-info-right-title">Danh Hiệu</h2>';
  	xhtml += '<div class="user-right-content">';
  	if (results.userInforProfile.level == 1) {
  		xhtml += '<div class="user-trophy-content trophy-type">';
  		xhtml += '<p>Loại danh hiệu</p>';
  		xhtml += '<span>Member</span>';
  		xhtml += '</div>';
  		xhtml += '<div class="user-trophy-content trophy-thumb">';
  		xhtml += '<p>Ảnh danh hiệu</p>';
  		xhtml += '<span>';
  		xhtml += '<img src="/img/homepage/member.png">';
  		xhtml += '</span>';
  		xhtml += '</div>';
  		xhtml += '<div class="user-trophy-content trophy-discount">';
  		xhtml += '<p>Giảm Giá</p>';
  		xhtml += '<span>0%</span>';
  		xhtml += '</div>';
  		xhtml += '<div class="user-trophy-content trophy-totalmoney">';
  		xhtml += '<p>Tổng tiền giao dịch</p>';
  		xhtml += '<span>'+totalPrice.toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</span>';
  		xhtml += '</div>';
  	}
  	if (results.userInforProfile.level == 2) {
  		xhtml += '<div class="user-trophy-content trophy-type">';
  		xhtml += '<p>Loại danh hiệu</p>';
  		xhtml += '<span>Silver Member</span>';
  		xhtml += '</div>';
  		xhtml += '<div class="user-trophy-content trophy-thumb">';
  		xhtml += '<p>Ảnh danh hiệu</p>';
  		xhtml += '<span>';
  		xhtml += '<img src="/img/homepage/silver.png">';
  		xhtml += '</span>';
  		xhtml += '</div>';
  		xhtml += '<div class="user-trophy-content trophy-discount">';
  		xhtml += '<p>Giảm Giá</p>';
  		xhtml += '<span>3%</span>';
  		xhtml += '</div>';
  		xhtml += '<div class="user-trophy-content trophy-totalmoney">';
  		xhtml += '<p>Tổng tiền giao dịch</p>';
  		xhtml += '<span>'+totalPrice.toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</span>';
  		xhtml += '</div>';
  	}
  	if (results.userInforProfile.level == 3) {
  		xhtml += '<div class="user-trophy-content trophy-type">';
  		xhtml += '<p>Loại danh hiệu</p>';
  		xhtml += '<span>Gold Member</span>';
  		xhtml += '</div>';
  		xhtml += '<div class="user-trophy-content trophy-thumb">';
  		xhtml += '<p>Ảnh danh hiệu</p>';
  		xhtml += '<span>';
  		xhtml += '<img src="/img/homepage/gold.png">';
  		xhtml += '</span>';
  		xhtml += '</div>';
  		xhtml += '<div class="user-trophy-content trophy-discount">';
  		xhtml += '<p>Giảm Giá</p>';
  		xhtml += '<span>6%</span>';
  		xhtml += '</div>';
  		xhtml += '<div class="user-trophy-content trophy-totalmoney">';
  		xhtml += '<p>Tổng tiền giao dịch</p>';
  		xhtml += '<span>'+totalPrice.toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</span>';
  		xhtml += '</div>';
  	}
  	if (results.userInforProfile.level == 4) {
  		xhtml += '<div class="user-trophy-content trophy-type">';
  		xhtml += '<p>Loại danh hiệu</p>';
  		xhtml += '<span>Platinum Member</span>';
  		xhtml += '</div>';
  		xhtml += '<div class="user-trophy-content trophy-thumb">';
  		xhtml += '<p>Ảnh danh hiệu</p>';
  		xhtml += '<span>';
  		xhtml += '<img src="/img/homepage/platinum.png">';
  		xhtml += '</span>';
  		xhtml += '</div>';
  		xhtml += '<div class="user-trophy-content trophy-discount">';
  		xhtml += '<p>Giảm Giá</p>';
  		xhtml += '<span>10%</span>';
  		xhtml += '</div>';
  		xhtml += '<div class="user-trophy-content trophy-totalmoney">';
  		xhtml += '<p>Tổng tiền giao dịch</p>';
  		xhtml += '<span>'+totalPrice.toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</span>';
  		xhtml += '</div>';
  	}
  	xhtml += '<div class="user-trophy-content trophy-info">';
  	xhtml += '<p>Nâng cấp danh hiệu</p>';

  	//check level silver

  	if (results.userInforProfile.level == 1 && (parseInt(totalPrice)-15000000 >= 0 && parseInt(totalPrice)-25000000 < 0) ){
  		xhtml += '<div class="input-level" style="width:100%;float:left;margin:20px 0;">'
  		xhtml += '<input checked type="radio" name="level" value="2" style="width: 5%;float:left"><span style="font-size: 1.6rem;" >Silver Member</span>';
  		xhtml += '</div>';
  		xhtml += '<button onclick="upLevelUser(\''+results.userInforProfile._id+'\')" style="float:left;margin-top:20px;padding: 15px 30px;background-color: #FF6602;"><i class="fa fa-arrow-up" style="font-size:2rem;color:#fff;"></i></button>'
  	}

  	if (results.userInforProfile.level == 2 && (parseInt(totalPrice)-25000000 >= 0 && parseInt(totalPrice)-50000000 < 0)){
  		xhtml += '<div class="input-level" style="width:100%;float:left;margin:20px 0;">'
  		xhtml += '<input checked type="radio" name="level" value="3" style="width: 5%;float:left"><span style="font-size: 1.6rem;" >Gold Member</span>';
  		xhtml += '</div>';
  		xhtml += '<button onclick="upLevelUser(\''+results.userInforProfile._id+'\')" style="float:left;margin-top:20px;padding: 15px 30px;background-color: #FF6602;"><i class="fa fa-arrow-up" style="font-size:2rem;color:#fff;"></i></button>'
  	}

  	//check level gold
  	if(results.userInforProfile.level == 3 && ( parseInt(totalPrice)-50000000 >= 0 ) ) {
  		xhtml += '<div class="input-level" style="width:100%;float:left;margin:20px 0;">'
  		xhtml += '<input checked type="radio" name="level" value="4" style="width: 5%;float:left"><span style="font-size: 1.6rem;" >Platinum Member</span>';
  		xhtml += '</div>';
  		xhtml += '<button onclick="upLevelUser(\''+results.userInforProfile._id+'\')" style="float:left;margin-top:20px;padding: 15px 30px;background-color: #FF6602;"><i class="fa fa-arrow-up" style="font-size:2rem;color:#fff;"></i></button>'
  	}else {
  		xhtml += ''
  	}
  	
  	xhtml += '</div>';
  	xhtml += '<div class="user-trophy-content trophy-info">';
  	xhtml += '<a href="#">Thông tin danh hiệu</a>';
  	xhtml += '</div>';
  	xhtml += '</div>';
  	xhtml += '</div>';

  	$('.user-info-main').html(xhtml)
  })

}


//modal toggle order-details-product 
$('.product-recieved').hide();
$('.order-details-toggle').click(function(){
	$('.product-recieved').toggle();
})

//preview Image
function readURL(input) {

	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function(e) {
			$('#avatarPreview').attr('src', e.target.result);
		}

		reader.readAsDataURL(input.files[0]);
	}
}

$("#fileAvatar").change(function() {
	readURL(this);
});

function upLevelUser (userIdCurrent) {
	// console.log(id)
	var level = $('input[name=level]:checked').val()
	console.log(level)
	$.ajax({
		url: '/user/upLevelUser',
		type: 'post',
		data: {
			userIdCurrent : userIdCurrent,
			level : level
		},
		dataType: 'json',
      // dataType: 'json',
    }).done(function(results){
     if (results.status == true) {
      $.confirm({
       title: 'Thông báo!',
       content:'<span class="text-success"><strong class="fa fa-check"></strong>Chúc mừng quý khách đã nâng cấp tài khoản thành công !</span>',
       buttons: {
        'Ok': function () {
         window.location.reload();
       }
     }
   });
    }else{
      console.log(results)
      $.alert({
       title: 'Thông Báo !',
       content: '<span class="text-danger"><strong class="fa fa-close"></strong>'+results.errors[0].msg+'</span>',
     })
    }
  })
  }

  function confirmCompleted(id){
   var status = 2 ;
   $.ajax({
    url: '/user/confirmCompleted',
    type: 'post',
    data: {
     status : status,
     id : id
   },
   dataType: 'json',
      // dataType: 'json',
    }).done(function(results){
     if (results.status == true) {
      $.confirm({
       title: 'Thông báo!',
       content:'<span class="text-success"><strong class="fa fa-check"></strong>Cảm ơn quý khách đã cập nhật đơn hàng thành công ! Nếu có thắc mắc , quý khách vui lòng liên hệ bộ phận hỗ trợ</span>',
       buttons: {
        'Ok': function () {
         window.location.reload();
       }
     }
   });
    }else{
      console.log(results)
      $.alert({
       title: 'Thông Báo !',
       content: '<span class="text-danger"><strong class="fa fa-close"></strong>'+results.errors[0].msg+'</span>',
     })
    }
  })
  }

  function changePassword(userIdCurrent){

   var xhtml = '';
   xhtml += '<div class="user-info-pass">';
   xhtml += '<h2 class="user-info-right-title">Mật khẩu</h2>';
   xhtml += '<div class="user-right-content">';

   xhtml += '<div class="user-right-item user-newpass">';
   xhtml += '<p>Mật khẩu mới</p>';
   xhtml += '<input type="password" name="new_pass">';
   xhtml += '</div>';
   xhtml += '<div class="user-right-item user-confirmpass">';
   xhtml += '<p>xác nhận mật khẩu mới</p>';
   xhtml += '<input type="password" name="confirm_new_pass">';
   xhtml += '</div>';
   xhtml += '<div class="user-right-item user-right-item-button">';
   xhtml += '<input type="button" onclick="postChangePass(\''+userIdCurrent+'\')" value="Cập nhật">';
   xhtml += '</div>';
   xhtml += '</div>';
   xhtml += '</div>';

   $('.user-info-main').html(xhtml)


 }

 function postChangePass(userIdCurrent) {
   var current_pass = $("input[name=current_pass]").val();
   var new_pass = $("input[name=new_pass]").val();
   var confirm_new_pass = $("input[name=confirm_new_pass]").val();
   console.log(current_pass)
   $.ajax({
    url: '/user/changePassword',
    type: 'post',
    data: {
     userIdCurrent : userIdCurrent,
     new_pass : new_pass ,
     confirm_new_pass : confirm_new_pass
   },
   dataType: 'json',
      // dataType: 'json',
    }).done(function(results){
     if (results.status == true) {
      $.confirm({
       title: 'Thông báo!',
       content:'<span class="text-success"><strong class="fa fa-check"></strong> Đổi mật khẩu thành công !</span>',
       buttons: {
        'Ok': function () {
         window.location.reload();
       }
     }

   });

    }else{
      console.log(results)
      $.alert({
       title: 'Thông Báo !',
       content: '<span class="text-danger"><strong class="fa fa-close"></strong>'+results.errors[0].msg+'</span>'
     })

    }
  })
  }