$(document).ready(function () {
    $('.manga_sidebar_topviews').removeClass('mt-4').removeClass('my-5')
    $('.manga_sidebar').removeClass('my-5')

    /* ---------- Chapter table pagination ---------- */
    var limitPerPage = 10;
    $("#chapter-list .list-group-item:gt(" + (limitPerPage - 1) + ")").hide();

    var numberOfChapters = $("#chapter-list .list-group-item").length;
    var totalPages = Math.ceil(numberOfChapters / limitPerPage);
    $("#chapterPage .page-item.prev").after("<li class='page-item number active'><a class='page-link' href='javascript:void(0)'>" + 1 + "</a></li>")
    for (var i = 2; i <= totalPages; i++) {
        $("#chapterPage .page-item.next").before("<li class='page-item number'><a class='page-link' href='javascript:void(0)'>" + i + "</a></li>")
    }

    var currentPage = $("#chapterPage li.active").index()
    // Click page number button
    if (currentPage === totalPages) {
        $("#chapterPage li.next").addClass("disabled")
    }
    if (currentPage === 1) {
        $("#chapterPage li.prev").addClass("disabled")
    }

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

    // To login
    $('#toLogin').on("click", function () {
        window.location.href = '/login';
    })

    // Rating start on click
    const rate_default = Math.round($('.rating-group').data('default')).toString()
    $('.rating__input').each(function () {
        if ($(this).val() == rate_default) {
            $(this).prop('checked', true)
        }
    })

    /* $('.rating__input').on('click', function (e, this) {
        $('.rating__input').attr('checked', false)
        $(this).attr('checked', true)
    }) */

    // Following
    $('#follow-btn').click(function () {
        //alert(`userId: ${userId}`)
    })

    // Following form toggle
    $('#addCollect').on("click", function (e) {
        e.preventDefault();
        $('#addCollect').hide()
        $('.dropdown.bootstrap-select').hide()
        $('#collectionNew').show()
        $('#selectCollect').show()
    })

    $('#selectCollect').on("click", function (e) {
        e.preventDefault();
        $('#addCollect').show()
        $('.dropdown.bootstrap-select').show()
        $('#collectionNew').hide()
        $('#selectCollect').hide()
    })

    // Close form modal
    $('#followManga').on('hidden.bs.modal', function () {
        $('#collectionNew').removeClass('is-invalid')
        $('#collectionPick').removeClass('is-invalid')
    })
});

function loginCheck(event, mangaId, next) {
    event.preventDefault()
    userId = '61c56abdae7b775d7cdc0ba7'
    if (!userId) {
        $('#askLoginModal').modal('show')
    } else { next(mangaId) }
}

function ratingManga(mangaId) {
    var rateScore = $(".rating__input:checked").val()
    alert(rateScore)
    /* showLoading()
    $.ajax({
        type: "POST",
        url: `/user/rating/${userId}/${mangaId}?score=${rateScore}`,
        timeout: 10000,
        success: function (result) {
            if (result.isSuccess) {
                $("#rate_count span:first").text(result.totalRate)
                showToast('success', "Thành công!", "Đánh giá thành công!");
            } else {
                showToast('error', "Không thành công!", result.message);
            }
        },
        error: function (e) {
            showToast('error', "Không thành công!", "Có lỗi xảy ra!");
        }
    })
    hideLoading() */
}

function followMangaForm(mangaId) {
    //alert(`mangaId: ${mangaId}`)
    loadUserCollections()
    $('#followManga').modal('show')
}

function followManga(mangaId) {
    //alert(`mangaId: ${mangaId}`)
    if ($('#addCollect:visible').length == 0) {
        var title = $('#collectionNew').val()
        //alert(title)
        if (title === '') {
            $('#collectionNew').addClass('is-invalid')
            return 0
        }
        addMangaToNewCollection(mangaId, title)
    } else {
        var idSelected = $('#collectionPick option:selected').val()
        //alert(idSelected)
        if (idSelected === 0) {
            $('#collectionPick').addClass('is-invalid')
            return 0
        }
        addMangaToExistCollection(mangaId, idSelected)
    }
}

function addMangaToNewCollection(mangaId, title) {
    showLoading()
    $.ajax({
        type: "PUT",
        url: `/user/${userId}/storage`,
        data: { mangaId: mangaId, title: title },
        timeout: 10000,
        success: function (result) {
            if (result.isSuccess) {
                showToast('success', "Thành công!", "Thêm truyện thành công!");
                loadUserCollections()
            } else {
                showToast('error', "Không thành công!", result.message);
            }
        },
        error: function (e) {
            showToast('error', "Không thành công!", "Có lỗi xảy ra!");
        }
    })
    $('#followManga').modal('hide')
    hideLoading()
}

function addMangaToExistCollection(mangaId, collectId) {
    showLoading()
    $.ajax({
        type: "PUT",
        url: `/user/${userId}/storage/collection`,
        data: { mid: mangaId, cid: collectId },
        timeout: 10000,
        success: function (result) {
            if (result.isSuccess) {
                showToast('success', "Thành công!", "Thêm truyện thành công!");
                loadUserCollections()
            } else {
                showToast('error', "Không thành công!", result.message);
            }
        },
        error: function (e) {
            showToast('error', "Không thành công!", "Có lỗi xảy ra!");
        }
    })
    $('#followManga').modal('hide')
    hideLoading()
}

function loadUserCollections() {
    //alert(`userId: ${userId}`)
    $.ajax({
        type: "GET",
        url: `/user/${userId}/collectionJSON`,
        timeout: 10000,
        success: function (result) {
            //showToast('success', "Thành công!", "thành công!");
            //alert(JSON.stringify(result));
            insertCollections(result)
        },
        error: function (e) {
            showToast('error', "Lỗi!", e.message);
        }
    })
}

function insertCollections(collections) {
    if (collections.collect.length > 0) {
        $("#collectionPick").empty()
        collections.collect.forEach(collect => {
            const option = `<option value="${collect._id}" data-subtext="${collect.total} truyện">${collect.title}</option>`
            $("#collectionPick").append(option);
            $("#collectionPick").selectpicker('reloadLi')
            $("#collectionPick").selectpicker('refresh')
            $("#collectionPick").selectpicker()
        })
    } else {
        const option = `<option value="0">Chưa có bộ sưu tập nào</option>`
        $("#collectionPick").html(option);
        $("#collectionPick").selectpicker('reloadLi')
        $("#collectionPick").selectpicker('refresh')
        $("#collectionPick").selectpicker()
    }
}