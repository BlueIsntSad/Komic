$(document).ready(function () {
    $('.manga_sidebar_topviews').removeClass('mt-4').removeClass('my-5')
    $('.manga_sidebar').removeClass('my-5')

    /* ---------- Chapter table pagination ---------- */
    var limitPerPage = 10;
    $("#chapter-list .list-group-item:gt(" + (limitPerPage - 1) + ")").hide();

    var numberOfChapters = $("#chapter-list .list-group-item").length;
    var totalPages = Math.round(numberOfChapters / limitPerPage);
    $("#chapterPage .page-item.prev").after("<li class='page-item number active'><a class='page-link' href='javascript:void(0)'>" + 1 + "</a></li>")
    for (var i = 2; i <= totalPages; i++) {
        $("#chapterPage .page-item.next").before("<li class='page-item number'><a class='page-link' href='javascript:void(0)'>" + i + "</a></li>")
    }

    // Click page number button
    $("#chapterPage li.number").on("click", function () {
        if ($(this).hasClass("active")) {
            return false;
        } else {
            var currentPage = $(this).index();

            // Show&hide page number
            $("#chapterPage li.number").removeClass("active");
            $(this).addClass("active");

            // Show&hide chapter
            $("#chapter-list .list-group-item").hide();
            var pagePack = limitPerPage * currentPage
            for (var i = pagePack - limitPerPage; i < pagePack; i++) {
                $("#chapter-list .list-group-item:eq(" + i + ")").show();
            }

            // Disabled & active prev&next buttom
            if (currentPage === 1) {
                $("#chapterPage li.prev").addClass("disabled")
            } else if (currentPage === totalPages) {
                $("#chapterPage li.next").addClass("disabled")
            } else {
                $("#chapterPage li.next").removeClass("disabled")
                $("#chapterPage li.prev").removeClass("disabled")
            }
        }
    })

    // Next button
    $("#chapterPage .next").on("click", function () {
        var currentPage = $("#chapterPage li.active").index()
        if (currentPage === totalPages) {
            return false;
        } else {
            currentPage++;

            // Disabled & active prev&next button
            if (currentPage === totalPages) {
                $("#chapterPage li.next").addClass("disabled")
            }
            $("#chapterPage li.prev").removeClass("disabled")
            $("#chapterPage li.number").removeClass("active");

            // Show&hide chapter
            $("#chapter-list .list-group-item").hide();

            var pagePack = limitPerPage * currentPage
            for (var i = pagePack - limitPerPage; i < pagePack; i++) {
                $("#chapter-list .list-group-item:eq(" + i + ")").show();
            }

            // Show&hide page number
            $("#chapterPage li.number:eq(" + (currentPage - 1) + ")").addClass("active");
        }
    })

    // Prev button
    $("#chapterPage .prev").on("click", function () {
        var currentPage = $("#chapterPage li.active").index()
        if (currentPage === 1) {
            return false;
        } else {
            currentPage--;

            // Disabled & active prev&next button
            if (currentPage === 1) {
                $("#chapterPage li.prev").addClass("disabled")
            }
            $("#chapterPage li.next").removeClass("disabled")
            $("#chapterPage li.number").removeClass("active");

            // Show&hide chapter
            $("#chapter-list .list-group-item").hide();

            var pagePack = limitPerPage * currentPage
            for (var i = pagePack - limitPerPage; i < pagePack; i++) {
                $("#chapter-list .list-group-item:eq(" + i + ")").show();
            }

            // Show&hide page number
            $("#chapterPage li.number:eq(" + (currentPage - 1) + ")").addClass("active");
        }
    })

    //
    //$(".rating-group input:checked").on("click", ratingManga())
});


function ratingManga(userId, mangaId) {
    var rateScore = $(".rating-group input:checked").val()
    alert(rateScore)
    $.ajax({
        type: "POST",
        url: `/user/${userId}/${mangaId}?score=${rateScore}`,
        timeout: 10000,
        success: function (result) {
            if (result.isSuccess) {
                showToast('success', "Thành công!", "Đánh giá thành công!");
            } else {
                showToast('error', "Không thành công!", result.message);
            }
        },
        error: function (e) {
            showToast('error', "Không thành công!", "Có lỗi xảy ra!");
        }
    })
}