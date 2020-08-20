const express = require('express');

// load AWS_SQS Service
const { sendToSQS } = require('../../services/musicregService');

const router = express.Router();

// router.get();
// Send Message to AI Model from Client
router.post('/', (req, res) => {
  let link = req.body.link;

  // send to SQS Service
  sendToSQS(link);
});
// router.put();
// router.delete();

module.exports = router;