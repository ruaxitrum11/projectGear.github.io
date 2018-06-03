

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


 
  // function showInfoProfile(userIdCurrent){
  //  $.ajax({
  //   url: '/user/showInfoUser',
  //   type: 'post',
  //   data: {
  //    userIdCurrent : userIdCurrent
  //  },
  //  dataType: 'json',
  //     // dataType: 'json',
  //   }).done(function(results){
  // 	// console.log(results)

  // 	var xhtml = '';
  // 	xhtml += '<div class="user-info-profile">';
  // 	xhtml += '<h2 class="user-info-right-title">Thông tin cá nhân</h2>';
  // 	xhtml += '<div class="user-right-content">';
  // 	xhtml += '<div class="user-right-item">';
  // 	xhtml += '<p>Họ tên</p>';
  // 	xhtml += '<input type="text" name="nameUser" value="'+results.userInforProfile.nameUser+'">';
  // 	xhtml += '</div>';
  // 	xhtml += '<div class="user-right-item">';
  // 	xhtml += '<p>Ảnh đại diện</p>';
  // 	xhtml += '<input id="fileAvatar" type="file" name="file">';
  // 	xhtml += '<img id="avatarPreview" src="" style="width: 25%; margin : 15px 0" >';
  // 	xhtml += '</div>	';
  // 	xhtml += '<div class="user-right-item">';
  // 	xhtml += '<p>Email</p>';
  // 	xhtml += '<input type="text" disabled name="email" value="'+results.userInforProfile.email+'">';
  // 	xhtml += '</div>';
  // 	xhtml += '<div class="user-right-item">';
  // 	xhtml += '<p>Số điện thoại</p>';
  // 	xhtml += '<input type="text" disabled name="phoneNumber" value="'+results.userInforProfile.phoneNumber+'">';
  // 	xhtml += '</div>	';
  // 	xhtml += '<div class="user-right-item">';
  // 	xhtml += '<p>Địa chỉ</p>';
  // 	xhtml += '<input type="text" name="address" value="'+results.userInforProfile.address+'">';
  // 	xhtml += '</div>	';
  // 	xhtml += '<div class="user-right-item">';
  // 	xhtml += '<p>Ngày Sinh</p>';
  // 	xhtml += '<input type="date" name="birthDay" value="'+moment(results.userInforProfile.birthDay).format('YYYY-MM-DD')+'">';
  // 	xhtml += '</div>';
  // 	xhtml += '<div class="user-right-item">';
  // 	xhtml += '<p>Giới Tính</p>';
  // 	if(results.userInforProfile.gender == 0) {
  // 		xhtml += '<input type="radio" name="gender" value="0" style="width: 5%" checked><span style="font-size: 1.6rem;font-weight: 600" >Nam</span>';
  // 		xhtml += '<input type="radio" name="gender" value="1" style="width: 5%"><span style="font-size: 1.6rem;font-weight: 600" >Nữ</span>';
  // 	}else {
  // 		xhtml += '<input type="radio" name="gender" value="0" style="width: 5%"><span style="font-size: 1.6rem;font-weight: 600" >Nam</span>';
  // 		xhtml += '<input type="radio" name="gender" value="1" style="width: 5%;margin-left: 25px" checked><span style="font-size: 1.6rem;font-weight: 600" >Nữ</span>';
  		
  // 	}
  // 	xhtml += '</div>';
  // 	xhtml += '<div class="user-right-item user-right-item-button">';
  // 	xhtml += '<input type="button" name="" value="Cập nhật" onclick="updateUserInfo(\''+results.userInforProfile._id+'\')">';
  // 	xhtml += '</div>';
  // 	xhtml += '</div>';
  // 	xhtml += '</div>';

  // 	$('.user-info-main').html(xhtml)
  // })

  // }

  // $(document).ready(function(){
  //   showOderHistory(1)
  // })



  

// function showInfoLevel(userIdCurrent){

// 	$.ajax({
// 		url: '/user/showInfoUser',
// 		type: 'post',
// 		data: {
// 			userIdCurrent : userIdCurrent
// 		},
// 		dataType: 'json',
//       // dataType: 'json',
//     }).done(function(results){
//      var totalPrice = 0;
//      // console.log(results.userBill)

//      if(results.userBill && results.userBill.length){
//        for (var i = 0; i < results.userBill.length; i++) {
//         totalPrice += results.userBill[i].emailForeign.totalPrice
//       }
//     }
//     // console.log(results.userInforProfile.level)
//     var xhtml =''
//     xhtml += '<div class="user-info-trophy">';
//     xhtml += '<h2 class="user-info-right-title">Danh Hiệu</h2>';
//     xhtml += '<div class="user-right-content">';
//     if (results.userInforProfile.level == 1) {
//       xhtml += '<div class="user-trophy-content trophy-type">';
//       xhtml += '<p>Loại danh hiệu</p>';
//       xhtml += '<span>Member</span>';
//       xhtml += '</div>';
//       xhtml += '<div class="user-trophy-content trophy-thumb">';
//       xhtml += '<p>Ảnh danh hiệu</p>';
//       xhtml += '<span>';
//       xhtml += '<img src="/img/homepage/member.png">';
//       xhtml += '</span>';
//       xhtml += '</div>';
//       xhtml += '<div class="user-trophy-content trophy-discount">';
//       xhtml += '<p>Giảm Giá</p>';
//       xhtml += '<span>0%</span>';
//       xhtml += '</div>';
//       xhtml += '<div class="user-trophy-content trophy-totalmoney">';
//       xhtml += '<p>Tổng tiền giao dịch</p>';
//       xhtml += '<span>'+totalPrice.toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</span>';
//       xhtml += '</div>';
//     }
//     if (results.userInforProfile.level == 2) {
//       xhtml += '<div class="user-trophy-content trophy-type">';
//       xhtml += '<p>Loại danh hiệu</p>';
//       xhtml += '<span>Silver Member</span>';
//       xhtml += '</div>';
//       xhtml += '<div class="user-trophy-content trophy-thumb">';
//       xhtml += '<p>Ảnh danh hiệu</p>';
//       xhtml += '<span>';
//       xhtml += '<img src="/img/homepage/silver.png">';
//       xhtml += '</span>';
//       xhtml += '</div>';
//       xhtml += '<div class="user-trophy-content trophy-discount">';
//       xhtml += '<p>Giảm Giá</p>';
//       xhtml += '<span>3%</span>';
//       xhtml += '</div>';
//       xhtml += '<div class="user-trophy-content trophy-totalmoney">';
//       xhtml += '<p>Tổng tiền giao dịch</p>';
//       xhtml += '<span>'+totalPrice.toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</span>';
//       xhtml += '</div>';
//     }
//     if (results.userInforProfile.level == 3) {
//       xhtml += '<div class="user-trophy-content trophy-type">';
//       xhtml += '<p>Loại danh hiệu</p>';
//       xhtml += '<span>Gold Member</span>';
//       xhtml += '</div>';
//       xhtml += '<div class="user-trophy-content trophy-thumb">';
//       xhtml += '<p>Ảnh danh hiệu</p>';
//       xhtml += '<span>';
//       xhtml += '<img src="/img/homepage/gold.png">';
//       xhtml += '</span>';
//       xhtml += '</div>';
//       xhtml += '<div class="user-trophy-content trophy-discount">';
//       xhtml += '<p>Giảm Giá</p>';
//       xhtml += '<span>6%</span>';
//       xhtml += '</div>';
//       xhtml += '<div class="user-trophy-content trophy-totalmoney">';
//       xhtml += '<p>Tổng tiền giao dịch</p>';
//       xhtml += '<span>'+totalPrice.toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</span>';
//       xhtml += '</div>';
//     }
//     if (results.userInforProfile.level == 4) {
//       xhtml += '<div class="user-trophy-content trophy-type">';
//       xhtml += '<p>Loại danh hiệu</p>';
//       xhtml += '<span>Platinum Member</span>';
//       xhtml += '</div>';
//       xhtml += '<div class="user-trophy-content trophy-thumb">';
//       xhtml += '<p>Ảnh danh hiệu</p>';
//       xhtml += '<span>';
//       xhtml += '<img src="/img/homepage/platinum.png">';
//       xhtml += '</span>';
//       xhtml += '</div>';
//       xhtml += '<div class="user-trophy-content trophy-discount">';
//       xhtml += '<p>Giảm Giá</p>';
//       xhtml += '<span>10%</span>';
//       xhtml += '</div>';
//       xhtml += '<div class="user-trophy-content trophy-totalmoney">';
//       xhtml += '<p>Tổng tiền giao dịch</p>';
//       xhtml += '<span>'+totalPrice.toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</span>';
//       xhtml += '</div>';
//     }
//     xhtml += '<div class="user-trophy-content trophy-info">';
    

//   	//check level silver

//   	if (results.userInforProfile.level == 1 && (parseInt(totalPrice)-15000000 >= 0) ){
//       xhtml += '<p>Nâng cấp danh hiệu</p>';
//   		xhtml += '<div class="input-level" style="width:100%;float:left;margin:20px 0;">'
//   		xhtml += '<input checked type="radio" name="level" value="2" style="width: 5%;float:left"><span style="font-size: 1.6rem;" >Silver Member</span>';
//   		xhtml += '</div>';
//   		xhtml += '<button onclick="upLevelUser(\''+results.userInforProfile._id+'\')" style="float:left;margin-top:20px;padding: 15px 30px;background-color: #FF6602;"><i class="fa fa-arrow-up" style="font-size:2rem;color:#fff;"></i></button>'
//   	}

//   	if (results.userInforProfile.level == 2 && (parseInt(totalPrice)-25000000 >= 0 )){
//       xhtml += '<p>Nâng cấp danh hiệu</p>';
//   		xhtml += '<div class="input-level" style="width:100%;float:left;margin:20px 0;">'
//   		xhtml += '<input checked type="radio" name="level" value="3" style="width: 5%;float:left"><span style="font-size: 1.6rem;" >Gold Member</span>';
//   		xhtml += '</div>';
//   		xhtml += '<button onclick="upLevelUser(\''+results.userInforProfile._id+'\')" style="float:left;margin-top:20px;padding: 15px 30px;background-color: #FF6602;"><i class="fa fa-arrow-up" style="font-size:2rem;color:#fff;"></i></button>'
//   	}

//   	//check level gold
//   	if(results.userInforProfile.level == 3 && ( parseInt(totalPrice)-50000000 >= 0 ) ) {
//       xhtml += '<p>Nâng cấp danh hiệu</p>';
//   		xhtml += '<div class="input-level" style="width:100%;float:left;margin:20px 0;">'
//   		xhtml += '<input checked type="radio" name="level" value="4" style="width: 5%;float:left"><span style="font-size: 1.6rem;" >Platinum Member</span>';
//   		xhtml += '</div>';
//   		xhtml += '<button onclick="upLevelUser(\''+results.userInforProfile._id+'\')" style="float:left;margin-top:20px;padding: 15px 30px;background-color: #FF6602;"><i class="fa fa-arrow-up" style="font-size:2rem;color:#fff;"></i></button>'
//   	}else {
//   		xhtml += ''
//   	}
  	
//   	xhtml += '</div>';
//   	xhtml += '<div class="user-trophy-content trophy-info">';
//   	xhtml += '<a href="/aboutUs#upMedals">Thông tin danh hiệu</a>';
//   	xhtml += '</div>';
//   	xhtml += '</div>';
//   	xhtml += '</div>';

//   	$('.user-info-main').html(xhtml)
//   })
  
// }


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

 

 function postChangePass(userIdCurrent) {

   var current_pass = $("input[name=current_pass]").val();
   var new_pass = $("input[name=new_pass]").val();
   var confirm_new_pass = $("input[name=confirm_new_pass]").val();
  
   $.ajax({
    url: '/user/changePassword',
    type: 'post',
    data: {

     userIdCurrent : userIdCurrent,
     current_pass : current_pass,
     new_pass : new_pass ,
     confirm_new_pass : confirm_new_pass
   },
   dataType: 'json',
      // dataType: 'json',
    }).done(function(results){
     if (results.status == true) {
      $.confirm({
       title: 'Thông báo !',
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