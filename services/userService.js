const config = require('../config/config');

const models = require('../models');

exports.join = async (user) => {
    let result = user;
    await models.Users.create({
        email: user.email,
        nickname: user.nickname
    })
    .then((users) => {
        users.save();
        console.log("User Join Success");
        result = users;
    })
    .catch((err) => {
        console.log("User Join Failed", err);
    })

    return result;
};

exports.findUser = async (email) => {
    const result = await models.Users.findOne({
        where: {
            email: email
        }
    });
    console.log('Find user data');
    console.log(result);
    if(result == null){
        result = false;
    }
    return result;
};