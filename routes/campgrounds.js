const express = require('express')
const route = express.Router()
const campModel = require('../models/campground')
const wrapAsync = require('../utils/wrapAsync')
const { ensureLoggedIn } = require('../middleware')
const { validateCampground, isAuthor } = require('../middleware')
const campgroundController = require('../controllers/campground')

route.route('/')
    .get(wrapAsync(campgroundController.getallcampgrounds))
    .post(ensureLoggedIn, validateCampground, wrapAsync(campgroundController.postnewcampground))


route.get('/new', ensureLoggedIn, campgroundController.getnewcampgroundform)

route.route('/:id')
    .get(wrapAsync(campgroundController.getsinglecampground))
    .put(ensureLoggedIn, isAuthor, validateCampground, wrapAsync(campgroundController.editcampground))
    .delete(ensureLoggedIn, isAuthor, wrapAsync(campgroundController.deletecampground))

route.get('/:id/edit', ensureLoggedIn, isAuthor, wrapAsync(campgroundController.geteditcampgroundform))

module.exports = route