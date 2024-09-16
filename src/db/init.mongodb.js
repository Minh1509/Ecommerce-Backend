'use strict';
require('dotenv').config();
const mongoose = require("mongoose");
const {countConnect} = require("../helpers/check.connect");
const stringConnect =process.env.DB_URI;

class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    mongoose
      .connect(stringConnect)
      .then((_) => console.log("Connected to mongodb pro", countConnect()))
      .catch((error) => console.log("Connect error"));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMondodb = Database.getInstance();
module.exports = instanceMondodb;
