function deleteManga(id){
    $.ajax({
        method: "delete",
        url: `/admin/manga/${id}`,
        timeout: 60000,
        success: function (result) {
            console.log(result)
        },
        error: function (e) {
                
        }
    })
}