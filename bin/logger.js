"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const logFile = "/tmp/producer-app.log";
exports.log = function (entry) {
    // TODO: Synchronous logging is slow.
    fs.appendFileSync(logFile, new Date().toISOString() + " - " + entry + "\n");
};
