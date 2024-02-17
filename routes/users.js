const express = require('express')
const userModel = require('../models/user')
const wrapAsync = require('../utils/wrapAsync')
const route = express.Router()
route.get('/', (req, res) => {
    res.render('users/register.ejs')
})
route.post('/', wrapAsync(async (req, res) => {
    try {
        const { username, password, email } = req.body
        const newUser = new userModel({
            username: username,
            email: email
        })
        const registeredUser = await userModel.register(newUser, password)
        req.flash('success', 'Welcome to our Campgrounds')
        res.redirect('/campgrounds')
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')

    }

}))
module.exports = route