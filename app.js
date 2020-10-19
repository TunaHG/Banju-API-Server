const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/config');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

const playmeta = require('./api/v1/playmeta');
const user = require('./api/v1/user');
const search = require('./api/v1/search');

// Sequelize Setting
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.databaseurl);
const models = require('./db/models');

const app = express();
const port = config.port;

// Sentry Setting
Sentry.init({
    dsn: config.sentrydsn,
    integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Express({ app }),
    ],
    tracesSampleRate: 1.0,
});
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

models.sequelize.sync({})
    .then(() => {
        console.log("DB sync Success");
    })
    .catch((err) => {
        console.log('DB sync Failed');
        console.log("Error: ", err);
    });

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

app.use('/playmeta', playmeta);
app.use('/user', user);
app.use('/search', search);

app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + "\n");
});

app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Server listening on port', port);
});