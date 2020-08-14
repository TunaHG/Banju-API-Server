const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/config');

const musicreg = require('./api/v1/musicreg');
const playmeta = require('./api/v1/playmeta');

const sequelize = require('./models').sequelize;
sequelize.sync();

const app = express();
const port = config.port;

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