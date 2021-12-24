const { User ,Admin } = require('../models/user');
module.exports = {
    ensureAuthenticated: function(req, res, next) {

      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error_msg', 'Đăng nhập để tiếp tục');
      /*req.session.returnTo = req.originalUrl; 
      console.log(req.session.returnTo);*/
      res.redirect('/login');
    },
    checkAdmin: function(req, res, next) {
      if (req.isAuthenticated()) {
        if (req.user.name = 'admin_test'){
          console.log(req.user.name);
          return next();
        }
        return res.redirect('/');
        /*Admin.findById(req.user.id, function(err,admin){
          if (err){
            console.log(req.user.id);
            return res.redirect('/');
          }
          return next();
        })*/
        /*if ( req.params.uid === req.user.id) {return next();}
        else res.redirect('/user')*/
      }
      req.flash('error_msg', 'Đăng nhập để tiếp tục');
      res.redirect('/login');
    },
    forwardUser: function(req, res, next) {
      if (req.isAuthenticated()) {
        if (req.user.name = 'admin_test'){
          console.log(req.user.name);
          return res.redirect('/admin');
        }
        return res.redirect('/user/' + req.user.id);
        /*if ( req.params.uid === req.user.id) {return next();}
        else res.redirect('/user')*/
      }
      req.flash('error_msg', 'Đăng nhập để tiếp tục');
      res.redirect('/login');
    },
    forwardAuthenticated: function(req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      }
      res.redirect('/');      
    }
};