const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Google Login Main')
});

router.get('/login', 
    passport.authenticate('google', { scope : ['profile'] })
);

router.get('/oauth', 
    passport.authenticate('google', {
        failureRedirect: '/fail'
    }),
    (req, res) => {
        res.send('login success');
    }
);

router.get('/fail', (req, res) => {
    res.send('login failed');
});

module.exports = router;