const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const { User, Admin } = require('../models/user');
const controller = require('../controllers/auth');
const { forwardAuthenticated } = require('../config/auth');
async function register(req, res, next) {
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
}

module.exports = {
  register
};