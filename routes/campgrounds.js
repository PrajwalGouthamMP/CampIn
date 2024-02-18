const express = require('express')
const route = express.Router()
const campModel = require('../models/campground')
const wrapAsync = require('../utils/wrapAsync')
const { ensureLoggedIn } = require('../middleware')
const { validateCampground, isAuthor } = require('../middleware')


route.get('/', ensureLoggedIn, wrapAsync(async (req, res) => {
    const camps = await campModel.find({})
    res.render('campgrounds/allcampg.ejs', { camps })
}))
route.post('/', ensureLoggedIn, validateCampground, wrapAsync(async (req, res, next) => {
    const campground = new campModel(req.body.campground)
    campground.author = req.user._id
    await campground.save()
    req.flash('success', 'Succesfully created a new Campground')
    res.redirect(`/campgrounds/${campground._id}`)

}))
route.get('/new', ensureLoggedIn, (req, res) => {
    res.render("campgrounds/newcamp.ejs")
})
route.get('/:id', ensureLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params
    const campground = await campModel.findById(id).populate('reviews').populate('author')
    if (!campground) {
        req.flash('error', 'Cannot Find such Campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/singlecamp.ejs', { campground })
}))
route.put('/:id', ensureLoggedIn, isAuthor, validateCampground, wrapAsync(async (req, res) => {
    const { id } = req.params
    await campModel.findByIdAndUpdate(id, req.body.campground)
    req.flash('success', 'Succesfully updated a new Campground')
    res.redirect(`/campgrounds/${id}`)
}))
route.delete('/:id', ensureLoggedIn, isAuthor, wrapAsync(async (req, res) => {
    const { id } = req.params
    await campModel.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))
route.get('/:id/edit', ensureLoggedIn, isAuthor, wrapAsync(async (req, res) => {
    const { id } = req.params
    const campground = await campModel.findById(id)
    if (!campground) {
        req.flash('error', 'Cannot Find such Campground')
        return res.redirect('/campgrounds')
    }
    res.render("campgrounds/editcamp.ejs", { campground })
}))
module.exports = route