$(".input_category").on("click", function (event) {
    $(this).closest("li").toggleClass("active", this.checked);
    var newText = "Thể loại: ";
    $(this).closest("ul").children('input:checked')
    $(this).closest("ul").children('li.active').each(function () {
        newText += $(this).children('label').text() + ', ';
    })
    $("#category_dropdown").text(newText);

    event.stopPropagation();
})

$(".form-check-label").on("click", function (event) {
    event.stopPropagation();
})


function show_preview_image(event) {
    const input = event.target;
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#preview_image').attr('src', e.target.result);
            $('#preview_image').hide();
            $('#preview_image').fadeIn(650);
        };
        reader.readAsDataURL(input.files[0]);
    }
}


function insertNewChap() {
    var name = $('input#input_chapter_name').val();
    var files = $("input#input_section_files")[0].files;

    console.log(files)
    addChapter($("#chapter_list").children().length + 1, name, files)
    // console.log($("#chapter_list").children());
    // console.log($("#chapter_list").children().length);
}

function addChapter(num, name, files) {
    var chapter = $('#template_insert_chapter')
        .clone().removeAttr("id");

    chapter = $(chapter);
    chapter.removeClass('d-none');
    chapter.attr('id', `insert_chapter_${num}`);
    chapter.find(".caret_title .chapter_title").text(`Chương ${num}: ${name}`);
    chapter.find('.caret_title input.i_chapter').val(`insert_chapter_${num}`);
    chapter.find('.caret_title input.i_chapter_title').val(name);
    chapter.find('.caret_title input.i_chapter_title').attr('name', `insert_chapter_${num}`);
    chapter.appendTo('#chapter_list')
    var newFileList = Array.from(files);
    for (var i = 0; i < newFileList.length; i++) {
        addSection(chapter.children('ul.section_list'), `insert_chapter_${num}`, i + 1, files[i]);
    }

}

function addSection(pos, chapter, num, file) {
    var section = $("#template_section")
        .clone().removeAttr('id');
    section = $(section);
    section.removeClass('d-none');
    section.attr('id', `${chapter}_section${num}`);
    section.find(".section_care_title").text(`Trang ${num}`);
    section.find("label").attr('for', `input_${chapter}_section${num}`);

    section.children("input").attr('name', `${chapter}`);
    section.children("input").attr('id', `input_${chapter}_section${num}`);
    section.appendTo(pos)
    const dt = new DataTransfer();
    if (file)
        dt.items.add(file)
    document.getElementById(`input_${section.attr('id')}`).files = dt.files


}

function showPreviewImage(event) {
    const section = $(event.target).closest('li');
    const input = section.children('input')[0];
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {

            $('#preview_section_image').attr('src', e.target.result);
            $('#preview_section_image').hide();
            $('#preview_section_image').fadeIn(400);
        };
        reader.readAsDataURL(input.files[0]);
    }

}

function deleteInsertSection(event) {
    $(event.target).closest('li').remove();
    event.preventDefault();
}

function deleteChap(event) {
    $(event.target).closest('li').remove();
    event.preventDefault();
}

function addInsertSection(event) {
    var chapter = $(event.target).closest('li');
    var sectionList = chapter.children('ul.section_list')
    addSection(sectionList, chapter.attr('id'), sectionList.children().length + 1, null)
    $(`#input_${chapter.attr('id')}_section${sectionList.children().length}`).click();
}

function mouseEnterInsert(event) {
    var xOffset = 20;
    var yOffset = -20;
    var docWidth = screen.height * 0.5;
    var docHeight = screen.height * 0.5;
    var posX = event.clientX;
    var posY = event.clientY;
    //reset transform 
    $("#move").css("transform", "translate(0px, 0px)");

    //define transform and offset
    if (posX > docWidth && posY > docHeight) {
        $("#move").css("transform", "translate(-100%, -100%)");
        xOffset = -xOffset;
        yOffset = -yOffset;
    }
    else if (posX > docWidth) {
        $("#move").css("transform", "translateX(-100%)");
        xOffset = -xOffset;
    }
    else if (posY > docHeight) {
        $("#move").css("transform", "translateY(-100%)");
        yOffset = -yOffset
    }

    //Appy css
    $("#move").css("top", posY + yOffset);
    $("#move").css("left", posX + xOffset);
    $("#move").attr("on", true);
    $("#loading_cursor").css("top", posY);
    $("#loading_cursor").css("left", posX + 20);
    $("#loading_cursor").removeClass("d-none");

    $(event.target).on('mouseleave', function () {
        $("#loading_cursor").addClass("d-none");
        $("#move").addClass('d-none');
        $("#move").attr("on", false);
    })

    const inputEle = $(event.target).closest('li.caret').children('input');
    const input = document.getElementById(inputEle.attr('id'));
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $("#move img").attr("src", e.target.result);
            $("#loading_cursor").addClass("d-none");
            $("#move").removeClass('d-none');
            $('#move').hide();
            $('#move').fadeIn(300);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function mouseMoveInsert(event) {
    var xOffset = 20;
    var yOffset = -20;
    var docWidth = document.body.clientWidth * 0.5;
    var docHeight = screen.height * 0.5;
    var posX = event.clientX;
    var posY = event.clientY;

    $("#move").css("transform", "translate(0px, 0px)");

    if (posX > docWidth && posY > docHeight) {
        $("#move").css("transform", "translate(-100%, -100%)");
        xOffset = -xOffset;
        yOffset = -yOffset;
    }
    else if (posX > docWidth) {
        console.log("show pos")
        $("#move").css("transform", "translateX(-100%)");
        xOffset = -xOffset;
    }
    else if (posY > docHeight) {
        $("#move").css("transform", "translateY(-100%)");
        yOffset = -yOffset
    }

    $("#move").css("top", posY + yOffset);
    $("#move").css("left", posX + xOffset);


    $("#loading_cursor").css("top", posY);
    $("#loading_cursor").css("left", posX + 20);

    $(event.target).on('mouseleave', function () {
        $("#loading_cursor").addClass("d-none");
        $("#move").addClass('d-none');
        $("#move").attr("on", false);
    })
}

function showLoading() {
    $('#loading_modal').modal('show');
}

function hideLoading() {
    $('#loading_modal').modal('toggle');
}

function submitInsertNewManga(event) {
    event.preventDefault();
    var form = $(event.target)[0];
    var data = new FormData(form);
    showLoading();
    $.ajax({
        method: "POST",
        url: $(form).attr('action'),
        timeout: 60000,
        data: data,
        processData: false,
        contentType: false,
        success: function (result) {
            console.log(result);
            if (result.success) {
                showToast('success', "Thành công", "Thêm truyện mới thành công!")
            } else {
                showToast('error', "Không thành công", result.message)
            }

            hideLoading();

        },
        error: function (e) {
            console.log(e)
            showToast('error', "Không thành công", "Thêm truyện mới không thành công!");
            hideLoading();
        }
    })
}