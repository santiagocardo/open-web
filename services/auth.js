const passport = require('passport')
const { Strategy } = require('passport-local')
const User = require('../models/users')

passport.use(
  new Strategy(async (username, password, cb) => {
    try {
      const user = await User.findOne({ username })
      if (!user) { return cb(null, false) }
      if (user.password !== password) { return cb(null, false) }
      return cb(null, user)
    } catch (err) {
      return cb(err)
    }
  }
))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser((id, cb) => {
  User.findById(id, function (err, user) {
    if (err) { return cb(err) }
    cb(null, user)
  })
})

const login = passport.authenticate('local', { failureRedirect: '/login' })

const isLoggedIn = (req, res, next) => {
  // first check if the user is authenticated
  if (req.isAuthenticated()) {
    next() // carry on! They are logged in!
    return
  }

  res.redirect('/login')
}

module.exports = {
  login,
  isLoggedIn
}