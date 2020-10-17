const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/config');

const musicreg = require('./api/v1/musicreg');
const playmeta = require('./api/v1/playmeta');
const user = require('./api/v1/user');
const search = require('./api/v1/search');

// Sequelize Setting
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.databaseurl);
const models = require('./db/models');

models.sequelize.sync({  })
.then(() => {
    console.log("DB sync Success");
})
.catch((err) => {
    console.log('DB sync Failed');
    console.log("Error: ", err);
});

const app = express();
const port = config.port;

const passport = require('passport');
const passportConfig = require('./config/passport');
passportConfig();

const session = require('express-session');

app.use(session({
  secret: config.sessionsecret,
  cookie: { maxAge: 60 * 60 * 1000 },
  resave: true,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));

app.use('/musicreg', musicreg);
app.use('/playmeta', playmeta);
app.use('/user', user);
app.use('/search', search);

app.listen(port, (err) => {
    if(err) {
        console.log(err);
        return;
    }
    console.log('Server listening on port', port);
});