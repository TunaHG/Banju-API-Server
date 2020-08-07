// const express = require('express');
const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(process.env.DEV_DATABASE_URL);

// Test for Connection
sequelize.authenticate()
 .then(() => {
   console.log('Connection has been established successfully.');
 })
 .catch(err => {
   console.error('Unable to connect to the database:', err);
 });

// try {
//     sequelize.authenticate();
//     console.log('Connection has been established successfully.');
// } catch (error) {
//     console.error('Unable to connect to the database:', error);
// }
// sequelize.close();

const Converted_Links = sequelize.define('Converted_Links', {
    link: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    result: Sequelize.JSON
}, {
    freezeTableName: true,
    timestamps: false
});

console.log(Converted_Links == sequelize.models.Converted_Links);

// Converted_Links.sync({ });
// sequelize.sync({ force: true});

// await Link.drop();

(async () => {
    await sequelize.sync({ force: true });
    const first = Converted_Links.build({ link: "youtube.com/QWERBWEAF" });
    console.log(first instanceof Converted_Links);
    console.log(first.link);

    await first.save();
    console.log('first was saved to the database!');

    // await first.destroy();

    const second = await Converted_Links.create({ link: "youtube.com/QBEJFBIR" });
    console.log(second instanceof Converted_Links);
    console.log(second.link);

    second.link = "youtube.com/Changed";
    await second.reload();

    await second.save();
    console.log('second was saved to the database!');

    const finds = await Converted_Links.findAll();
    
    console.log(finds.every(link => link instanceof Converted_Links));
    console.log("All links:", JSON.stringify(finds, null, 2));

    await Converted_Links.update({ result: {"result": "success"} }, {
      where: { link: "youtube.com/QBEJFBIR" }
    })
    const finds2 = await Converted_Links.findAll({
      attributes: ['result'],
      where: {
        link: "youtube.com/QBEJFBIR"
      }
    });
    console.log("All links:", JSON.stringify(finds2, null, 2));
})();

// const app = express();