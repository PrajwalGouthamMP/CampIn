const mongoose = require('mongoose')
const schema = mongoose.Schema;
const campSchema = new schema({
    title: String,
    image: String,
    price: Number,
    location: String,
    description: String,
    reviews: [
        {
            type: schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})
module.exports = mongoose.model('Campground', campSchema)