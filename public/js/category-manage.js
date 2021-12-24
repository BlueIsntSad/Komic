function editRow(id) {
  const row = $(`#category_row_${id}`);
  row.find("input").prop("disabled", false);
  row.find("button.edit_button").addClass("d-none");
  row.find("button.delete_button").addClass("d-none");
  row.find("button.cancel_button").removeClass("d-none");
  row.find("button.save_button").removeClass("d-none");
}

function cancelEditRow(id) {
  const row = $(`#category_row_${id}`);
  row.find("input").prop("disabled", true);
  row.find("button.edit_button").removeClass("d-none");
  row.find("button.delete_button").removeClass("d-none");
  row.find("button.cancel_button").addClass("d-none");
  row.find("button.save_button").addClass("d-none");
}

function saveEditCategory(event) {
  event.preventDefault();
  showLoading();
  var form = $(event.target);
  $.ajax({
    type: "PUT",
    url: $(form).attr("action"),
    timeout: 30000,
    data: form.serialize(),
    success: function (result) {
      if (result.success) {
        const id = form.parent("tr").attr("categoryId");
        cancelEditRow(id);
        showToast(
          "success",
          "Thành công!",
          "Chỉnh sửa thông tin thể loại thành công!"
        );
        hideLoading();
      } else {
        showToast(
          "error",
          "Không thành công!",
          "Chỉnh sửa thông tin thể loại không thành công!"
        );
        hideLoading();
      }
    },
    error: function (e) {
      showToast(
        "error",
        "Không thành công!",
        "Chỉnh sửa thông tin thể loại không thành công!"
      );
      hideLoading();
    },
  });
}

function deleteCategory(id) {
  if (confirm("Bạn có muốn tiếp tục?") == false) return;
  showLoading();
  $.ajax({
    type: "DELETE",
    url: `/admin/category/${id}`,
    timeout: 30000,
    success: function (result) {
      if (result.success) {
        $(`#category_row_${id}`).remove();
        showToast("success", "Thành công!", "Xoá thể loại thành công!");
      } else showToast("error", "Không thành công!", result.message);

      hideLoading();
    },
    error: function (error) {
      console.log(error);
      showToast(
        "error",
        "Không thành công!",
        "Xoá thông tin thể loại không thành công!"
      );
      hideLoading();
    },
  });
}

function insertCategory(event) {
  event.preventDefault();
  showLoading();
  var form = $(event.target);
  $.ajax({
    type: "POST",
    url: $(form).attr("action"),
    timeout: 30000,
    data: form.serialize(),
    success: function (result) {
      if (result.success) {
        addRow(result.newCategory);
        showToast("success", "Thành công!", "Thêm thể loại thành công!");
      } else {
        showToast("error", "Không thành công!", result.message);
      }
      hideLoading();
    },
    error: function (e) {
      showToast(
        "error",
        "Không thành công!",
        "Thêm thể loại không thành công!"
      );
      hideLoading();
    },
  });
}

function addRow(category) {
  var row = $("#template_row").clone().removeAttr("id");
  console.log(row);
  row = $(row);
  row.attr("id", `category_row_${category._id}`);
  row.attr("categoryId", `${category._id}`);
  row.children("form").attr("action", `/admin/category/${category._id}`);
  row.find("input.input_name").attr("id", `category_name_${this._id}`);
  row.find("input.input_name").css("background-color", category.color);
  row.find("input.input_name").css("color", category.text_color);
  row.find("input.input_name").val(category.name);
  row.find("input.input_name").attr("defaultValue", category.name);
  row.find("input.input_category").val(category.description);
  row.find("input.input_category").attr("defaultValue", category.description);
  row.find("div.background_color").css("background-color", category.color);
  row.find("div.text_color").css("background-color", category.text_color);
  row.find("button.edit_button").attr("onclick", `editRow('${category._id}')`);
  row
    .find("button.delete_button")
    .attr("onclick", `deleteCategory('${category._id}')`);
  row
    .find("button.cancel_button")
    .attr("onclick", `cancelEditRow('${category._id}')`);
  const last = $("#row_insert_category");
  console.log(row.find("input.input_name"));
  row.insertBefore(last);
}

function deleteRow(id) {
  $(`category_row_${id}`).remove();
}

function changePreview(event) {
  $(event.target).parent().css("background-color", $(event.target).val());
  console.log($(event.target).closest("tr").find("input.input_name"));
  console.log($(event.target).attr("name"));
  if ($(event.target).attr("name") == "color")
    $(event.target)
      .closest("tr")
      .find("input.input_name")
      .css("background-color", $(event.target).val());
  else
    $(event.target)
      .closest("tr")
      .find("input.input_name")
      .css("color", $(event.target).val());
}
