const express = require('express')
const loginRouter = express.Router()
const loginService = require('../services/loginService')

loginRouter.get('/login', loginService.loginForm)
loginRouter.post('/login', loginService.login)
loginRouter.get('/logout', loginService.logout)

module.exports = loginRouter
