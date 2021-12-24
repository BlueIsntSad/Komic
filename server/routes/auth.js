const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const { User, Admin } = require('../models/user');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login', { cateList: res.locals.categoryList }));
router.get('/admin/login', forwardAuthenticated, (req, res) => res.render('login', { cateList: res.locals.categoryList }));
// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register', { cateList: res.locals.categoryList }));

// Register
router.post('/register', (req, res) => {
  const { account, email, password, password2 } = req.body;
  let errors = [];

  if (!account || !email || !password || !password2) {
    errors.push({ msg: 'Hãy điền đầy đủ thông tin' });
  }

  if (password != password2) {
    errors.push({ msg: 'Mật khẩu không khớp' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Mật khẩu phải có ít nhất 6 ký tự' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      account,
      email,
      password,
      password2,
      cateList: res.locals.categoryList
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email đã được đăng ký' });
        res.render('register', {
          errors,
          account,
          email,
          password,
          password2,
          cateList: res.locals.categoryList
        });
      } else {
        const newUser = new User({
          name: req.body.account,
          account: req.body.account,
          email: req.body.email,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'Đăng ký thành công bạn có thể đăng nhập'
                );
                res.redirect('/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

router.post(
  "/login",
  passport.authenticate("user", {
      failureRedirect: "/login",
      failureFlash: true
  }),
  (req,res) => {
     res.redirect("/");
});

router.post(
  "/admin/login",
  passport.authenticate("admin", {
      failureRedirect: "/admin/login",
      failureFlash: true
  }),
  (req,res) => {
     res.redirect('/');
});

// Logout
router.get('/logout', (req, res) => {
  console.log('User', req.user.id, 'logout')
  req.logout();
  req.flash('success_msg', 'You are logged out');
  req.session.destroy(function (err) {
    res.redirect('/login');
  });
});
module.exports = router;