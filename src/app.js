require('dotenv').config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const { checkOverLoad } = require("./helpers/check.connect");

// init middleware
app.use(morgan("dev"));
app.use(helmet());
// app.use(compression);
app.use(express.json());
app.use(express.urlencoded({ extend: true }));

app.get("/api/v1", (req, res) => {
  res.send("Hello");
})

// test pub sub redis
// require('./tests/inventory.test');
// const productTest = require('./tests/product.test');
// productTest.purchaseProduct('product:001', 10);

// init db
require("./db/init.mongodb");
checkOverLoad();

// init routes
app.use(require("./routes/index"));



// handing errors
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: error.stack,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
