const config = require('../config/config');
const models = require('../db/models');
const axios = require('axios');
const jwt = require('jsonwebtoken');

exports.joinUser = async (email) => {
    await models.Users.create({
        email: email,
    })
        .then((user) => {
            user.save();
            console.log("User Join Success");
            return user.id;
        })
        .catch((err) => {
            console.log("User Join Failed", err);
            return 'joinerror'
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

            if (data == null) {
                result = 0;
            }
            else {
                result = data.id;
            }
        })
        .catch((err) => {
            console.log("Find user Error occur");
            console.log(err);
            result = 'err';
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

exports.kakaologin = (author) => {
    return new Promise((resolve, reject) => {
        const option = {
            method: 'POST',
            url: 'https://kapi.kakao.com/v2/user/me',
            headers: {
                Authorization: author
            }
        };

        axios.request(option)
            .then(({ data }) => {
                const kakaoInfo = data.kakao_account;
                this.checkJoined(kakaoInfo.email)
                    .then((userId) => {
                        if (userId == 0) {
                            this.joinUser(kakaoInfo.email)
                                .then((id) => {
                                    if (id != 'joinerror') {
                                        const token = jwt.sign({ id: id }, config.jwtsecret);
                                        resolve({ message: 'not user', token });
                                    }
                                    else {
                                        reject();
                                    }
                                })
                                .catch((err) => {
                                    console.log('joinuser error in kakaologin func');
                                    resolve({ message: 'joinUserError', error: err.message });
                                });
                        }
                        else if (userId == 'Err') {
                            reject();
                        }
                        else {
                            const token = jwt.sign({ id: userId }, config.jwtsecret);
                            resolve({ message: 'already user', token });
                        }
                    })
                    .catch((err) => {
                        console.log('CheckJoined Error in kakaologin func');
                        console.log(err);
                        resolve({ message: 'checkJoinedError' });
                    });
            })
            .catch((err) => {
                console.log('Axios request Error in kakaologin func');
                console.log(err);
                resolve({ message: 'AxiosrequestError' });
            })
    });

};

exports.googlelogin = (author) => {
    return new Promise((resolve, reject) => {
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

        axios.request(option)
            .then(({ data }) => {
                this.checkJoined(data.email)
                    .then((userId) => {
                        if (userId == 0) {
                            this.joinUser(data.email)
                                .then((id) => {
                                    if (id != 'joinerror') {
                                        const token = jwt.sign({ id: id }, config.jwtsecret);
                                        resolve({ message: 'not user', token });
                                    }
                                    else {
                                        reject();
                                    }
                                })
                                .catch((err) => {
                                    console.log('joinuser error in googlelogin func');
                                    resolve({ message: 'joinUserError', error: err.message });
                                });
                        }
                        else if (userId == 'Err') {
                            reject();
                        }
                        else {
                            console.log('already user');
                            const token = jwt.sign({ id: userId }, config.jwtsecret);
                            resolve({ message: 'already user', token });
                        }
                    })
                    .catch((err) => {
                        console.log('CheckJoined Error in googlelogin func');
                        console.log(err);
                        resolve({ message: 'checkJoinedError' });
                    });
            })
            .catch((err) => {
                console.log('Axios request error in googlelogin func');
                console.log(err);
                resolve({ message: 'AxiosrequestError' });
            });
    });
};

exports.applelogin = (idToken) => {
    return new Promise((resolve, reject) => {
        if (idToken.iss !== 'https://appleid.apple.com') {
            reject(new Error('AppleAuth denied'));
        }
        const email = idToken.email;
        console.log(email);

        this.checkJoined(email)
            .then((userId) => {
                if (userId == 0) {
                    this.joinUser(email)
                        .then((id) => {
                            if (id != 'joinerror') {
                                const token = jwt.sign({ id: id }, config.jwtsecret);
                                resolve({ message: 'not user', token });
                            }
                            else {
                                reject();
                            }
                        })
                        .catch((err) => {
                            console.log('joinuser error in applelogin func');
                            resolve({ message: 'joinUserError', error: err.message });
                        });
                }
                else if (userId == 'Err') {
                    reject();
                }
                else {
                    console.log('already user');
                    const token = jwt.sign({ id: userId }, config.jwtsecret);
                    resolve({ message: 'already user', token });
                }
            })
            .catch((err) => {
                console.log('CheckJoined Error in googlelogin func');
                console.log(err);
                reject(new Error('checkJoinedError'));
            });
    });
};