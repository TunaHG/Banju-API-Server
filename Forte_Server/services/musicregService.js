// load config files
const config = require('../config/config');

// AWS SQS Setting
const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-northeast-2' });
const SQS = new AWS.SQS({ apiVersion: '2012-11-05' });

// load DB model
const { Banjus } = require('../models/Banjus');

exports.sendToSQS = async (link) => {
    let msg = {
        MessageBody: JSON.stringify({ 'url': link }),
        QueueUrl: config.sqsurl
    };
    
    SQS.sendMessage(msg, (err, data) => {
        if(err) {
            console.log("SQS Send Error: ", err);
            return ;
        } else {
            console.log("SQS Send Success: ", data.MessageId);
            // Database save
            const savedata = await Banjus.create({ link: link });
            savedata.save();
            console.log("DB Save Data: ", savedata.link);
        }
    });
}