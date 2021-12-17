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

    $('.btn-close').on('click', function () {
        $('#title').removeClass('is-invalid')
    })

})

function editNameCollection(event, userId, collectId) {
    const data = $('#_title').val();
    event.preventDefault()
    $.ajax({
        method: "PUT",
        url: `/user/${userId}/storage/collection`,
        timeout: 5000,
        data: { title: data, cid: collectId },
        success: function (result) {
            if (result.isSuccess) {
                showToast('success', "Thành công", "Cập nhật tên bộ sưu tập thành công!");
                $('#title_show h3 span').html(data);
                $('#title_edit input').attr('value', data)
                $('#title_edit input').attr('defaultvalue', data)
                window.location.href = window.location.href.split("?")[0] + `?cid=${collectId}`;
            } else {
                showToast('error', "Không thành công", "Cập nhật không thành công!");
            }
        },
        error: function (err) {
            console.log(err)
            showToast('error', "Không thành công", "Thêm truyện mới không thành công!");
        }
    })
}

function addCollection(event, userId) {
    var title = $('#title').val()
    if (!title) {
        $('#title').addClass('is-invalid')
        event.preventDefault()
        event.stopPropagation()
    }
    else {
        $.ajax({
            method: "PUT",
            url: `/user/${userId}/storage`,
            data: { title: title },
            timeout: 5000,
            success: function (result) {
                if (result.isSuccess) {
                    showToast('success', "Thành công", "Thêm bộ sưu tập thành công!");
                    insertCollect(result.newCollection, userId);
                    console.log(result.newCollection);
                } else {
                    showToast('error', "Không thành công", "Xoá bộ sưu tập không thành công!");
                    console.log(result.msg);
                }
            },
            error: function (err) {
                console.log(err.msg);
                showToast('error', "Không thành công", "Xoá bộ sưu tập không thành công!");
            }
        })
        event.preventDefault()
        $('#addCollectModal').modal('hide')
    }
}

function insertCollect(collect, userId) {
    let href = `/user/${userId}/storage/collection?title=${collect.title}`
    let insertCollect = `<div class="col-md-6 col-lg-4" id="collect_${collect._id}"><div class="profile-library shadow rounded-3 p-4 mb-4"><div class="library-body"><div class="reading-list"><div class="d-flex"><a href="${href}"><div class="cover pe-4"><img src="/img/cover_default.png" class="rounded-2"><div class="shadow rounded-2"></div></div></a><div class='info w-100 d-flex flex-column'><a href="${href}"><h5><b>${collect.title}</b></h5></a><p>${collect.total} truyện</p><div class="d-flex justify-content-end mt-auto d-grid gap-2"><a class="edit btn" href="${href}"><i class="fas fa-external-link-alt"></i></a><button class="del btn" onclick="deleteCollection('${userId}','${collect._id}')"><i class="fas fa-trash"></i></button></div></div></div></div></div></div></div>`
    $('#collections_list').append(insertCollect)
}

function deleteHistory(userId, historyId) {
    $.ajax({
        method: "PUT",
        url: `/user/${userId}/storage/deleteHistory/${historyId}`,
        timeout: 5000,
        success: function (result) {
            console.log(result);
            if (result.isSuccess) {
                showToast('success', "Thành công", "Xoá lịch sử thành công!");
                $(`#his_${historyId}`).remove();
                $('.reading-list:last-child hr').remove();
            } else {
                console.log(result.msg)
                showToast('error', "Không thành công", "Xoá lịch sử không thành công!");
            }
        },
        error: function (err) {
            console.log(err)
            showToast('error', "Không thành công", "Xoá lịch sử không thành công!");
        }
    })
}

function deleteCollection_redirect(userId, collectId, href) {
    deleteCollection(userId, collectId);
    window.location.href = href;
}

function deleteCollection(userId, collectId) {
    $.ajax({
        method: "PUT",
        url: `/user/${userId}/storage/deleteCollection/${collectId}`,
        timeout: 5000,
        success: function (result) {
            console.log(result);
            if (result.isSuccess) {
                showToast('success', "Thành công", "Xoá lịch sử thành công!");
                $(`#collect_${collectId}`).remove();
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

function deleteCollectionItem(userId, collectId, mangaId) {
    $.ajax({
        method: "PUT",
        url: `/user/${userId}/storage/deleteCollectionItem/${collectId}/${mangaId}`,
        timeout: 5000,
        success: function (result) {
            console.log(result);
            if (result.success) {
                showToast('success', "Thành công", "Xoá lịch sử thành công!");
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