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

function showOderHistory(userIdCurrent){
	$.ajax({
		url: '/user/showOderHistory',
		type: 'post',
		data: {
			userIdCurrent : userIdCurrent
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
  		xhtml += '<th style="text-align:center">Thời gian</th>';
  		xhtml += '<th style="text-align:center">Trạng Thái</th>';
  		xhtml += '<th style="text-align:center">Thao tác</th>';
  		xhtml += '</tr>';
  		xhtml += '</thead>';
  		xhtml += '<tbody>';

  		console.log(results.userInformation.emailForeign)
  		if(results.userInformation.emailForeign && results.userInformation.emailForeign.length){
  			for (var i = 0; i < results.userInformation.emailForeign.length; i++) {
  				xhtml += '<tr>';
  				xhtml += '<td style ="font-weight:bold">'+results.userInformation.emailForeign[i].billNumber+'</td>';
  				xhtml += '<td>'+results.userInformation.emailForeign[i].totalPrice.toLocaleString('vi', {style : 'currency', currency : 'VND'})+'</td>';
  				xhtml += '<td>'+moment(results.userInformation.emailForeign[i].createdAt).format('DD-MM-YYYY')+'</td>';
  				if (results.userInformation.emailForeign[i].status == 1 ) {
  					xhtml += '<td><span class="label label-primary">Đang xử lý</span></td>'
  				} else if (results.userInformation.emailForeign[i].status == 2 ) {
  					xhtml += '<td><span class="label label-success">Đã hoàn thành</span></td>'
  				}else if (results.userInformation.emailForeign[i].status == 3 ) {
  					xhtml += '<td><span class="label label-danger">Hủy bỏ</span></td>'
  				}
  				xhtml += '<td>john@example.com</td>';
  				xhtml += '</tr>';
  			}
  		}else {
  			xhtml += '<tr><td>Bạn chưa có giao dịch nào !</td></tr>'
  		}

  		xhtml += '</tbody>';
  		xhtml += '</table>';
  		xhtml += '</div>';
  		xhtml += '</div>';

  		

  		$('.user-info-main').html(xhtml)
  	}
  })
}
//modal toggle order-details-product 
$('.product-recieved').hide();
$('.order-details-toggle').click(function(){
	$('.product-recieved').toggle();
})