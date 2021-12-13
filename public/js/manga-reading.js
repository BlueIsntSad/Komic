$(document).ready(function () {
    $('.chapter_control select').selectpicker();

    $('select').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
        var options = $('select option:selected');
        window.location.href = options.val();
    });

    $('button.prev').on('click', function() {
        var currentChapter = $('select.selectpicker').val(1);
        alert(currentChapter)
    })
})