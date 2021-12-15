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

    /* // Bind click to OK button within popup
    $('#confirm-delete').on('click', '.btn-ok', function (e) {
        var $modalDiv = $(e.delegateTarget);
        var id = $(this).data('recordId');

        $modalDiv.addClass('loading');
        $.post('/api/record/' + id).then(function () {
            $modalDiv.modal('hide').removeClass('loading');
        });
    });

    // Bind to modal opening to set necessary data properties to be used to make request
    $('#confirm-delete').on('show.bs.modal', function (e) {
        var data = $(e.relatedTarget).data();
        $('.title', this).text(data.recordTitle);
        $('.btn-ok', this).data('recordId', data.recordId);
    }); */

})

function editNameCollection(event, userId, collect) {
    var data = $('#_title').val();
    alert(data)
    showLoading();
    $.ajax({
        method: "PUT",
        url: `/user/${userId}/storage/editCollection/${collect._id}`,
        cache: false,
        timeout: 5000,
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

function deleteHistory(userId, historyId) {
    $.ajax({
        method: "PUT",
        url: `/user/${userId}/storage/deleteHistory/${historyId}`,
        timeout: 5000,
        success: function (result) {
            console.log(result);
            if (result) {
                showToast('success', "Thành công", "Xoá lịch sử thành công!");
                $(`#his_${historyId}`).remove();
            } else {
                showToast('error', "Không thành công", "Xoá lịch sử không thành công!");
            }
        },
        error: function (err) {
            console.log(err)
            showToast('error', "Không thành công", "Xoá lịch sử không thành công!");
        }
    })
}

function deleteCollection(userId, collectId) {
    showLoading();
    $.ajax({
        method: "PUT",
        url: `/user/${userId}/storage/deleteCollection/${collectId}`,
        timeout: 5000,
        success: function (result) {
            console.log(result);
            if (result) {
                showToast('success', "Thành công", "Xoá lịch sử thành công!");
            } else {
                showToast('error', "Không thành công", "Xoá lịch sử không thành công!");
            }
            hideLoading();
        },
        error: function (err) {
            console.log(err)
            showToast('error', "Không thành công", "Xoá lịch sử không thành công!");
            hideLoading();
        }
    })
}

function editCollectionItem(userId, collectId, mangaId) {
    showLoading();
    $.ajax({
        method: "PUT",
        url: `/user/${userId}/storage/editCollectionItem/${collectId}/${mangaId}`,
        timeout: 5000,
        success: function (result) {
            console.log(result);
            if (result.success) {
                showToast('success', "Thành công", "Xoá lịch sử thành công!");
            } else {
                showToast('error', "Không thành công", "Xoá lịch sử không thành công!");
            }
            hideLoading();
        },
        error: function (err) {
            console.log(err)
            showToast('error', "Không thành công", "Xoá lịch sử không thành công!");
            hideLoading();
        }
    })
}