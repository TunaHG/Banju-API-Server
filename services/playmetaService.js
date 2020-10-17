// load modules
const models = require('../db/models');
const config = require('../config/config');

const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-northeast-2', accessKeyId: config.awsaccesskey, secretAccessKey: config.awssecretaccesskey });
const SQS = new AWS.SQS({ apiVersion: '2012-11-05' });

exports.sendToSQS = async (link) => {
	// Set SQS msg Setting
	let msg = {
		MessageBody: JSON.stringify({ link: link }),
		QueueUrl: config.sqsurl,
	};

	// default result, When no error has occurred
	let result = { message: 'success' };

	// Send message to SQS queue function
	await SQS.sendMessage(msg)
		.promise()
		.then((data) => {
			console.log('SQS Send Success');
			result.data = data;
		})
		// SQS Error Handling
		.catch((err) => {
			console.log('SQS Send Error');
			result.message = 'sqserr';
			result.error = err;
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
			result.message = 'dberr';
			result.error = err;
		});

	return result;
};

// DB: Select function using link
exports.findBanju = async (link) => {
	const count = await models.Banjus.count({
		where: {
			link: link
		}
	});

	if (count === 0) {
		console.log("Not found row about videoId");
		return 0;
	}

	const find = await models.Banjus.findOne({
		attributes: ['content'],
		where: {
			is_youtube: true,
			link: link,
		},
	});

	const content = find.content;
	console.log('SQL Select query Success');
	return content;
};

// DB: Update function using link, content (youtube)
exports.updateBanju = async (link, content) => {
	const update = await models.Banjus.update(
		{ content: content },
		{
			where: {
				is_youtube: true,
				link: link,
			},
		}
	);
	console.log('SQL Update query Success');
	return update;
};

// DB: Delete function using link
exports.deleteBanju = async (link) => {
	await models.Banjus.destroy({
		where: {
			link: link,
		},
	});
	console.log('SQL Delete query Success');
};

// DB: Create Banju function developed from the existing Banju
exports.editBanju = async (id, content) => {
	const findOriginal = await models.Banjus.findOne({
		attributes: ['original_banju_id'],
		where: {
			id: id,
		},
	});

	let originalBanjuId = findOriginal.original_banju_id;
	if (originalBanjuId == null) {
		originalBanjuId = id;
	}

	await models.Banjus.create({
		is_youtube: false,
		content: content,
		parent_banju_id: id,
		original_banju_id: originalBanjuId,
	})
		.then((banju) => {
			banju.save();
			console.log('Edit content save success');
			return 'success';
		})
		.catch((err) => {
			console.log('Edit content save fail');
			console.log(err);
			return 'error';
		});
};
