const express = require('express');

// load AWS_SQS Service
const { sendToSQS } = require('../../services/musicregService');

const router = express.Router();

// Send Message to AI Model from Client
router.post('/', (req, res) => {
  let link = req.body.link;

  // send to SQS Service
  const sqsdata = sendToSQS(link);
  const resjson = {};
  resjson.data = sqsdata;
  console.log("Result: ", sqsdata);
  res.json(resjson);
});

module.exports = router;