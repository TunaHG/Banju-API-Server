const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/index');

const musicreg = require('./api/v1/musicreg');
const playmeta = require('./api/v1/playmeta');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.default.databaseurl);

const app = express();
const port = config.default.port;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/musicreg', musicreg);
app.use('/playmeta', playmeta);

app.listen(port, (err) => {
    if(err) {
        console.log(err);
        return;
    }
    console.log('Server listening on port', port);
});