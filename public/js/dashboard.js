//config color
const backgroundColorConfig = [
    'rgba(255, 0, 0, 0.5)',
    'rgba(255, 128, 0, 0.5)',
    'rgba(255, 255, 0, 0.5)',
    'rgba(0, 255, 0, 0.5)',
    'rgba(0, 255, 255, 0.5)',
    'rgba(0, 0, 255, 0.5)',
    'rgba(255, 0, 255, 0.5)',
    'rgba(255, 0, 127, 0.5)',
    'rgba(128, 128, 128, 0.5)'

]




//load chart
function onLoad(data) {
    initCategoryChart(data.categories)
    initStatusChart(data.mangaStatus);
    initMangaChart(data.mangaCreated)
}


function initStatusChart(data) {
    var labels = [];
    var mangas = [];
    var totalViews = [];
    data.forEach(chartItem => {
        labels.push(chartItem._id);
        mangas.push(chartItem.count);
        totalViews.push(chartItem.totalViews)
    });
    const ctxCategoriesViews = document.getElementById('manga_status_chart').getContext('2d');
    //pie chart
    const barChart = new Chart(ctxCategoriesViews, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: mangas,
                backgroundColor: backgroundColorConfig,
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Tình trạng truyện',
                    position: 'bottom'
                },
                legend: {
                    display: true,
                    position: "bottom",
                }
            }
        }
    });
}

//Init view dashboard 
function initCategoryChart(data) {
    var labels = [];
    var mangas = [];
    var totalViews = [];
    data.forEach(chartItem => {
        labels.push(chartItem.name);
        mangas.push(chartItem.mangas);
        totalViews.push(chartItem.totalViews)
    });
    const ctxCategoriesViews = document.getElementById('category_chart').getContext('2d');

    //pie chart
    const barChart = new Chart(ctxCategoriesViews, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: mangas,
                backgroundColor: backgroundColorConfig,
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Lượt xem theo thể loại',
                    position: 'bottom'
                },
                legend: {
                    display: true,
                    position: "bottom",
                }
            }
        }
    });
}

//Init manga chart 
function initMangaChart(data) {
    var labels = [];
    var mangas = [];
    data.forEach(chartItem => {
        labels.push(chartItem._id);
        mangas.push(chartItem.count);
    });
    const ctxCategoriesViews = document.getElementById('manga_created_chart').getContext('2d');

    //pie chart
    const barChart = new Chart(ctxCategoriesViews, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: mangas,
                fill: true,
                backgroundColor: backgroundColorConfig,
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Số lượng truyện tạo mới',
                    position: 'bottom'
                },
                legend: {
                    display: false,
                    labels: {
                        color: 'rgb(255, 99, 132)'
                    }
                }
            }
        }
    });
}