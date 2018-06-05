var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var winston = require('./logger/logger');
var config = require('./config/config');
var app = express();
var api = require('./api/components/api');
var mailSender = require('@sendgrid/mail');

app.use(morgan('combined', { stream: winston.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

api._register(app);
mailSender.setApiKey(config.apiKey);

app.listen(config.port, () => {
    console.log("App listening on port 3050");
});

module.exports = app;
