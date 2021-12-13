require('dotenv').config();

const express = require('express')
const path = require('path')
const expressHandlebars = require('express-handlebars')
const helpers = require('handlebars-helpers')()
const mongoose = require('mongoose')

// Router
const route = require('./server/routes/index')
const mangaRoute = require('./server/routes/manga')
const adminRouter = require('./server/routes/admin')
const userRoute = require('./server/routes/user')

//Helper
const hbsHelper = require('./server/helpers/helpers')


const app = express();
const port = 3000;

// For parsing POST
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

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
        selectedItem: hbsHelper.selectedItem
    }
}));
app.set('view engine', 'hbs');

/* app.use(sesion({
    serect:'',
    resave:false,
    saveUninitialized:false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 120*60*1000 }
})); */
// app.use(passport.initialize());
// app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

/* app.use(function(req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
}) */

// Page routing
app.use('/', route)
app.use('/manga', mangaRoute)
app.use('/admin', adminRouter)
app.use('/user', userRoute)

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

// Listen request
app.listen(process.env.PORT || port, function () {
    console.log('Server is running on Port ' + port);
})
