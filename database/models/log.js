"use strict";

const mongoose = require("mongoose");

const LogType = {
  INFO: "INFO",
  ERROR: "ERROR",
  EMAIL_ACTIVATION: "EMAIL_ACTIVATION",
  EMAIL_RECOVERY: "EMAIL_RECOVERY",
  EMAIL_ERROR: "EMAIL_ERROR",
  USER_SIGNIN_ERROR: "USER_SIGNIN_ERROR",
};

let logSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: Object.values(LogType),
    required: [true, "Log type is required"],
    index: true
  },
  message: {
    type: String,
  },
  source: {
    type: String,
  }
}, {
  timestamps: true
});

logSchema.index({ "createdAt": 1 });

class LogClass {
  /**
   * Creates a new log entry with a specified type, log message and source (Promise)
   */
  static createNew(logType, logMessage, source) {
    let message = JSON.stringify(logMessage);

    if (message === "{}")
        message = String(logMessage);

    return this.create({
      type: logType,
      message,
      source
    });
  }
}

logSchema.loadClass(LogClass);
let Log = mongoose.model("log", logSchema);

module.exports = {
  Log,
  LogType
};