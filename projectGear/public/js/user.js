

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