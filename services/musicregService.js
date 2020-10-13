// load config files
const config = require('../config/config');

// AWS SQS Setting
const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-northeast-2', accessKeyId: config.awsaccesskey, secretAccessKey: config.awssecretaccesskey });
const SQS = new AWS.SQS({ apiVersion: '2012-11-05' });

// load DB model
const models = require('../db/models');

exports.sendToSQS = async (link) => {
	// Set SQS msg Setting
	let msg = {
		MessageBody: JSON.stringify({ link: link }),
		QueueUrl: config.sqsurl,
	};

	// default result, When no error has occurred
	let result = 'Success';

	// Send message to SQS queue function
	await SQS.sendMessage(msg)
		.promise()
		.then((data) => {
			console.log('SQS Send Success');
		})
		// SQS Error Handling
		.catch((err) => {
			console.log('SQS Send Error');
			result = 'SQSErr';
		});

	// if SQS Error occur, do not execute Database create function
	if (result === 'SQSErr') {
		return result;
	}

	// Database row create function
	await models.Banjus.create({ link: link })
		.then((banjus) => {
			banjus.save();
			console.log('DB Save Success');
		})
		// DB Error Handling
		.catch((err) => {
			console.log('DB Save Error');
			result = 'DBErr';
		});

	return result;
};
