const express = require('express')
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const app=express()
const axios = require('axios')
app.use(session({
    secret: 'ABCDEFG123456',
    resave: false,
    saveUninitialized: true,
    store: new FileStore({
        path: '../database/sessions',
        ttl: 60 * 60 * 24 * 7 // 1 week
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
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
app.use(express.static(path.join(__dirname, '../public')));
// app.use(morgan('common'))
// app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// app.use(helmet())
app.get('/', async (req, res) => {
  const response = await axios.get('http://localhost:6000/news')
  const news = response.data
  res.render('pages/news_index', { news })
})
app.use('/news', rescue(newsRoute))
app.use('/cms',rescue(newsFrntend))

app.use('/auth',rescue(loginRoute))
app.use(errorHandler)
module.exports=app

