// load config files
const config = require('../config/config');

// AWS SQS Setting
const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-northeast-2', accessKeyId: config.awsaccesskey, secretAccessKey: config.awssecretaccesskey });
const SQS = new AWS.SQS({ apiVersion: '2012-11-05' });

// load DB model
const models = require('../models');

exports.sendToSQS = (link, err) => {
    // Set SQS msg Setting
    let msg = {
        MessageBody: JSON.stringify({ 'url': link }),
        QueueUrl: config.sqsurl
    };
    
    // send message to SQS queue
    SQS.sendMessage(msg, async (err, data) => {
        // SQS Error Handling (Not Finished)
        if(err) {
            console.log("SQS Send Error: ", err);
            return 'SQSErr'
        }
        console.log("SQS Send Success: ", data.MessageId);
        // Database save
        const savedata = await models.Banjus.create({ link: link });
        savedata.save();
        // Database Error Handling (Not finished)
        if(err) {
            console.log("DB Save Error: ", err);
            return 'DBErr'
        }
        console.log("DB Save Data: ", savedata.link);
        return 'Success'
    });
}