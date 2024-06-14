const express = require('express')
const app=express()
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rescue = require('express-rescue')
const fileRouter = require('../routes/fileRouter')
const cmsRouter = require('../routes/cmsRouter')
const personRouter = require('../routes/personRouter')
const limiter=require("../utils/rate_limiter")
const errorHandling=require('../middleware/errorHandling')
const path=require('path')
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(morgan('common'))
app.use(limiter)
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(helmet())
app.use('/files', rescue(fileRouter))
app.use('/ejs', rescue(cmsRouter))
app.use('/people', rescue(personRouter))
app.use(errorHandling.errorHandling);
module.exports=app
