$(function () {
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    })

    $("#user_name .edit_name").on('click', function (event) {
        $('#user_name').attr('style', 'display:none !important');
        $('#user_name_form').attr('style', 'display:flex !important');
        event.preventDefault();
    })

    /* $(".edit_done").on('click', function () {
        $('#title_show').attr('style', 'display:flex !important');
        $('#title_edit').attr('style', 'display:none !important');
    }) */
})

/* $(document).click(function(event) { 
    var $target = $(event.target);
    if(!$target.closest('#user_name_form').length && 
    $('#user_name_form').is(":visible")) {
      $('#user_name_form').hide();
    }        
  }); */

function previewImg(event, id) {
    const input = event.target;
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $(`#${id}`).attr('src', e.target.result);
            $(`#${id}`).hide();
            $(`#${id}`).fadeIn(300);
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        $($(`#${id}`)).attr('src', $($(`#${id}`)).attr('defaultSrc'));
    }
}

function updateProfile(event, userId) {
    event.preventDefault();
    //Loading
    $('#savingEdit').prop("disabled", true);
    $('.spinner-border').removeClass('d-none')
    // Form
    var form = $("#editInfoForm")[0];
    var data = new FormData(form);
    $.ajax({
        method: "PUT",
        url: `/user/${userId}`,
        timeout: 60000,
        data: data,
        processData: false,
        contentType: false,
        success: function (result) {
            if (result.isSuccess) {
                var updateUser = result.user;
                $('.background-profile img').attr('src', updateUser.cover)
                $('.avatar-profile img').attr('src', updateUser.avatar)
                $('.overview-profile h2 b').text(updateUser.name)
                if (updateUser.about) { $('#about_bio').text(updateUser.about) }
                if (updateUser.link) { $('#about_link a').attr('href', updateUser.link).text(updateUser.link) }
                if (updateUser.address) { $('#about_address span').text(updateUser.address) }
                showToast("success", "Cập nhật thành công", "Thông tin truyện đã được cập nhật!");
            } else {
                showToast("error", "Không thành công", result.msg);
                console.log(result.msg)
            }
            $('#savingEdit').prop("disabled", false);
            $('.spinner-border').addClass('d-none')
            $('#editInfoModal').modal('toggle');
        },
        error: function (e) {
            showToast("error", "Không thành công", "Có lỗi xảy ra trong quá trình cập nhật!");
            console.log(e.msg)
            $('#savingEdit').prop("disabled", false);
            $('.spinner-border').addClass('d-none')
            $('#editInfoModal').modal('toggle');
        }
    })
}