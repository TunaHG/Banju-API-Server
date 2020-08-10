const dotenv = require('dotenv');
dotenv.config();

export default {
    port: 3000,
    sqsurl: process.env.AWS_SQS_URL,
    databaseurl: process.env.DEV_DATABASE_URL
}