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
 *
 * TODO: Type분기를 Service의 function으로 변경
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
        result = await userService.applelogin(author);
    }

    console.log(result);
    res.send(result);
});

/*
 * Join API
 * Join our service with data (email, name)
 */
router.post('/join', (req, res) => {
    userService.joinUser(req.body.email, req.body.nickname)
        .then((result) => {
            if (result != 'JoinError') {
                const token = jwt.sign({ id: result }, config.jwtsecret);
                return res.send({ message: 'Success', token });
            } else {
                return res.send({ message: 'Error' });
            }
        })
        .catch((err) => {
            console.log('Error in Join');
            return res.send({ message: 'Error' });
        });
});

/*
 * Get UserInfo API
 * get user data
 * name, email, banju, practice, ... etc
 *
 * TODO: 세션으로 넘어오는 JWT decode해서 사용
 */
router.get('/me/:id', (req, res) => {
    userService.getUserInfo(req.params.id)
        .then((result) => {
            return res.send({ status: 'success', data: result });
        })
        .catch((err) => {
            console.log('Error in /user/me API');
            return res.send({ status: 'error' })
        })
});

module.exports = router;
