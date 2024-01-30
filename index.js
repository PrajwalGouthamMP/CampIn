const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const campModel = require('./models/campground')
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

app.get('/', (req, res) => {
    res.render('home.ejs')
})
app.get('/makecampground', async (req, res) => {
    const newCamp = new campModel({ title: "My Backyard", description: "Cheap camping" })
    await newCamp.save();
    res.send(newCamp)
})
app.listen(3000, () => {
    console.log("Listening on port 3000")
})