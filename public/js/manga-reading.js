$(document).ready(function () {
    $('.chapter_control select').selectpicker();
    $('.manga_sidebar_topviews').removeClass('mt-4').removeClass('my-5')
    $('.manga_sidebar').removeClass('my-5')

    // Select another chapter
    $('select.top').on('changed.bs.select', function () {
        var options = $('select.top option:selected');
        window.location.href = options.val();
    });

    $('select.bot').on('changed.bs.select', function () {
        var options = $('select.bot option:selected');
        window.location.href = options.val();
    });

    // Disabled prev, next
    if ($("select option").first().is(':selected')) {
        $("button.prev").prop("disabled", true);
    }

    if ($("select option").last().is(':selected')) {
        $("button.next").prop("disabled", true);
    }

    // Prev chapter
    $('button.prev').on('click', function () {
        var prevChapter = $('select option:selected').prev('option').val();
        if (prevChapter.length > 0) {
            window.location.href = prevChapter
        }
    })

    // Next chapter
    $('button.next').on('click', function () {
        var nextChapter = $('select option:selected').next('option').val();
        if (nextChapter.length > 0) {
            window.location.href = nextChapter
        }
    })
})