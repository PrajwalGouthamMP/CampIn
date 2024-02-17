const express = require('express')
const userModel = require('../models/user')
const wrapAsync = require('../utils/wrapAsync')
const passport = require('passport')
const route = express.Router()
route.get('/register', (req, res) => {
    res.render('users/register.ejs')
})
route.post('/register', wrapAsync(async (req, res) => {
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
route.get('/login', (req, res) => {
    res.render('users/login.ejs')
})
route.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome to our campgrounds !')
    res.redirect('/campgrounds')
})
route.get('/logout', (req, res) => {
    req.logOut(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/login');
    })
})
module.exports = route