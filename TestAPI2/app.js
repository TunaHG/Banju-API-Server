const express = require('express');
const bodyParser = require('body-parser');

const musicreg = require('./api/v1/musicreg');
const playmeta = require('./api/v1/playmeta');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('express start');
});

// Routing
app.use('/musicreg', musicreg);
app.use('/playmeta', playmeta);

app.listen(port, () => {
    console.log('Express listening on port', port);
});