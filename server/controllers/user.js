module.exports = {
    index: function(req, res) {
        res.render('profile', {
            title: 'User guy | Komic',
            script: 'profile.js'
        })
    }
}