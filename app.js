const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/config');

const musicreg = require('./api/v1/musicreg');
const playmeta = require('./api/v1/playmeta');

// Sequelize Setting
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.databaseurl);
const models = require('./db/models');

models.sequelize.sync({ })
.then(() => {
    console.log("DB sync Success");
})
.catch((err) => {
    console.log('DB sync Failed');
    console.log("Error: ", err);
});

const app = express();
const port = config.port;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));

app.use('/musicreg', musicreg);
app.use('/playmeta', playmeta);

app.listen(port, (err) => {
    if(err) {
        console.log(err);
        return;
    }
    console.log('Server listening on port', port);
});