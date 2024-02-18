const express = require('express')
const userModel = require('../models/user')
const wrapAsync = require('../utils/wrapAsync')
const passport = require('passport')
const { storeReturnTo } = require('../middleware')
const route = express.Router()
const userController = require('../controllers/user')

route.get('/register', userController.getregisterform)

route.post('/register', wrapAsync(userController.postnewuser))

route.get('/login', userController.getloginform)

route.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.loginuser)

route.get('/logout', userController.logoutuser)
module.exports = route