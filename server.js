const express = require('express')
const path = require('path')
const expressHandlebars = require('express-handlebars')

// Router
const route = require('./server/routes/index')

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
app.use(express.static('public'))

// Home page
app.use('/', route)

app.listen(port, function(){
    console.log('Server is running on Port '+ port);
})