require('dotenv').config();

const express = require('express')
const path = require('path')
const expressHandlebars = require('express-handlebars')
const mongoose = require('mongoose')

// Router
const route = require('./server/routes/index')
const mangaRoute = require('./server/routes/manga')

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
    layoutsDir: __dirname + '/views/layouts/'
}));
app.set('view engine', 'hbs');

// Static file
app.use(express.static(path.join(__dirname, './public')));
app.use('/manga', express.static(path.join(__dirname, './public')));
app.use('/manga/ep', express.static(path.join(__dirname, './public')));

// Home page
app.use('/', route)

// Manga branch page (manga-detail, manga-reading)
app.use('/manga', mangaRoute)

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