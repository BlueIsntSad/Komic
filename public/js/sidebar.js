function getTopView(num){
    $("li.sidebar_option_item").removeClass("active");
    $(`#topView${num}`).addClass("active")
    $.ajax({
        method: "GET",
        url: `/manga/top/${num}`,
        cache: false, 
        timeout: 60000,
        success: function(result){
            console.log(result);
            if(result){
                $(".manga_topviews_item").empty();
                result.forEach(item => {
                    addTopItem(item)
                });
            }
        },
        error: function(err){
            console.log(err)
        }
    })
}

function addTopItem(manga){
    var content = ` 
    <div class="manga_topviews_item">
        <a href="manga/${manga.id}">
        <div class="manga_topviews_item_cover bg-cover"  style="background-image: url(${manga.cover});" >
            
        </div>
        </a>
        <div class="text ep">${manga.finishedEp} / ${manga.totalEp}</div>
            <div class="text view">
                <i class="fa fa-eye" aria-hidden="true"></i>
                ${manga.views}
            </div>
            <h5 class="name">
                <a href="manga/${manga.id}">
                    ${manga.name}
                </a>
            </h5>
    </div>`
    $("#manga_sidebar_topviews").append(content);
}