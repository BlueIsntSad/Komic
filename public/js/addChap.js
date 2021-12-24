function addSections(event) {
  const files = event.target.files;
  var newFileList = Array.from(files);
  for (var i = 0; i < files.length; i++) {
    addSection(i, files[i]);
  }
}

function addSection(index, file) {
  const sectionsArea = $("#sections_preview_area");
  const newIndex = sectionsArea.children().length + index;
  var section = $("#template_preview_section").clone().removeAttr("id");
  section = $(section);
  section.attr("id", `new_image_section_${newIndex}`);
  section.removeClass("d-none");
  section.children("input").attr("id", `new_section_input_${newIndex}`);
  var reader = new FileReader();
  reader.onload = function (e) {
    section.find(".section_img").attr("src", e.target.result);
    section.find(".section_img").hide();
    section.find(".section_img").fadeIn(650);
  };
  reader.readAsDataURL(file);
  section.appendTo(sectionsArea);
  const dt = new DataTransfer();
  if (file) dt.items.add(file);
  document.getElementById(`new_section_input_${newIndex}`).files = dt.files;
}

function deleteSection(event) {
  $(event.target).closest(".section_item").remove();
}

function submitAddNewChap(event) {
  event.preventDefault();

  $("#new_chap_sections").prop("disabled", true);
  var form = $(event.target)[0];
  var data = new FormData(form);
  const sectionsArea = $("#sections_preview_area");
  if (!sectionsArea.children().length) {
    showToast(
      "error",
      "Không thành công",
      "Chương mới phải có ít nhất một trang!"
    );
    return;
  }
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
        showToast("success", "Thành công", "Thêm chương mới thành công!");
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
        "Thêm chương mới không thành công!"
      );
      hideLoading();
    },
  });
  $("#new_chap_sections").prop("disabled", false);
}
