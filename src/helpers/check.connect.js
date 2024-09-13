"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _Time = 5000;
const countConnect = () => {
  const num = mongoose.connections.length;
  console.log(`Number of connection: ${num}`);
};

// Check qúa tải ở server
const checkOverLoad = () => {
  setInterval(() => {
    const num = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    // console.log(`Active cores: ${num}`);
    // console.log(`Memory usage ${memoryUsage / 1024/ 1024} MB`);
    const maxConnection = numCores * 5;
    if (num > maxConnection) {
      console.log("server is overload detected");
    }
  }, _Time);
};
module.exports = { countConnect,
    checkOverLoad
 };
