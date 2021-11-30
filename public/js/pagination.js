function pagination(c , l){
    var currentPage = c||1;
    var last = l||1
    currentPage = parseInt(currentPage);
    last = parseInt(last);
    var range = []

    if(currentPage!=1)
        range.push(`<li class="pagination_item" onclick="addParam('page', ${currentPage -1})"><i class="fas fa-angle-double-left"></i></li>`)

   if(last <= 5)
   {
        for(let i=1; i<= last; i++)
            range.push(`
                <li class="pagination_item ${i==currentPage?"active":''}" onclick="addParam('page', ${i})" > ${i}</li>`
            );
   }
   else if(currentPage < 3){
        for(let i = 1; i<= 5; i++)
            range.push(`
                <li class="pagination_item ${i==currentPage?"active":''}" onclick="addParam('page', ${i})">${i}</li>`);       
   }
   else if(currentPage >= 3)
   {
        if(last <= currentPage + 2)
        {
            for(let i = last - 4 ; i <= last; i++ )
                range.push(`
                    <li class="pagination_item ${i==currentPage?"active":''}" onclick="addParam('page', ${i})">${i}</li>`
                );
        }
        else{
            for(let i = currentPage-2; i <= currentPage + 2; i++ )
                range.push(`
                    <li class="pagination_item ${i==currentPage?"active":''}" onclick="addParam('page', ${i})">${i}</li>`);
        }
    }
    if(currentPage!=last)
        range.push(`<li class="pagination_item" onclick="addParam('page', ${currentPage + 1})" ><i class="fas fa-angle-double-right"></i></li>`);

    $(".pagination").empty();
    for(page of range)
    {
        $(".pagination").append(page)
    }
}


function addParam(param, value){
    var searchParams = new URLSearchParams(window.location.search)
    searchParams.set(param, value)
    window.location.search = searchParams.toString()
}

$("#sort").on('change', function(){
    $("#submit_sort").submit()
})