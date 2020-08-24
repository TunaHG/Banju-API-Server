const express = require('express');

// load AWS_SQS Service
const { sendToSQS } = require('../../services/musicregService');

const router = express.Router();

// Send Message to AI Model from Client
router.post('/', async (req, res) => {
  let link = req.body.link;

  // send to SQS Service
  const sqsdata = await sendToSQS(link);
  const resjson = {};
  resjson.data = sqsdata;
  console.log("SQS Function Result: ", sqsdata);
  res.send(resjson);
});

module.exports = router;