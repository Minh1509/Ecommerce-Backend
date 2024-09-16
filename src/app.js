const express = require('express');
const app = express();
const morgan = require('morgan')
const helmet = require('helmet');
const compression = require('compression');
const {checkOverLoad} = require("./helpers/check.connect");



// init middleware
app.use(morgan("dev"));
app.use(helmet());
// app.use(compression);
app.use(express.json());
app.use(express.urlencoded({extend: true}));


// init db
require("./db/init.mongodb");
checkOverLoad();

// init routes
app.use(require("./routes/index"));

module.exports = app;
