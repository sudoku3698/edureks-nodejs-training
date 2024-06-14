const express = require('express')
const session = require('express-session');
const app=express()
app.use(session({
    secret: 'ABCDEFG123456',
    resave: false,
    saveUninitialized: true
  }));
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rescue = require('express-rescue')
const path=require('path')
const newsRoute = require('../routes/newsRoute')
const newsFrntend=require('../routes/newsFrontend')
const loginRoute=require('../routes/loginRoute')
const errorHandler=require('../middleware/errorHandling')
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(morgan('common'))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(helmet())
app.use('/news', rescue(newsRoute))
app.use('/cms',rescue(newsFrntend))

app.use('/auth',rescue(loginRoute))
app.use(errorHandler)
module.exports=app

