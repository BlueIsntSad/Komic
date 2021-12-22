require('dotenv').config();

const express = require('express')
const path = require('path')
const expressHandlebars = require('express-handlebars')
const helpers = require('handlebars-helpers')()
const mongoose = require('mongoose')
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
require('./server/config/passport')(passport);
// Router
const route = require('./server/routes/index')
const mangaRoute = require('./server/routes/manga')
const adminRouter = require('./server/routes/admin')
const userRoute = require('./server/routes/user')
const authRoute = require('./server/routes/auth')
const navMW = require('./server/middleware/navbar');

//Helper
const hbsHelper = require('./server/helpers/helpers')


const app = express();
const port = 3000;

// Connect the database
database = process.env.db_URI
mongoose.connect(database, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then((result) => {
    console.log("Database connection successfully!");
  })
  .catch((err) => console.log(err));


// For parsing POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Express session
app.use(session({
  secret: 'M1lWSBrRLRLONrwzpVM9jA7dpTCCzgh9dPxcEI8',
  resave: true,
  saveUninitialized: true
}));
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Connect flash
app.use(flash());
// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  if(req.isAuthenticated) res.locals.isAuthenticated = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});
// View engine
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', expressHandlebars({
  extname: 'hbs',
  defaultLayout: 'default',
  layoutsDir: __dirname + '/views/layouts/',
  helpers: {
    ...helpers,
    convertDateString: hbsHelper.convertDateString,
    itemChecked: hbsHelper.itemChecked,
    activeItem: hbsHelper.activeItem,
    disablePage: hbsHelper.disablePage,
    addManga: hbsHelper.addManga,
    BreadCrumb: hbsHelper.BreadCrumb,
    showToast: hbsHelper.showToast,
    selectedItem: hbsHelper.selectedItem,
    initScripData: hbsHelper.initScripData
  }
}));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));


// Page routing
app.get('*', navMW.getCategories)
app.use('/', route)
app.use('/manga', mangaRoute)
app.use('/admin', adminRouter)
app.use('/user', userRoute)
app.use('/', authRoute);

app.use((req, res) => { res.status(404).render('error', { layout: false }) });

// Listen request
app.listen(process.env.PORT || port, function () {
  console.log('Server is running on Port ' + port);
})
