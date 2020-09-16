const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
// const AppleStrategy = require('').Strategy;
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

    passport.use(new KakaoStrategy({
        clientID: config.kakaoclientid,
        clientSecret: config.kakaoclientsecret,
        callbackURL: 'http://localhost:3000/kakao/oauth'
    }, (accessToken, refreshToken, profile, cb) => {
        return cb(null, profile);
    }));

    // passport.use(new AppleStrategy({}, {}));
}