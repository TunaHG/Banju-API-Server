const express = require('express');

// config file .env load
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../config/.env') });

// AWS SQS Setting
const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-northeast-2'});
const SQS = new AWS.SQS({ apiVersion: '2012-11-05' });

const router = express.Router();

// router.get();
router.post('/', (req, res) => {
    let msg = {
        MessageBody: JSON.stringify({ 'url': req.body.link }),
        QueueUrl: process.env.AWS_SQS_URL
    };

    // Test using Postman, send (key: link, value: 2qtKMC5wzkU) in Body's x-www-form-urlencoded
    console.log(msg.MessageBody)

    // 이 부분이 Services 계층으로 넘어가야 하는지? issue 
    SQS.sendMessage(msg, (err, data) => {
        if (err) {
            console.log("Error", err);
          } else {
            console.log("Success", data.MessageId);
          }
    })
});
// router.put();
// router.delete();

module.exports = router;