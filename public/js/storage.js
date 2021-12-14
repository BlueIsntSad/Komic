$('.reading-list:last-child hr').remove();
//$(".user_storage .fuction").hide()

$(document).ready(function () {
    //alert('storage script')

    $("#edit_collection").on('click', function () {
        $('#title_show').attr('style', 'display:none !important');
        $('#title_edit').attr('style', 'display:flex !important');
    })

    $(".edit_done").on('click', function () {
        $('#title_show').attr('style', 'display:flex !important');
        $('#title_edit').attr('style', 'display:none !important');
    })

    $('.user_storage .nav-link').on('click', function (event) {
        event.preventDefault();
        window.location.href = window.location.href.split("?")[0] + `?tab=${this.getAttribute("id").split("-")[1]}`;
    });

    /* $('#save_collections').on('click', function () {
        var a = $('#_title').val();
        alert(a)
    }) */

    /* $('#createCollect').on('click', function () {
        var forms = document.querySelectorAll('.needs-validation')
        Array.prototype.slice.call(forms)
            .forEach(function (form) {
                form.addEventListener('submit', function (event) {
                    if (!form.checkValidity()) {
                        event.preventDefault()
                        event.stopPropagation()
                    }
                    form.classList.add('was-validated')
                }, false)
            })
    })() */
})

function editNameCollection(event, userId, collect) {
    var data = $('#_title').val();
    alert(data)
    showLoading();
    $.ajax({
        method: "PUT",
        url: `/user/${userId}/storage/editCollection/${collect._id}`,
        cache: false,
        timeout: 60000,
        data: { title: data },
        dataType: 'json',
        processData: false,
        contentType: false,
        success: function (result) {
            console.log(result);
            if (result.success) {
                showToast('success', "Thành công", "Cập nhật tên bộ sưu tập thành công!");
            } else {
                showToast('error', "Không thành công", "Cập nhật không thành công!");
            }
            hideLoading();
        },
        error: function (err) {
            console.log(err)
            showToast('error', "Không thành công", "Thêm truyện mới không thành công!");
            hideLoading();
        }
    })
}