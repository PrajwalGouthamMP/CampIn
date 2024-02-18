const express = require('express')
const userModel = require('../models/user')
const wrapAsync = require('../utils/wrapAsync')
const passport = require('passport')
const { storeReturnTo } = require('../middleware')
const route = express.Router()
const userController = require('../controllers/user')

route.route('/register')
    .get(userController.getregisterform)
    .post(wrapAsync(userController.postnewuser))

route.route('/login')
    .get(userController.getloginform)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.loginuser)

route.get('/logout', userController.logoutuser)
module.exports = route