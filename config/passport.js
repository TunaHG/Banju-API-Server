const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('./config');

module.exports = () => {
    passport.serializeUser( (user, done) => {
        done(null, user);
    });

    passport.deserializeUser( (user, done) => {
        done(null, user);
    });

    passport.use(new GoogleStrategy({
        clientID: config.googleclientid,
        clientSecret: config.googleclientsecret,
        callbackURL: 'http://localhost:3000/google/oauth'
    }, (accessToken, refreshToken, profile, cb) => {
        return cb(null, profile);
    }));
}