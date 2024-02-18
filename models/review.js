const mngs = require('mongoose')
const Schema = mngs.Schema
const reviewSchema = new mngs.Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

})
const Review = mngs.model('Review', reviewSchema)
module.exports = Review
