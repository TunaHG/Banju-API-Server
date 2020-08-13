const { Banju } = require('../models/Banju');

exports.find = async (link) => {
    const find = await Banju.findAll({
        attributes: ['result'],
        where: {
            link: link
        }
    });
    console.log("Check Data: ", JSON.stringify(find, null, 2));
    return find;
};

exports.store = async (link) => {
    const data = await Banju.create({ link: link });
    data.save();
    console.log("Save Data: ", data.link);
};

exports.update = async (link, result) => {
    await Banju.update({ result: result }, {
        where: { link: link }
    });
    console.log("Update Data: ", result)
};