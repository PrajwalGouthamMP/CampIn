const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const campModel = require('./models/campground')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
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
app.get('/campgrounds', async (req, res) => {
    const camps = await campModel.find({})
    res.render('campgrounds/allcampg.ejs', { camps })
})
app.post('/campgrounds', async (req, res) => {
    const campground = new campModel(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
})
app.get('/campgrounds/new', (req, res) => {
    res.render("campgrounds/newcamp.ejs")
})
app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params
    const campground = await campModel.findById(id)
    res.render('campgrounds/singlecamp.ejs', { campground })
})
app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params
    await campModel.findByIdAndUpdate(id, req.body.campground)
    res.redirect(`/campgrounds/${id}`)
})
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params
    await campModel.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})
app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params
    const campground = await campModel.findById(id)
    res.render("campgrounds/editcamp.ejs", { campground })
})
app.listen(3000, () => {
    console.log("Listening on port 3000")
})