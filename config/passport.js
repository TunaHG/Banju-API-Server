const passport = require('passport');
const passportJWT = require('passport-jwt');
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;
const config = require('./config');
const models = require('../db/models');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwtsecret
    }, (jwtPayload, done) => {
        if (jwtPayload.auth !== 'http://api.dailybanju.com') {
            return done('error: auth invalid');
        }
        return models.Users.findByPk(jwtPayload.id)
            .then((user) => {
                return done(null, user);
            })
            .catch((err) => {
                return done(err);
            });
    }))
}