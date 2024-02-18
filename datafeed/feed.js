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
        const price = Math.floor(Math.random() * 50) + 10;
        const newCamp = new campModel({
            author: '65d04fc3c160c40ada940dc8',
            location: place,
            title: title,
            image: "https://source.unsplash.com/collection/483251",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum temporibus totam quibusdam adipisci vero ad architecto harum tenetur consectetur dolores. Ad ducimus exercitationem illum officia unde aliquid soluta doloribus fuga.",
            price: price
        })
        await newCamp.save()
    }
}
seedtodb().then(() => {
    mongoose.connection.close()
})
