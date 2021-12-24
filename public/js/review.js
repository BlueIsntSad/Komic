var limitPerStack, numberOfComments, currentLastComment, more = 0;

$(document).ready(function () {

    limitPerStack = 5;
    $(".manga_review .row .review-item:gt(" + (limitPerStack - 1) + ")").hide();

    numberOfComments = $(".manga_review .row .review-item").length - 1;

    if (numberOfComments <= limitPerStack) {
        currentLastComment = numberOfComments
        $(".review-showmore .showmore a").addClass("disabled")
    } else {
        currentLastComment = limitPerStack
    }

    $(".review-showmore .text-end span:first").html(currentLastComment)

    $(".review-showmore .showmore a").on("click", function () {
        if (currentLastComment + limitPerStack <= numberOfComments) { currentLastComment = currentLastComment + limitPerStack; }
        else { currentLastComment = numberOfComments }
        //alert(currentLastComment)
        for (var i = currentLastComment - limitPerStack - more; i < currentLastComment; i++) {
            $(".manga_review .row .review-item:eq(" + i + ")").show().css("display", "block");;
        }
        $(".review-showmore .text-end span:first").html(currentLastComment)

        if (currentLastComment >= numberOfComments) {
            $(".review-showmore .showmore a").addClass("disabled")
        }
    })
})

function commentManga(mangaId) {
    //event.preventDefault()s
    var comment = $("textarea#comment-msg").val()
    $.ajax({
        type: "POST",
        url: `/user/comment/${userId}/${mangaId}`,
        timeout: 3000,
        data: { msg: comment },
        success: function (result) {
            if (result.isSuccess) {
                showToast('success', "Thành công!", "Bình luận thành công!");
                // Insert comment
                var newComment = $(".review-item:hidden:last").clone().removeAttr('hidden')
                newComment.find(".avatar img").attr('src', result.user.avatar);
                newComment.find(".comment p").text(comment);
                newComment.find(".comment h6 strong").text(result.user.name);
                newComment.find(".comment h6 span").text(' - vừa xong');
                newComment.show()
                newComment.prependTo("#comment_list");
                // Fix number comment
                more++
                numberOfComments++
                currentLastComment++
                $(".review-showmore .text-end span:first").html(currentLastComment)
                $(".review-showmore .text-end span:last").html(numberOfComments)
            } else {
                showToast('error', "Không thành công!", result.message);
            }
        },
        error: function (e) {
            showToast('error', "Không thành công!", e.message);
        }
    })
}