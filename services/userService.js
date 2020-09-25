const config = require('../config/config');

const models = require('../db/models');

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
}