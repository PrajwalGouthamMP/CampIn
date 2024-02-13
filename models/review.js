const mngs = require('mongoose')
const Schema = mngs.Schema
const reviewSchema = new mngs.Schema({
    body: String,
    rating: Number
})
const Review = mngs.model('Riview', reviewSchema)
module.exports = Review
