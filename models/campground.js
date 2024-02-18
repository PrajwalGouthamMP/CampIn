const mongoose = require('mongoose');
const Review = require('./review');
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
    ],
    author: {
        type: schema.Types.ObjectId,
        ref: 'User'
    }
})
campSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
})
module.exports = mongoose.model('Campground', campSchema)