const userModel = require('../models/user')
module.exports.getregisterform = (req, res) => {
    res.render('users/register.ejs')
}
module.exports.postnewuser = async (req, res, next) => {
    try {
        const { username, password, email } = req.body
        const newUser = new userModel({
            username: username,
            email: email
        })
        const registeredUser = await userModel.register(newUser, password)
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err)
            } else {
                req.flash('success', 'Welcome to our Campgrounds')
                res.redirect('/campgrounds')
            }
        })


    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')

    }

}
module.exports.getloginform = (req, res) => {
    res.render('users/login.ejs')
}
module.exports.loginuser = (req, res) => {
    req.flash('success', 'welcome to our campgrounds !')
    const redirecturl = res.locals.returnTo || '/campgrounds'
    res.redirect(redirecturl)
}
module.exports.logoutuser = (req, res) => {
    req.logOut(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/login');
    })
}