function deleteManga(id) {
    showLoading();
    $.ajax({
        method: "delete",
        url: `/admin/manga/${id}`,
        timeout: 60000,
        success: function (result) {
            console.log(result)
            if (result.success) {
                deleteRow(id);
                showToast('success', "Thành công!", "Xoá thông tin truyện thành công!");
                hideLoading();
            } else {
                showToast('error', "Không thành công!", "Xoá thông tin truyện không thành công!");
                hideLoading();
            }

        },
        error: function (e) {
            console.log(e);
            hideLoading();
            showToast('error', "Không thành công!", "Xoá thông tin truyện không thành công!");
        }
    })
}

function deleteRow(id) {
    $(`tr#manga_${id}`).remove();
}