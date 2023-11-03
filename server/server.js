const dotenv = require("dotenv");
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

const express = require('express');
const morgan = require('morgan')
const winston = require('winston');
const settings = require('./config/settings')

const app = express()

if (settings.environment !== 'prod') {
    require('./startup/mockdata')();
}

require('./startup/logging')()
require('./startup/routes')(app)


if(settings.environment === 'development') {
    app.use(morgan('tiny'))   // Request Logging
    winston.info('Morgan enabled....')
}

module.exports = app