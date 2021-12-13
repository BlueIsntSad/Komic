$(document).ready(function () {

    var limitPerStack = 5;
    $(".manga_review .row .review-item:gt(" + (limitPerStack - 1) + ")").hide();

    var numberOfComments = $(".manga_review .row .review-item").length;

    if (numberOfComments <= limitPerStack) {
        var currentLastComment = numberOfComments
        $(".review-showmore .showmore a").addClass("disabled")
    } else {
        var currentLastComment = limitPerStack
    }

    $(".review-showmore .text-end span").html(currentLastComment)

    $(".review-showmore .showmore a").on("click", function () {
        if (currentLastComment + limitPerStack <= numberOfComments) { currentLastComment = currentLastComment + limitPerStack; }
        else { currentLastComment = numberOfComments; }

        for (var i = currentLastComment - limitPerStack; i < currentLastComment; i++) {
            $(".manga_review .row .review-item:eq(" + i + ")").show();
        }
        $(".review-showmore .text-end span").html(currentLastComment)

        if (currentLastComment >= numberOfComments) {
            $(".review-showmore .showmore a").addClass("disabled")
        }
    })
})