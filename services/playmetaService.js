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
exports.findBanjuByLink = (link) => {
    return new Promise((resolve, reject) => {
        models.Banjus.findOne({
            attributes: ['id', 'content'],
            where: {
                is_youtube: true,
                link: link,
            },
        })
            .then((data) => {
                console.log('find Banju by link query success');
                if (data === null) {
                    resolve(null);
                } else {
                    data.dataValues.content.id = data.dataValues.id;
                    resolve(data.dataValues.content);
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
};

exports.findBanjuById = (banjuId) => {
    return new Promise((resolve, reject) => {
        models.Banjus.findOne({
            attributes: ['content'],
            where: {
                id: banjuId
            }
        })
            .then((data) => {
                console.log('find Banju by id query success');
                if (data === null) {
                    resolve(null);
                } else {
                    data.dataValues.content.id = banjuId;
                    resolve(data.dataValues.content);
                }
            })
            .catch((err) => {
                reject(err);
            })
    });
}

// DB: Update function using link, content (youtube)
exports.updateBanju = (link, content) => {
    return new Promise((resolve, reject) => {
        models.Banjus.update(
            { content: content },
            {
                where: {
                    is_youtube: true,
                    link: link,
                },
            }
        )
            .then((data) => {
                console.log('SQL Update query Success');
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    })
};

// DB: Delete function using link
exports.deleteBanju = (link) => {
    return new Promise((resolve, reject) => {
        models.Banjus.destroy({
            where: {
                link: link,
            },
        })
            .then(() => {
                console.log('SQL Delete query Success');
                resolve();
            })
            .catch((err) => {
                reject(err);
            })
    });
};

// DB: Create Banju function developed from the existing Banju
exports.editBanju = (id, content) => {
    return new Promise((resolve, reject) => {
        this.findOriginalBanju(id)
            .then((originalBanjuId) => {
                if (originalBanjuId === null) {
                    originalBanjuId = id;
                }

                models.Banjus.create({
                    is_youtube: false,
                    content: content,
                    parent_banju_id: id,
                    original_banju_id: originalBanjuId,
                })
                    .then((banju) => {
                        banju.save();
                        console.log('Edit content save success');
                        resolve('success');
                    })
                    .catch((err) => {
                        console.log('Edit content save fail');
                        reject(err);
                    });
            })
            .catch((err) => {
                reject(err);
            })
    });
};

exports.findOriginalBanju = (banjuId) => {
    return new Promise((resolve, reject) => {
        models.Banjus.findOne({
            attributes: ['original_banju_id'],
            where: {
                id: banjuId
            }
        })
            .then(({ dataValues }) => {
                resolve(dataValues.original_banju_id);
            })
            .catch((err) => {
                reject(err);
            });
    })
}
