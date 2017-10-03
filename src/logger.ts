import fs = require("fs");

const logFile = "/tmp/producer-app.log";

export const log = function (entry: string) {
  // TODO: Synchronous logging is slow.
  fs.appendFileSync(logFile, new Date().toISOString() + " - " + entry + "\n");
};

