const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const campModel = require('./models/campground')
const reviewModel = require('./models/review')
const wrapAsync = require('./utils/wrapAsync')
const ExpressError = require('./utils/ExpressError')
const { joiSchema, reviewSchema } = require('./joischema')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const joi = require('joi')
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("Connection successfull !!")
    }).catch((err) => {
        console.log("error ")
        console.log(err)
    })

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate)
app.get('/', (req, res) => {
    res.render('home.ejs')
})


const validateCampground = (req, res, next) => {
    // const joiSchema = joi.object({
    //     campground: joi.object({
    //         title: joi.string().required(),
    //         price: joi.number().required().min(0),
    //         image: joi.string().required(),
    //         desciption: joi.string().required(),
    //         location: joi.string().required()
    //     }).required()
    // })
    const { error } = joiSchema.validate(req.body)


    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    } else {
        next()
    }
}
const validateReview = (req, res, next) => {
    // const joiSchema = joi.object({
    //     campground: joi.object({
    //         title: joi.string().required(),
    //         price: joi.number().required().min(0),
    //         image: joi.string().required(),
    //         desciption: joi.string().required(),
    //         location: joi.string().required()
    //     }).required()
    // })
    const { error } = reviewSchema.validate(req.body)


    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(400, msg)
    } else {
        next()
    }
}
app.get('/campgrounds', wrapAsync(async (req, res) => {
    const camps = await campModel.find({})
    res.render('campgrounds/allcampg.ejs', { camps })
}))
app.post('/campgrounds', validateCampground, wrapAsync(async (req, res, next) => {
    console.log(req.body)
    const campground = new campModel(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)

}))
app.get('/campgrounds/new', (req, res) => {
    res.render("campgrounds/newcamp.ejs")
})
app.get('/campgrounds/:id', wrapAsync(async (req, res) => {
    const { id } = req.params
    const campground = await campModel.findById(id).populate('reviews')
    res.render('campgrounds/singlecamp.ejs', { campground })
}))
app.put('/campgrounds/:id', validateCampground, wrapAsync(async (req, res) => {
    const { id } = req.params
    await campModel.findByIdAndUpdate(id, req.body.campground)
    res.redirect(`/campgrounds/${id}`)
}))
app.delete('/campgrounds/:id', wrapAsync(async (req, res) => {
    const { id } = req.params
    await campModel.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))
app.get('/campgrounds/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params
    const campground = await campModel.findById(id)
    res.render("campgrounds/editcamp.ejs", { campground })
}))



app.post('/campgrounds/:id/reviews', validateReview, wrapAsync(
    async (req, res) => {
        const { id } = req.params
        const review = req.body.review
        const newrev = new reviewModel(review)
        await newrev.save()
        const campground = await campModel.findById(id)
        campground.reviews.push(newrev)
        await campground.save()
        res.redirect(`/campgrounds/${id}`)

    }
))
app.delete('/campgrounds/:id/reviews/:reviewId', wrapAsync(
    async (req, res) => {
        const { id, reviewId } = req.params
        await campModel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
        await reviewModel.findByIdAndDelete(reviewId)
        res.redirect(`/campgrounds/${id}`)

    }
))
app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'We do not serve here !!'))
})
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong !! " } = err
    res.status(status).render('error.ejs', { err })
})
app.listen(3000, () => {
    console.log("Listening on port 3000")
})