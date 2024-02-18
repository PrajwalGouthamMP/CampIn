const express = require('express')
const route = express.Router({ mergeParams: true })
const wrapAsync = require('../utils/wrapAsync')
const ExpressError = require('../utils/ExpressError')
const { reviewSchema } = require('../joischema')
const reviewModel = require('../models/review')
const campModel = require('../models/campground')
const { validateReview, ensureLoggedIn, isReviewAuthor } = require('../middleware')
const reviewContoller = require('../controllers/review')





route.post('/', ensureLoggedIn, validateReview, wrapAsync(reviewContoller.postnewreview))
route.delete('/:reviewId', isReviewAuthor, wrapAsync(reviewContoller.deletereview))
module.exports = route