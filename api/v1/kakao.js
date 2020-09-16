const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Kakao Login Main')
});

router.get('/login', 
    passport.authenticate('kakao', { scope : ['profile'] })
);

router.get('/oauth', 
    passport.authenticate('kakao', {
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