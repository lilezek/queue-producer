import express = require("express");
import * as log from "./logger";
import config from "./config";
import * as WebSocket from "ws";
import { StatisticsRouter } from "./statistics";
const app = express();
const expressWs = require("express-ws")(app);

export const GlobalState = {
  connections: 0,
  messages: 0,
};

export type State = typeof GlobalState;

if (config.id === "") {
  log.log("Error: the environment variable UID is not set.");
  throw new Error("Error: the environment variable UID is not set.");
}

if (config.psk === "pre-shared-key") {
  log.log("Warning: the environment variable PSK is not set. The system may be insecure.");
}

// Serve static files
app.use(express.static("public"));

// Generate statistics
app.use(StatisticsRouter);

// Websocket connection
app.ws('/produce', (ws, req) => {
  ws.on("close", () => {
    GlobalState.connections -= 1;
  });

  ws.on("open", () => {
    GlobalState.connections += 1;
  });

  ws.on('message', (msg) => {
    GlobalState.messages += 1;
    log.log(JSON.stringify(msg));
  });
});

// Listen on port 3000, IP defaults to 127.0.0.1
app.listen(config.port);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:" + config.port + "/");
