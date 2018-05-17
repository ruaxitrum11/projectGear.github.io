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

$('.user-info-order').fadeOut();
$('.user-info-trophy').fadeOut();
$('.user-info-pass').fadeOut();

$('.user-info-left-profile').click(function(){
	$('.user-info-profile').fadeIn();
	$('.user-info-order').fadeOut();
	$('.user-info-trophy').fadeOut();
	$('.user-info-pass').fadeOut();
})
$('.user-info-left-order').click(function(){
	$('.user-info-order').fadeIn();
	$('.user-info-profile').fadeOut();
	$('.user-info-trophy').fadeOut();
	$('.user-info-pass').fadeOut();
})
$('.user-info-left-trophy').click(function(){
	$('.user-info-order').fadeOut();
	$('.user-info-profile').fadeOut();
	$('.user-info-trophy').fadeIn();
	$('.user-info-pass').fadeOut();
})
$('.user-info-left-pass').click(function(){
	$('.user-info-order').fadeOut();
	$('.user-info-profile').fadeOut();
	$('.user-info-trophy').fadeOut();
	$('.user-info-pass').fadeIn();
})

//modal toggle order-details-product 
$('.product-recieved').hide();
$('.order-details-toggle').click(function(){
	$('.product-recieved').toggle();
})