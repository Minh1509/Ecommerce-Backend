const express = require('express');
const app = express();
const morgan = require('morgan')
const helmet = require('helmet');
const compression = require('compression');


// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression);



app.get('/', (req, res, next) => {
    const strCompress = 'Hello Minh';
    return res.status(200).json({
        message: "Hello",
        metaData : strCompress.repeat(10000)
    })
})

module.exports = app;
