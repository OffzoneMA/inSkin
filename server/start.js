const app = require('./server.js')
const winston = require('winston');
const settings = require('./config/settings.js')

require('./startup/db')()

 if(!process.env.JWT_PRIVATE_KEY){
    console.log("FATAL ERROR: jwtPrivateKey is not defined")
    winston.error('FATAL ERROR: jwtPrivateKey is not defined')
    process.exit(1)
}else{
    console.log("hy i'm wiam")
}

if (settings.environment == "development") {
    console.log("hy i'm note here",settings.localhost)
    app.listen(settings.port, settings.localhost, () => {
        console.log("Listening on",settings.localhost+":"+settings.port+"...")
        winston.info(`Listening on ${settings.localhost}:${settings.port}...`)
    });
    console.log("hy i'm note here",settings.port)
}
else if (settings.environment == "staging") {
    app.listen(settings.port, () => {winston.info(`Listening on port ${settings.port}...`)});
}
