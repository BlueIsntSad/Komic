function convertDateString(dateString) {
    return new Date(dateString).toLocaleDateString('en-GB').split('/').reverse().join('-')
}

function itemChecked(item, listitem, attr) {
    for (item1 of listitem) {
        if (item1._id.toString() == item._id.toString()) return attr
    }
    return "";
}

function activeItem(activeItem, currenItem) {
    if (activeItem == currenItem)
        return "active"
    return ""
}

function selectedItem(activeItem, currenItem) {
    if (activeItem == currenItem)
        return "selected"
    return ""
}

function disablePage(currentPage, lastPage, last) {
    if ((1 >= currentPage && !last) || (lastPage <= currentPage && last))
        return "disabled";
    return ""
}

function addManga(mangas, block) {

    if (mangas.length >= 9)
        return ""
    else {
        var accum = '';
        for (var i = mangas.length; i < 9; i += 1)
            accum += block.fn();
        return accum;
    }

}

function BreadCrumb(path, block) {
    var accum = '';
    // const breadCrumb = path.split('/');
    console.log(path)
    // path.forEach(item => {
    //     accum+=block.fn(item)
    // });
    return accum;
}

function showToast(type) {
    if (!type)
        return "hide"
    else
        return "show"
}

module.exports = {
    convertDateString,
    itemChecked,
    activeItem,
    disablePage,
    addManga,
    BreadCrumb,
    showToast,
    selectedItem
}