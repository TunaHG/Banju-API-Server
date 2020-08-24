require('dotenv').config();

var config = {};

config.port = 3000;

config.sqsurl = process.env.AWS_SQS_URL;
config.awsaccesskey = process.env.AWS_ACCESS_KEY
config.awssecretaccesskey = process.env.SECRET_ACCESS_KEY

config.databaseurl = process.env.DEV_DATABASE_URL;

module.exports = config;
