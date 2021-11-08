const Manga = require('../models/manga');

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
    }
};