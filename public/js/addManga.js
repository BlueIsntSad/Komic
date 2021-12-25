function showPreviewImg(event) {
  const input = event.target;
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $(".img_background").css("z-index", 3);
      $(".img_background button").css("opacity", 1);
      $(".img_background button").css("z-index", 4);
      $("#newManga_preview_img").attr("src", e.target.result);
      $("#newManga_preview_img").hide();
      $("#newManga_preview_img").fadeIn(650);
    };
    reader.readAsDataURL(input.files[0]);
  } else {
    console.log(input.files);
    $("#newManga_preview_img").attr("src", "");
  }
}

function cancelPreview(event) {
  $(".img_background").css("z-index", 1);
  $(".img_background button").css("opacity", 0);
  $(".img_background button").css("z-index", 1);
  $("#newManga_preview_img").attr("src", "");
  const input = document.getElementById("newManga_cover_img");
  console.log(input);
  console.log(input.files);
  const dt = new DataTransfer();
  input.files = dt.files;

  const input2 = document.getElementById("newManga_cover_img");
  console.log(input2.files);
}

function submitAddNewManga(event) {
  event.preventDefault();
  console.log($("input[type=checkbox]:checked.input_category").length);
  if (!$("input[type=checkbox]:checked.input_category").length) {
    showToast(
      "error",
      "Không thành công",
      "Truyện phải thuộc ít nhất một thể loại!"
    );
    return;
  }

  var form = $(event.target)[0];
  var data = new FormData(form);
  showLoading();
  $.ajax({
    method: "POST",
    url: $(form).attr("action"),
    timeout: 60000,
    data: data,
    processData: false,
    contentType: false,
    success: function (result) {
      if (result.success) {
        showToast("success", "Thành công", "Thêm truyện mới thành công!");
        window.location = `/admin/manga/${result.id}`;
      } else {
        showToast("error", "Không thành công", result.message);
      }

      hideLoading();
    },
    error: function (e) {
      console.log(e);
      showToast(
        "error",
        "Không thành công",
        "Thêm truyện mới không thành công!"
      );
      hideLoading();
    },
  });
}
