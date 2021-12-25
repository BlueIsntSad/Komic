const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const { User, Admin } = require('../models/user');
const controller = require('../controllers/auth');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login',{title: 'Login | Komic', cateList: res.locals.categoryList }));
router.get('/admin/login', forwardAuthenticated, (req, res) => res.render('login', { title: 'Admin Login | Komic', cateList: res.locals.categoryList }));
// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register', { title: 'Register', cateList: res.locals.categoryList}));

// Register
router.route('/register')
    .post(controller.register)
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