const express = require('express')
const userModel = require('../models/user')
const wrapAsync = require('../utils/wrapAsync')
const passport = require('passport')
const { storeReturnTo } = require('../middleware')
const route = express.Router()
route.get('/register', (req, res) => {
    res.render('users/register.ejs')
})
route.post('/register', wrapAsync(async (req, res, next) => {
    try {
        const { username, password, email } = req.body
        const newUser = new userModel({
            username: username,
            email: email
        })
        const registeredUser = await userModel.register(newUser, password)
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err)
            } else {
                req.flash('success', 'Welcome to our Campgrounds')
                res.redirect('/campgrounds')
            }
        })


    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')

    }

}))
route.get('/login', (req, res) => {
    res.render('users/login.ejs')
})
route.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome to our campgrounds !')
    const redirecturl = res.locals.returnTo || '/campgrounds'
    res.redirect(redirecturl)
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