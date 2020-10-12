const config = require('../config/config');
const models = require('../db/models');
const axios = require('axios');
const jwt = require('jsonwebtoken');

exports.joinUser = async (email, nickname) => {
    await models.Users.create({
        email: email,
        nickname: nickname
    })
    .then((user) => {
        user.save();
        console.log("User Join Success");
        return user.id;
    })
    .catch((err) => {
        console.log("User Join Failed", err);
        return 'JoinError'
    })
};

exports.checkJoined = async (email) => {
    let result = 0;
    await models.Users.findOne({
        attributes: ['id'],
        where: {
            email: email
        }
    })
    .then((data) => {
        console.log("Find user Success")
        console.log(data);

        if(data == null) {
            result = 0;
        }
        else {
            result = data.id;
        }
    })
    .catch((err) => {
        console.log("Find user Error occur");
        console.log(err);
        result = 'Err';
    });
    
    console.log(result);
    return result;
};

exports.getUserInfo = (id) => {
    models.Users.findOne({
        where: {
            id: id
        }
    })
    .then((data) => {
        return data.dataValues;
    })
    .catch((err) => {
        console.log("getUserInfo()'s Error occur");
        return err;
    })
};

exports.kakaologin = async (author) => {
    const option = {
        method: 'POST',
        url: 'https://kapi.kakao.com/v2/user/me',
        headers: {
            Authorization: author
        }
    };
    
    await axios.request(option)
    .then(({data}) => {
        const kakaoInfo = data.kakao_account;
        this.checkJoined(kakaoInfo.email)
        .then((userId) => {
            if(userId == 0) {
                return {message: 'not user'};
            }
            else if(userId == 'Err') {
                throw Error();
            }
            else {
                const token = jwt.sign({id: userId}, config.jwtsecret);
                return {message: 'already user', token};
            }
        })
        .catch((err) => {
            console.log('CheckJoined Error in kakaologin func');
            console.log(err);
            return {message: 'checkJoinedError'};
        });
    })
    .catch((err) => {
        console.log('Axios request Error in kakaologin func');
        console.log(err);
        return {message: 'AxiosrequestError'};
    })
};

exports.googlelogin = async (author) => {
    const option = {
        method: 'GET',
        url: 'https://www.googleapis.com/oauth2/v1/userinfo',
        headers: {
            Authorization: author
        },
        params: {
            alt: 'json'
        }
    };

    await axios.request(option)
    .then(({data}) => {
        this.checkJoined(data.email)
        .then((userId) => {
            if(userId == 0) {
                console.log('not user');
                return {message: 'not user'};
            }
            else if(userId == 'Err') {
                throw Error();
            }
            else {
                console.log('already user');
                const token = jwt.sign({id: userId}, config.jwtsecret);
                return {message: 'already user', token};
            }
        })
        .catch((err) => {
            console.log('CheckJoined Error in googlelogin func');
            console.log(err);
            return JSON.stringify({message: 'checkJoinedError'});
        });
    })
    .catch((err) => {
        console.log('Axios request error in googlelogin func');
        console.log(err);
        return {message: 'AxiosrequestError'};
    });
};