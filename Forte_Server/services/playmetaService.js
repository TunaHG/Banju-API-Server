const { Converted_Links } = require('../models/Converted_Links');

exports.find = async (link) => {
    // sync()가 어디에 들어가야 하는지? issue #2
    // await Converted_Links.sync();
    const find = await Converted_Links.findAll({
        attributes: ['result'],
        where: {
            link: link
        }
    });
    console.log("Check Data: ", JSON.stringify(find, null, 2));
    return find;
};

exports.store = async (link) => {
    // await Converted_Links.sync();
    const data = Converted_Links.create({ link: link });
    await data.save();
    console.log("Save Data: ", data.link);
};

exports.update = async (link, result) => {
    // await Converted_Link.sync();
    await Converted_Links.update({ result: result }, {
        where: { link: link }
    });
    console.log("Update Data: ", result)
};