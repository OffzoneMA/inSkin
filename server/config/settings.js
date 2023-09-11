const settings = {
    dev: {
      localhost: process.env.LOCALHOST,
      port: process.env.PORT,
      environment: process.env.NODE_ENV,
      debug: process.env.DEBUG,
      databaseUrl: process.env.MONGO_URI
    },
    staging: {
      localhost: process.env.LOCALHOST,
      port: process.env.PORT,
      environment: process.env.NODE_ENV,
      debug: process.env.DEBUG,
      databaseUrl: process.env.MONGO_URI
    },
    prod: {},
  };
  
  const getCurrentSettings = () => {
    if (process.env.NODE_ENV == 'development') return settings.dev;

    if (process.env.NODE_ENV == 'staging') return settings.staging;
  
    return settings.prod;
  };
  
  module.exports = getCurrentSettings();
  