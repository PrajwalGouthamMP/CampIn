const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("Connection successfull !!")
    }).catch((err) => {
        console.log("error ")
        console.log(err)
    })
const campModel = require('../models/campground')
const cities = require('./cities')
const { descriptors, places } = require('./description')

const randomnumbergen = (array) => {
    return Math.floor(Math.random() * array.length)
}
const seedtodb = async () => {
    await campModel.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const title = `${descriptors[randomnumbergen(descriptors)]}  ${places[randomnumbergen(places)]}`
        const num = randomnumbergen(cities)
        const place = `${cities[num].city} , ${cities[num].state}`
        const newCamp = new campModel({
            location: place,
            title: title
        })
        await newCamp.save()
    }
    console.log((await campModel.find({})).length)
}
seedtodb().then(() => {
    mongoose.connection.close()
})
