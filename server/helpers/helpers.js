function convertDateString(dateString) {
    return new Date(dateString).toLocaleDateString('en-GB').split('/').reverse().join('-')
}

function itemChecked(item, listitem, attr){
    for(item1 of listitem){
        if(item1._id.toString() == item._id.toString()) return attr
    }
    return "";  
}

function activeItem(activeItem, currenItem){
    if(activeItem == currenItem)
        return "active"
    return ""
}

function disablePage(currentPage, lastPage, last){
    if((1 >= currentPage && !last )|| (lastPage <= currentPage && last))
        return "disabled";
    return ""
}

module.exports = {
    convertDateString,
    itemChecked,
    activeItem,
    disablePage
}