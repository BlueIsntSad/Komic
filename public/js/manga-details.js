$(document).ready(function () {

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

    /* $(".list-group-item").css("border-radius", "0px");
    $(".list-group-item:visible").each(function (index) {
        if (index == 0) {
            $(this).css("border-top-left-radius", "10px");
            $(this).css("border-top-right-radius", "10px");
        }
        if (index == $(".list-group-item:visible").length - 1) {
            $(this).css("border-bottom-left-radius", "10px");
            $(this).css("border-bottom-right-radius", "10px");
        }
    }); */

    /* ---------- Review comment show ---------- */
    var limitPerStack = 5;
    $(".manga_review .row .review-item:gt(" + (limitPerStack - 1) + ")").hide();

    var numberOfComments = $(".manga_review .row .review-item").length;

    if (numberOfComments <= limitPerStack) {
        var currentLastComment = numberOfComments
    } else { var currentLastComment = limitPerStack }
    $(".review-showmore .text-end span").html(currentLastComment)

    $(".review-showmore .showmore a").on("click", function () {
        currentLastComment = currentLastComment + limitPerStack;
        for (var i = currentLastComment - limitPerPage; i < currentLastComment; i++) {
            $(".manga_review .row .review-item:eq(" + i + ")").show();
        }
        $(".review-showmore .text-end span").html(currentLastComment)
    })
    /* var totalPages = Math.round(numberOfChapters / limitPerPage);
    $("#chapterPage .page-item.prev").after("<li class='page-item number active'><a class='page-link' href='javascript:void(0)'>" + 1 + "</a></li>")
    for (var i = 2; i <= totalPages; i++) {
        $("#chapterPage .page-item.next").before("<li class='page-item number'><a class='page-link' href='javascript:void(0)'>" + i + "</a></li>")
    } */
});