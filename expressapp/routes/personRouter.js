const express = require('express')

const router = express.Router()

const personService = require('../services/peopleService')
const middleware = require('../middleware') // error handling middleware


router.get('/all',middleware.errorHandling, personService.getAllPeople)
router.get('/:id',middleware.errorHandling, personService.getById)
router.post('/search',middleware.errorHandling, personService.searchPeople)
router.post('/create',middleware.errorHandling, personService.createPerson)
module.exports = router