const campModel = require('../models/campground')
module.exports.getallcampgrounds = async (req, res) => {
    const camps = await campModel.find({})
    res.render('campgrounds/allcampg.ejs', { camps })
}
module.exports.postnewcampground = async (req, res, next) => {
    const campground = new campModel(req.body.campground)
    campground.author = req.user._id
    await campground.save()
    req.flash('success', 'Succesfully created a new Campground')
    res.redirect(`/campgrounds/${campground._id}`)

}
module.exports.getnewcampgroundform = (req, res) => {
    res.render("campgrounds/newcamp.ejs")
}
module.exports.getsinglecampground = async (req, res) => {
    const { id } = req.params
    const campground = await campModel.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if (!campground) {
        req.flash('error', 'Cannot Find such Campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/singlecamp.ejs', { campground })
}
module.exports.editcampground = async (req, res) => {
    const { id } = req.params
    await campModel.findByIdAndUpdate(id, req.body.campground)
    req.flash('success', 'Succesfully updated a new Campground')
    res.redirect(`/campgrounds/${id}`)
}
module.exports.deletecampground = async (req, res) => {
    const { id } = req.params
    await campModel.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}
module.exports.geteditcampgroundform = async (req, res) => {
    const { id } = req.params
    const campground = await campModel.findById(id)
    if (!campground) {
        req.flash('error', 'Cannot Find such Campground')
        return res.redirect('/campgrounds')
    }
    res.render("campgrounds/editcamp.ejs", { campground })
}