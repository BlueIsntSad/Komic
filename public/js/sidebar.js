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
    <div class="manga_topviews_item shadow my-4" style="position: relative;" >
        <div class="manga_topviews_item_cover bg-cover rounded shadow "  style="background-image: url(${manga.cover});" ></div>    
        <div class="manga_topviews_item_text">
            <div class="text ep">${manga.finishedEp} / ${manga.totalEp}</div>
            <div class="text view">
                <i class="fa fa-eye" aria-hidden="true"></i>
                ${manga.views}
            </div>
            <h5 class="name">
                ${manga.title}
            </h5>
            <div class="description_container"> 
                <p class="description">
                    ${manga.description}
                </p>
            </div>
            <a href="/manga/${manga.id}" class="link"></a>
        </div>       
    </div>`
    $("#manga_sidebar_topviews").append(content);
}