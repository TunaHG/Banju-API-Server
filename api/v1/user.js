const express = require('express');
const passport = require('passport');
const axios = require('axios');
const config = require('../../config/config');
const userService = require('../../services/userService');
const jwt = require('jsonwebtoken');

const router = express.Router();

/*
 * Type : kakao, google, apple
 * accessToken : Each type's Login Authenticate accesstoken
 * 
 * 
 */
router.get('/:type/:accessToken', (req, res) => {
    const type = req.params.type;
    const author = 'Bearer ' + req.params.accessToken;
    // Kakao Login
    if(type == 'kakao'){
        const option = {
            method: 'POST',
            url: 'https://kapi.kakao.com/v2/user/me',
            headers: {
                Authorization: author
            }
        }

        axios.request(option)
        .then((data) => {
            const apiResult = data.data.kakao_account;
            userService.checkJoined(apiResult.email)
            .then((userId) => {
                if(userId == 0){
                    return res.send({status: 'not user'})
                }
                else if(userId == 'Err') {
                    throw Error();
                }
                else {
                    const token = jwt.sign({id: userId}, config.jwtsecret);
                    return res.send({status: 'already user', token});
                }
            })
            .catch((err) => {
                console.log("findUser Service Error in user api");
                console.log(err);
                res.send({status: 'CheckError'});
            })
        })
        .catch((err) => {
            console.log("Axios request Error in uesr api");
            console.log(err);
            res.send({status: 'AxiosError'});
        });
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
            
        })
        .catch((err) => {
            console.log('Error in axios!!!');
            res.send(err);
        })
    } 
    else if(type == 'apple') {

    }
    else {
        res.send({status: 'Type Error'})
    }
});

router.post('/join', (req, res) => {
    userService.joinUser(req.body.email, req.body.nickname)
    .then((result) => {
        if(result != 'JoinError'){
            const token = jwt.sign({id: result}, config.jwtsecret);
            return res.send({token});
        } else {
            return res.send({status: 'Error'})
        }
    })
    .catch((err) => {
        console.log("Error in Join");
        return res.send({status: 'Error'});
    })
});

router.get('/me/:id', (req, res) => {
    userService.getUserInfo(req.params.id)
    .then((result) => {
        return res.send({status: 'Success', data: result});
    })
    .catch((err) => {
        console.log('Error in /user/me API');
        return res.send({status: 'Error'})
    })
});

module.exports = router;