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

function deleteInsertSection(event) {
  const id = $(event.target).closest(".section_item").attr("id");
  $(event.target).closest(".section_item").remove();
}

function deleteSection(event) {
  const id = $(event.target).closest(".section_item").attr("id");
  $(event.target).closest(".section_item").remove();
  $("#sections_preview_area").append(
    `<input class="d-none" type="text" name="deleteSections" value="${id}">`
  );
}

function submitEditChapter(event) {
  event.preventDefault();
  $("#new_chap_sections").prop("disabled", true);
  var form = $(event.target)[0];
  var data = new FormData(form);
  showLoading();
  $.ajax({
    method: "PUT",
    url: $(form).attr("action"),
    timeout: 60000,
    data: data,
    processData: false,
    contentType: false,
    success: function (result) {
      console.log(result);
      if (result.success) {
        updateNewChapter(result.mangaId, result.chapter);
        showToast("success", "Thành công", "Cập nhật chương thành công!");
      } else {
        showToast("error", "Cập nhật chương không thành công!", result.message);
      }

      hideLoading();
    },
    error: function (e) {
      console.log(e);
      showToast(
        "error",
        "Không thành công",
        "Cập nhật chương không thành công!"
      );
      hideLoading();
    },
  });
  $("#new_chap_sections").prop("disabled", false);
}

function updateNewChapter(mangaId, chap) {
  $("#sections_preview_area").empty();
  const chapId = chap._id;
  for (let i = 0; i < chap.sections.length; i++) {
    console.log(mangaId, chapId, chap.sections[i]);
    addNewSection(mangaId, chapId, chap.sections[i]);
  }
}

function addNewSection(mangaId, chapId, section) {
  const content = `
  <div class="col-4 col-md-3 col-lg-2 px-1 py-2 section_item" id="${section._id}" >
    <div class="section_preview">
        <img class="section_img" src="${section.url}" alt="" />
        <button 
            type="button" 
            class="icon_button" 
            ref="/admin/manga/${mangaId}/chap/${chapId}/section/${section._id}" 
            onclick="deleteSection(event)"
        >
        <i class="fas fa-times"></i>
        </button>
    </div>
  </div>`;
  $("#sections_preview_area").append(content);
}
