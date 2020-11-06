const express = require('express');
const passport = require('passport');
const config = require('../../config/config');
const userService = require('../../services/userService');
const jwt = require('jsonwebtoken');

const router = express.Router();

/*
 * Check member API
 * get userInfo from social login(kakao, google, apple) using accesstoken from frontend
 * check our database using user's email
 * return status of user's join status
 *
 * Type : kakao, google, apple
 * accessToken : Each type's Login Authenticate accesstoken
 */
router.post('/', async (req, res) => {
    const type = req.body.type;
    const author = 'Bearer ' + req.body.accessToken;

    let result = { message: 'wow' };
    if (type === 'kakao') {
        result = await userService.kakaologin(author);
    }
    else if (type === 'google') {
        result = await userService.googlelogin(author);
    }
    else if (type === 'apple') {
        result = await userService.applelogin(req.body.accessToken);
    }

    console.log(result);
    res.send(result);
});

/*
 * Join API
 * Join our service with data (email, name)
 */
router.post('/join', (req, res, next) => {
    userService.joinUser(req.body.email)
        .then((result) => {
            const token = jwt.sign({ id: result, auth: 'http://api.dailybanju.com' }, config.jwtsecret);
            return res.send({ message: 'Success', token });
        })
        .catch(next);
});

/*
 * Get UserInfo API
 * get user data
 * name, email, banju, practice, ... etc
 */
router.get('/me', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    userService.getUserInfo(req.user.id)
        .then((result) => {
            return res.send({ status: 'success', data: result });
        })
        .catch(next)
});

module.exports = router;
