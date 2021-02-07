const passport = require('passport')
const jwtStrategy = require('passport-jwt').Strategy
const {ExtractJwt} = require('passport-jwt')

// addtional
require('dotenv').config()
const {customError} = require('./wrapper')
const User = require('../models/user')

passport.use(new jwtStrategy({
    jwtFromRequest : ExtractJwt.fromHeader('authorization'),
    secretOrKey : 'icrpytion2020BuildByDuniaGelap'
} , async(payload,done) => {
    try {
        const now = Date.now()
        const exp = payload.exp * 1000
        console.log(`Now ${now} and exp ${exp}`)
        if (Date.now() >= payload.exp * 1000) return done(customError('Token has expired',401))
        // find customer
        const user = await User.findByPk(payload.sub)
        if (!user) return done(customError('User not found' ,401))
        done(null,user)
    } catch (err) {
        console.log(err.message)
        done(err,false)
    }
}))