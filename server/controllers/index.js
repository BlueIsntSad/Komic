function index(req, res, next){
    var data = [];
    var trending = [];
    var newComment = [];
    var news = []
    var cartegory = {
        _id: "asdfasdf",
        name: 'fantasy',
        description: ''
    }

    for(let i = 0; i < 5; i++)
    {
        var product1 = {
            id: i*2,
            name: "The Seven Deadly Sins: Wrath of the Gods",
            cover: "https://i.pinimg.com/originals/c3/0f/a5/c30fa5ae9fafad065fcb5834430fede7.png", 
            views: 9192,
            comments: 11,
            categories: [
                "fantasy, horor"
            ],
            totalEp: 10,
            finishedEp: 9,
            views: 10000,
            comments: 100
        }
       
            
        var product2 = {
            id: i*2 + 1,
            name: "Gintama Movie 2: Kanketsu-hen - Yorozuya yo Eien",
            cover: "https://i.pinimg.com/564x/6c/35/f7/6c35f7525ef0457c906748f856289189.jpg", 
            views: 9192,
            comments: 11,
            categories: [
                "fantasy, horor"
            ],
            totalEp: 10,
            finishedEp: 9,
            views: 25000,
            comments: 300
        }

        data.push(product2)
       
        data.push(product1)
        newComment.push(product1)
        trending.push(product2)
        if(i%2)
            news.push(product2)
        else
            news.push(product1)
    }

    var categories = [
        

    ]

    for(let i =0; i< 5; i++){
        categories.push({
            _id: i,
            name: `Manga category item 1 2 3 4 --${i}`,
            description: 'no description',
            products: data,             
        })
    }
    res.render('home', {categories, topViews: trending, newComment: newComment, news: news})
}


function categories(req, res, next){
    const query = req.query;
    var data = [];
    var trending = [];
    var newComment = [];
    var news = []
    var cartegory = {
        _id: "asdfasdf",
        name: 'Manga category item 1 2 3 4',
        description: ''
    }

    for(let i = 0; i < 5; i++)
    {
        var product1 = {
            id: i*2,
            name: "The Seven Deadly Sins: Wrath of the Gods",
            cover: "https://i.pinimg.com/originals/c3/0f/a5/c30fa5ae9fafad065fcb5834430fede7.png", 
            views: 9192,
            comments: 11,
            categories: [
                "fantasy, horor"
            ],
            totalEp: 10,
            finishedEp: 9,
            views: 10000,
            comments: 100
        }
       
            
        var product2 = {
            id: i*2 + 1,
            name: "Gintama Movie 2: Kanketsu-hen - Yorozuya yo Eien",
            cover: "https://i.pinimg.com/564x/6c/35/f7/6c35f7525ef0457c906748f856289189.jpg", 
            views: 9192,
            comments: 11,
            categories: [
                "fantasy, horor"
            ],
            totalEp: 10,
            finishedEp: 9,
            views: 25000,
            comments: 300
        }

        data.push(product2)
       
        data.push(product1)
        newComment.push(product1)
        trending.push(product2)
        if(i%2)
            news.push(product2)
        else
            news.push(product1)
    }

    var categories = {
        _id:1,
        name: `ANIME`,
        description: 'no description',
        products: data, 
        
    }
    var pages = 8
    res.render('categories', {categories: [categories], topViews: trending, newComment: newComment, news: news, pages: 10, currentPage: query.page})
}

module.exports.index = index
module.exports.categories = categories