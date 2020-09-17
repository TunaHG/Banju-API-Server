const express = require('express');
const passport = require('passport');
const request = require('request');
const axios = require('axios');
const qs = require('querystring');
const config = require('../../config/config');

const router = express.Router();

router.get('/user/:accessToken', (req, res) => {
    const option = {
        method: 'POST',
        url: 'https://kapi.kakao.com/v2/user/me',
        headers: {
            Authorization: 'Bearer mVajAIlE-Ldzf5JXajDq4OxFJvPdTImeX0NtoAopcNEAAAF0mpoHfg'
        }
    }
    // request.post(option, (err, httpResponse, body) => {
    //     if(err){
    //         console.log(err);
    //     }
    //     if(httpResponse.statusCode != 200){ 
    //         console.log(httpResponse);
    //     }
    //     console.log(body);
    //     res.send(body);
    // });
    axios.request(option)
    .then((data) => {
        console.log("Good");
        console.log(data);
        res.send(data.data.kakao_account);
    })
    .catch((err) => {
        console.log("Error: ", err);
        res.send(err);
    })
});

router.get('/', (req, res) => {
    const option = {
        uri: 'https://kauth.kakao.com/oauth/authorize',
        qs: {
            response_type: 'code',
            client_id: config.kakaoclientid,
            redirect_uri: qs.stringify('http://localhost:3000/kakao/oauth')
        }
    }
    request.get(option, (err, res, body) => {
        console.log(res.statusCode);
    })
});

router.get('/login/:authorization_code', (req, res) => {
    request.post('https://kauth.kakao.com/oauth/token', {
        grant_type: 'authorization_code',
        client_id: config.kakaoclientid,
        redirect_uri: 'http://localhost:3000/kakao/oauth',
        code: req.params.authorization_code
    }, (err, res, body) => {
        console.log(res.statusCode);
    })
});

router.get('/oauth', (req, res) => {
    res.send('login success');
});

router.get('/fail', (req, res) => {
    res.send('login failed');
});

module.exports = router;