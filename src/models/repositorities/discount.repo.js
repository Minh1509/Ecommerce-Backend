"use strict";

const { unGetSelectData, getSelectData } = require("../../utils");

const findAllDiscountCodesUnSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  unSelect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { id: -1 } : { id: 1 };
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean();
  return documents;
};
const findAllDiscountCodesSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { id: -1 } : { id: 1 };
  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
  return documents;
};

const checkDiscountExits = async ({model, filter}) => {
  return await model.findOne(filter).lean();
};
module.exports = {
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesSelect,
  checkDiscountExits,
};
