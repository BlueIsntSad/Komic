function deleteChap(event) {
  const url = $(event.target).attr("ref");
  if (confirm("Bạn có muốn tiếp tục?") == false) return;
  showLoading();
  $.ajax({
    method: "delete",
    url: url,
    timeout: 60000,
    success: function (result) {
      if (result.success) {
        $(event.target).closest(".row_chapter").remove();
        showToast("success", "Thành công", "Xoá thành công!");
      } else {
        showToast("error", "Không thành công", "Xoá không thành công!");
      }
      hideLoading();
    },
    error: function (e) {
      console.log(e);
      hideLoading();
      showToast("error", "Không thành công", "Xoá không thành công! qqww");
    },
  });
}
