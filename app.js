let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let morgan = require('morgan');
let winston = require('./logger/logger');
let config = require('./config/config');
let app = express();
let api = require('./api/components/api');
let mailSender = require('@sendgrid/mail');

app.use(morgan('combined', { stream: winston.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/** Register API endpoints */
api._register(app);

/** Set Sendgrid API key */
mailSender.setApiKey(config.apiKey);
winston.info(`API key ${config.apiKey} is registered`);

app.listen(config.port, () => {
    winston.info(`App listening on port ${config.port}`);
});

module.exports = app;
