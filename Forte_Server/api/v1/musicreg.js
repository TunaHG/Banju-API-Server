const express = require('express');

// config file load
const config = require('../../config/index');

// AWS SQS Setting
const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-northeast-2'});
const SQS = new AWS.SQS({ apiVersion: '2012-11-05' });

const { store } = require('../../services/playmetaService');

const router = express.Router();

// router.get();
// Send Message to AI Model from Client
router.post('/', (req, res) => {
  let link = req.body.link;
  let msg = {
      MessageBody: JSON.stringify({ 'url': link }),
      QueueUrl: config.default.sqsurl
  };

  // Test using Postman, send (key: link, value: 2qtKMC5wzkU) in Body's x-www-form-urlencoded
  console.log(msg.MessageBody);

  // 이 부분이 Services 계층으로 넘어가야 하는지? issue 
  SQS.sendMessage(msg, (err, data) => {
    if (err) {
      console.log("Error", err);
      return ;
    } else {
      console.log("Success", data.MessageId);
    }
  });

  // Save DB
  store(link);
});
// router.put();
// router.delete();

module.exports = router;