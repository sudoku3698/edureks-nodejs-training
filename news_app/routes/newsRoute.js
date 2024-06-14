const express = require('express')
const router = express.Router()
const newsService = require('../services/newsService')

router.get('/',newsService.getAllNews)

router.get('/:id', newsService.getNewsById)

router.post('/', newsService.addNews)

router.put('/:id',newsService.updateNews)

router.delete('/:id', newsService.deleteNews)

module.exports = router
