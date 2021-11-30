function editRow(id){
    const row = $(`#category_row_${id}`);
    row.find('input').prop('disabled', false);
    row.find('button.edit_button').addClass('d-none');
    row.find('button.delete_button').addClass('d-none');
    row.find('button.cancel_button').removeClass('d-none');
    row.find('button.save_button').removeClass('d-none')
}

function cancelEditRow(id){
    const row = $(`#category_row_${id}`);
    row.find('input').prop('disabled', true);
    row.find('button.edit_button').removeClass('d-none');
    row.find('button.delete_button').removeClass('d-none');
    row.find('button.cancel_button').addClass('d-none');
    row.find('button.save_button').addClass('d-none')
}

function saveEditCategory(event){
    event.preventDefault();
    var form = $(event.target);
    $.ajax({
        type: "PUT",
        url: $(form).attr('action'),
        timeout: 30000,
        data: form.serialize(),
        success: function (result) {
            if(result.success)
            {
                const id = form.parent('tr').attr('categoryId');
                cancelEditRow(id)
            }
        },
        error: function (e) {
                
        }
    })
}

function deleteCategory(id){
    $.ajax({
        type: "DELETE",
        url: `/admin/category/${id}`,
        timeout: 30000,
        success: function (result) {
            if(result.success)
            {
                $(`#category_row_${id}`).remove();
            }
        },
        error: function (error) {
            console.log(error)
        }
    })
}

function insertCategory(event){
    event.preventDefault();
    var form = $(event.target);
    $.ajax({
        type: "POST",
        url: $(form).attr('action'),
        timeout: 30000,
        data: form.serialize(),
        success: function (result) {
            if(result.success)
            {   
                console.log(result)
                addRow(result.newCategory)
            }
        },
        error: function (e) {
            console.log(e)
        }
    })
}

function addRow(category){
    var row  = $("#template_row")
                .clone().removeAttr('id');
    console.log(row)
    row = $(row);
    row.attr('id', `category_row_${category._id}`);
    row.attr('categoryId', `${category._id}`);
    row.children('form').attr('action', `/admin/category/${category._id}`);
    row.find('input.input_name').attr('id', `category_name_${this._id}`);
    row.find('input.input_name').val(category.name);
    row.find('input.input_name').attr('defaultValue', category.name);
    row.find('input.input_category').val(category.description);
    row.find('input.input_category').attr('defaultValue', category.description);
    row.find('button.edit_button').attr("onclick", `editRow('${category._id}')`);
    row.find('button.delete_button').attr("onclick", `deleteCategory('${category._id}')`);
    row.find('button.cancel_button').attr("onclick", `cancelEditRow('${category._id}')`);
    const last = $('#row_insert_category');
    console.log(row.find('input.input_name'))
    row.insertBefore(last)
}

function deleteRow(id){
    $(`category_row_${id}`).remove();
}