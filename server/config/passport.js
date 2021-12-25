const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const {User, Admin} = require('../models/user');

module.exports = function(passport) {
  passport.use('user',
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { error_msg: 'Email chưa được đăng ký' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { error_msg: 'Mật khẩu sai' });
          }
        });
      });
    })
  );
  passport.use('admin',
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      Admin.findOne({
        account: email
      }).then(admin => {
        if (!admin) {
          return done(null, false, { error_msg: 'Email chưa được đăng ký' });
        }
        // Match password
        if (password == admin.password) {
          return done(null, admin);
        } else {
          return done(null, false, { error_msg: 'Mật khẩu sai' });
        };
      });
    })
  );
  passport.serializeUser(function(user, done) {
    done(null, user.id );
  });

  passport.deserializeUser(function(id, done) {

      Admin.findById(id, function(err, admin) {
          if (err) return done(err);
          if (admin) {
            admin.role = 'admin';
            return done(null, admin)};
          User.findById(id, function(err, user) {
              user.role = 'user';
              done(err, user);
          });
      });
  });
};