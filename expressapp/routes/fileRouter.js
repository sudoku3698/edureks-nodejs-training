const express = require('express')
const service=require('../services/fileServices')
const middleware=require('../middleware')

const fileRouter = express.Router()

fileRouter.get('/read-file',middleware.auth, service.readFile)
fileRouter.post('/write-file',middleware.auth, service.writeFile)
fileRouter.put('/append-file',middleware.auth, service.appendFile)
fileRouter.delete('/delete-file',middleware.auth, service.deleteFile)
module.exports = fileRouter