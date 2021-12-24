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