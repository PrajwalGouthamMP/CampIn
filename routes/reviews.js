const express = require('express')
const route = express.Router({ mergeParams: true })
const wrapAsync = require('../utils/wrapAsync')
const ExpressError = require('../utils/ExpressError')
const { reviewSchema } = require('../joischema')
const reviewModel = require('../models/review')
const campModel = require('../models/campground')

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)


    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    } else {
        next()
    }
}




route.post('/', validateReview, wrapAsync(
    async (req, res) => {
        const { id } = req.params
        const review = req.body.review
        const newrev = new reviewModel(review)
        await newrev.save()
        const campground = await campModel.findById(id)
        campground.reviews.push(newrev)
        await campground.save()
        req.flash('success', 'Succesfully created a new review')
        res.redirect(`/campgrounds/${id}`)

    }
))
route.delete('/:reviewId', wrapAsync(
    async (req, res) => {
        const { id, reviewId } = req.params
        await campModel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
        await reviewModel.findByIdAndDelete(reviewId)
        req.flash('success', 'Succesfully deleted a review')
        res.redirect(`/campgrounds/${id}`)

    }
))
module.exports = route