const express = require('express');
const app = express();
const morgan = require('morgan')
const helmet = require('helmet');
const compression = require('compression');
const {checkOverLoad} = require("./helpers/check.connect");



// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression);

// init db
require("./db/init.mongodb");
checkOverLoad();

// init routes
app.get('/', (req, res, next) => {
    const strCompress = 'Hello Minh';
    return res.status(200).json({
        message: "Hello",
        metaData : strCompress.repeat(10000)
    })
})

module.exports = app;
