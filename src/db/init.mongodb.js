'use strict';

const mongoose = require("mongoose");
const {countConnect} = require("../helpers/check.connect");
const stringConnect =
  "mongodb+srv://minh1509:minh1509@cluster0.qqwua.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
