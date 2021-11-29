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
app.use(express.urlencoded({ extended: true}));

// View engine
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', expressHandlebars({
    extname:'hbs',
    defaultLayout: 'default',
    layoutsDir: __dirname + '/views/layouts/',
    helpers: {
        ...helpers,
        convertDateString: hbsHelper.convertDateString,
        itemChecked: hbsHelper.itemChecked,
        activeItem: hbsHelper.activeItem,
        disablePage: hbsHelper.disablePage
    }
    helpers:
}));
app.set('view engine', 'hbs');

// Static file
app.use(express.static(path.join(__dirname, 'public')));

// Home page
app.use('/', route)

// Manga branch page (manga-detail, manga-reading)
app.use('/manga', mangaRoute)

//admin branch page
app.use('/admin', adminRouter)
// Manga branch page (manga-detail, manga-reading)
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
app.listen(process.env.PORT || port, function(){
    console.log('Server is running on Port '+ port);
})