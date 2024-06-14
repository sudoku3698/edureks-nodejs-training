const express = require('express')
const cmsService=require('../services/cmsService')

const cmsRouter = express.Router()

cmsRouter.get('/index', cmsService.index)
cmsRouter.get('/about', cmsService.about)


module.exports = cmsRouter