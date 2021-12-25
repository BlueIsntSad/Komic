const { User ,Admin } = require('../models/user');

/*async function isAdmin() {
  Admin.findById(req.user.id.toString(), function (err, req, res) {
    if (err){
        return false;
    }
    else{
        return true;
    }
  });
}*/

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
        if (req.user.name == 'admin_test'){
          console.log(req.user.name);
          return next();
        }
        return res.redirect('/');
      }
      req.flash('error_msg', 'Đăng nhập để tiếp tục');
      res.redirect('/login');
    },
    /*checkAdmin: function(req, res, next) {
      if (req.isAuthenticated()) {
        if (isAdmin){
          return next();
        } return res.redirect('/');
      }
      req.flash('error_msg', 'Đăng nhập để tiếp tục');
      res.redirect('/login');
    },*/
    forwardUser: function(req, res, next) {
      if (req.isAuthenticated()) {
        if (req.user.name == 'admin_test'){
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
    forwardStorage: function(req, res, next) {
      if (req.isAuthenticated()) {
        if (req.user.name == 'admin_test'){
          return res.redirect('/admin');
        }
        return res.redirect('/user/' + req.user.id +'/storage');
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