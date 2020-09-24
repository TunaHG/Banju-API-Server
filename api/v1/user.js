const express = require('express');
const passport = require('passport');
const axios = require('axios');
const config = require('../../config/config');
const userService = require('../../services/userService');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/:type/:accessToken', (req, res) => {
    // What Social Login user want
    const type = req.params.type;
    // Set authorization using accesstoken
    const author = 'Bearer ' + req.params.accessToken;
    if(type == 'kakao'){
        // KAKAO API SETTING
        const option = {
            method: 'POST',
            url: 'https://kapi.kakao.com/v2/user/me',
            headers: {
                Authorization: author
            }
        }

        // GET KAKAO API
        axios.request(option)
        .then((data) => {
            // API Response
            const apiResult = data.data.kakao_account;
            // if(user is not in DB -user is not a memeber-)
            if(!userService.findUser(apiResult.email)){
                const user = {};
                user.email = apiResult.email;
                user.nickname = apiResult.profile.nickname
                // user join DB
                userService.join(user)
                .then((users) => {
                    console.log(users);
                    const tmp = users.dataValues
                    console.log(tmp);
                    const token = jwt.sign({email: tmp.email}, config.jwtsecret);
                    return res.send({tmp, token})
                })
                .catch((err) => {
                    console.log(1);
                    console.log(err);
                })
            } else {
                return res.send(userService.findUser(apiResult.email))
            }
        })
        .catch((err) => {
            console.log("Error: ", err);
            res.send(err);
        })
    }
    else if(type == 'google') {
        const option = {
            method: 'GET',
            url: 'https://www.googleapis.com/oauth2/v1/userinfo',
            headers: {
                Authorization: author
            },
            params: {
                alt: 'json'
            }
        }
        axios.request(option)
        .then((data) => {
            const apiResult = data.data;
            if(!userService.findUser(apiResult.email)){
                const user = {};
                user.email = apiResult.email;
                user.nickname = apiResult.name;
                userService.join(user)
                .then((users) => {
                    console.log(users);
                    const tmp = users.dataValues;
                    console.log(tmp);
                    const token = jwt.sign({email: tmp.email}, config.jwtsecret);
                    return res.send({tmp, token});
                })
                .catch((err) => {
                    console.log('Error in join!!!');
                    console.log(err);
                })
            }
            else {
                res.send(userService.findUser(apiResult.email));
            }
        })
        .catch((err) => {
            console.log('Error in axios!!!');
            res.send(err);
        })
    } 
    else {

    }
});

module.exports = router;