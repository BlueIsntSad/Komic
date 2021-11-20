const  { User, Admin } = require('../models/user');

var users = [
    new User({
        name: 'Alex',
        account: '@SuperHandsomeAlex',
        views: 123
    }),
    new User({
        name: 'Bob',
        account: '@Bobby',
        views: 456
    })
]

module.exports = {
    index: function(req, res) {
        res.render('profile', {
            title: 'User guy | Komic',
            script: 'profile.js'
        })
    },
    add: function(req, res){
        for (var i = 0; i < users.length; i++) {
            users[i].save()
                .then((result) => {
                    res.send(result)
                })
                .catch((err) => {
                    console.log(err)
                });
        }
    }
}