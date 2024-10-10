"use strict";

const _ = require("lodash");

const getInfoData = ({ field = [], object = {} }) => {
  return _.pick(object, field);
};

// ['a', 'b'] => {a:1, b: 1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};
const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] == null) {
      delete obj[k];
    }
  });
  return obj;
};

/*
  const a = {
    c: {
      d: 1,
    }

    db.collection.updateOne({
      `c.d`:1  
    })
  }
*/
const updateNestedObjectParser = (obj) => {
  console.log(obj);
  const final = {};
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k]);
      Object.keys(response).forEach((a) => {
        final[`${k}.${a}`] = response[a];
      });
    }
    else {
      final[k] = obj[k];
    }
  });
  console.log(final);
  return final;
};
module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
};
