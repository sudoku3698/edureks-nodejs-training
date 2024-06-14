const express = require('express')
const newsFrontendService=require('../services/newsFrontendService')
const checkAuth = require('../middleware/checkAuth')


const cmsRouter = express.Router()
cmsRouter.use(checkAuth)

cmsRouter.get('/', newsFrontendService.index)
cmsRouter.get('/about', newsFrontendService.about)
cmsRouter.get('/edit/:id', newsFrontendService.editNews)
cmsRouter.get('/newsform', newsFrontendService.addNewsForm)
cmsRouter.post('/news', newsFrontendService.addNews);
cmsRouter.post('/:id', newsFrontendService.updateNews)
cmsRouter.post('/delete/:id', newsFrontendService.deleteNews)


module.exports = cmsRouter