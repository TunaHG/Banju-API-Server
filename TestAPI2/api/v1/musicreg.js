const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// AWS Setting
const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-northeast-2'});
const SQS = new AWS.SQS({ apiVersion: '2012-11-05' });

const router = express.Router();

// POST Request
router.post('/', (req, res) => {
    let msg = {
        MessageBody: JSON.stringify({ 'url': req.body.link }),
        QueueUrl: process.env.AWS_SQS_URL
    };

    // Test using Postman, send (key: link, value: 2qtKMC5wzkU) in Body's x-www-form-urlencoded
    console.log(msg.MessageBody)

    SQS.sendMessage(msg, (err, data) => {
        if (err) {
            console.log("Error", err);
          } else {
            console.log("Success", data.MessageId);
          }
    })
});

module.exports = router;