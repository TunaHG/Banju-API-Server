const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/config');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

var swaggerDefinition = {
    info: { // API informations (required)
        title: 'Forte', // Title (required)
        version: '1.0.1', // Version (required)
        description: 'forte api server', // Description (optional)
    },
    host: 'localhost:3000', // Host (optional)
    basePath: '/', // Base path (optional)
    securityDefinitions: {
        jwt: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header'
        }
    },
    security: [
        { jwt: [] }
    ]
};

var options = {
    // Import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // Path to the API docs
    apis: ['./api/v1/*.js'],
};
var swaggerSpec = swaggerJSDoc(options);

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
    tracesSampleRate: 1.0
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

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));

app.use('/playmeta', playmeta);
app.use('/user', user);
app.use('/search', search);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
});
app.use(Sentry.Handlers.errorHandler());

// TODO: Sentry로 sequelize log들 뜨는거 수정해야함
// Optional fallthrough error handler
app.use(function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    console.log(err);
    res.send({ message: 'error', error: err.message });
});

app.listen(port, (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Server listening on port', port);
});