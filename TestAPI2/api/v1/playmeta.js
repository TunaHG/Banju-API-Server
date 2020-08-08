const express = require('express');

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DEV_DATABASE_URL);

// Test for Connection
sequelize.authenticate()
 .then(() => {
   console.log('Connection has been established successfully.');
 })
 .catch(err => {
   console.error('Unable to connect to the database:', err);
 });

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

const router = express.Router();

// AI Model로부터 변환된 JSON을 전달받아서 DB에 저장하는 API
router.post('/', (req, res) => {
    (async () => {
        await sequelize.sync();
        await Converted_Links.update({ result: JSON.parse(req.body.result) }, {
            where: { link: "QWERBWEAF" }
          });
        const finds2 = await Converted_Links.findAll({
            attributes: ['result'],
            where: {
              link: "QWERBWEAF"
            }
          });
          console.log("All links:", JSON.stringify(finds2, null, 2));
    })();
});

// Client가 변환이 완료됬는지 확인하는 API
router.get('/:link', (req, res) => {
    const link = req.params.link;
    console.log(link);
    (async () => {
        const find = await Converted_Links.findAll({
            attributes: ['result'],
            where: {
                link: link
            }
        });
        console.log(JSON.stringify(find, null, 2));
    })();
});

// Client가 참여하여 악보를 수정하는 API
router.put('/', (req, res) => {
    
});

// Client가 본인이 올린 .wav파일로 생성된 Data를 삭제하는 API
router.delete('/', (req, res) => {
    
})

module.exports = router;