const express = require('express');

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DEV_DATABASE_URL);

const router = express.Router();

// AI Model로부터 변환된 JSON을 전달받아서 DB에 저장하는 API
router.post('/', (req, res) => {
    let result = req.body.result;
});

// Client가 변환이 완료됬는지 확인하는 API
router.get('/:link', (req, res) => {

});

// Client가 참여하여 악보를 수정하는 API
router.put('/', (req, res) => {
    
});

// Client가 본인이 올린 .wav파일로 생성된 Data를 삭제하는 API
router.delete('/', (req, res) => {
    
})

module.exports = router;