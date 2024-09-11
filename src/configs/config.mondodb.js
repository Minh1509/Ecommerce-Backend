require('dotenv').config();

const dev =  {
    app: {
        port : process.env.DEV_APP_PORT
    },
    db : {
        host:process.env.DEV__DB_HOST,
        port: process.env.DEV__DB_PORT,
        name: process.env.DEV_DB_NAME 
    }
}

const pro =  {
    app: {
        port : process.env.PRO_APP_PORT
    },
    db : {
        host:process.env.PRO__DB_HOST,
        port: process.env.PRO__DB_PORT,
        name: process.env.PRO_DB_NAME 
    }
}

const config = {dev, pro};
const env = process.env.NODE_ENV || 'dev';
module.exports = config[env];
