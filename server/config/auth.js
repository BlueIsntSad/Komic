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
        if (req.user.role == 'admin'){
          console.log(req.user.role);
          return next();
        }
        return res.redirect('/');
      }
      req.flash('error_msg', 'Đăng nhập để tiếp tục');
      res.redirect('/login');
    },
    forwardUser: function(req, res, next) {
      if (req.isAuthenticated()) {
        if (req.user.role == 'admin'){
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
        if (req.user.role == 'admin'){
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