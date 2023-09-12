const app = require('./server.js')
const winston = require('winston');
const settings = require('./config/settings.js')

require('./startup/db')()

if(!process.env.JWT_PRIVATE_KEY){
    winston.error('FATAL ERROR: jwtPrivateKey is not defined')
    process.exit(1)
}

if (settings.environment == "development") {
    app.listen(settings.port, settings.localhost, () => {winston.info(`Listening on ${settings.localhost}:${settings.port}...`)});
}
else if (settings.environment == "staging") {
    app.listen(settings.port, () => {winston.info(`Listening on port ${settings.port}...`)});
}
