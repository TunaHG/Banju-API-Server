const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const Sequelize = require('sequelize');
const { Converted_Links } = require('../models/Converted_Links');
const sequelize = new Sequelize(process.env.DEV_DATABASE_URL);

exports.find = async (link) => {
    // sync()가 어디에 들어가야 하는지? issue
    // await sequelize.sync();
    const find = await Converted_Links.findAll({
        attributes: ['result'],
        where: {
            link: link
        }
    });
    console.log("Update Data: ", JSON.stringify(find, null, 2));
    return find;
}

exports.store = async (link) => {
    // await sequelize.sync();
    const data = Converted_Links.create({ link: link });
    await data.save();
    console.log("Save Data: ", data.link);
}