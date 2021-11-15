const Manga = require('../models/manga');

async function getTopView(req, res){
    const param = req.params['id'];
    var trending = [];
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
        trending.push(product1)
    }
    console.log(param)
    res.json(trending)
}

async function getCategory(req, res){
    const id = req.params['id'];
    query = req.query;
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

module.exports = {
    index: function(req, res) {
        res.render('manga-details', {
            title: 'Lorem ipsum dolor | Komic',
            script: 'manga-details.js'
        })
    },
    read: function(req, res) {
        res.render('manga-reading', {
            title: 'Lorem ipsum dolor - Chapter 1 | Komic',
            script: 'manga-reading.js'
        })
    },
    add: function(req, res){
        const manga = new Manga({
            title: 'Lorem'
        });
        manga.save()
            .then((result) => {
                res.send(result)
            })
            .catch((err) => {
                console.log(err)
            });
    },
    getTopView,
    getCategory
    
};

