"use strict";

const { SuccessResponse } = require("../core/success.response");
const { pushNotiToSystem, listNotiByUser } = require("../services/notification.service");

class NotificationController {
    listNotiByUser  = async (req, res, next) => {
    new SuccessResponse({
      message: "get list noti success",
      metadata: await listNotiByUser(req.query),
    }).send(res);
  };
 
  
}

module.exports = new NotificationController();
