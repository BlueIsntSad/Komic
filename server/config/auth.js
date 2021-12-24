module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error_msg', 'Đăng nhập để tiếp tục');
      res.redirect('/login');
    },
    checkUser: function(req, res, next) {
      if (req.isAuthenticated()) {
        console.log(req.query);
        console.log(req.user.id);
        return next();
        /*if ( req.params.uid === req.user.id) {return next();}
        else res.redirect('/user')*/
      }
      req.flash('error_msg', 'Đăng nhập để tiếp tục');
      res.redirect('/login');
    },
    forwardUser: function(req, res, next) {
      if (req.isAuthenticated()) {
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