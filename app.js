const express = require("express");
const app = express()
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const req = require("express/lib/request");
const path = require('path');

require("dotenv").config(); //loads environment variables from a .env file into process.env

const port = process.env.PORT || 8080;

//Middleware
//parse application/ x-www-form-urlencoded
app.use(express.urlencoded({extended:false}));

//Parse application/json
app.use(express.json());
//static files
app.use(express.static("public"));


//Templating Engine
app.engine('hbs', exphbs.engine( {extname: '.hbs' }));
app.set('view engine', 'hbs') //to use the hbs template engine

// app.get('/', (req,res) =>{
//     res.render(path.join(__dirname + '/login'))
// })





//ESTABLISH DIFFERENT ROUTES OR CONTROLLERS (MINI APPS)
const routes = require('./server/routes/user');
app.use('/', routes);




app.listen(port, () => console.log(`Listening on port ${port}`));