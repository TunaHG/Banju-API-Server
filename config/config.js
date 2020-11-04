require('dotenv').config();

var config = {};

config.port = 3000;

config.sqsurl = process.env.AWS_SQS_URL;
config.awsaccesskey = process.env.AWS_ACCESS_KEY;
config.awssecretaccesskey = process.env.SECRET_ACCESS_KEY;

config.googleclientid = process.env.GOOGLE_CLIENT_ID;
config.googleclientsecret = process.env.GOOGLE_CLIENT_SECRET;
config.googleapikey = process.env.GOOGLE_API_KEY2;
config.kakaoclientid = process.env.KAKAO_CLIENT_ID;
config.kakaoclientsecret = process.env.KAKAO_CLIENT_SECRET;
config.sessionsecret = process.env.SESSION_SECRET;

config.jwtsecret = process.env.JWT_SECRET;

config.databaseurl = process.env.DEV_DATABASE_URL;

config.sentrydsn = process.env.SENTRY_DSN;

module.exports = config;
