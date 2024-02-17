const mngs = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const userShema = new mngs.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})
userShema.plugin(passportLocalMongoose)
module.exports = mngs.model('User', userShema)