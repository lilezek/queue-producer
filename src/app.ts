import express = require("express");
import config from "./config";
import * as WebSocket from "ws";
import { WebSocketQueue } from "queue-protocol";
import { ConnectToConsumers } from "./consumers";
import { hashCode } from "./utils";
const app = express();
const expressWs = require("express-ws")(app);

export const GlobalState = {
  connections: 0,
  messages: 0,
};

export type State = typeof GlobalState;

if (config.psk === "pre-shared-key") {
  console.log("Warning: the environment variable PSK is not set. The system may be insecure.");
}

// Serve static files
app.use(express.static("public"));

// Websocket connection
app.ws("/produce", (ws, req) => {
  console.log("Peer connected to produce. Total connections: " + GlobalState.connections);
  // For every websocket connection at /produce we have a WebSocketQueue.
  GlobalState.connections += 1;
  const producerConnection = new WebSocketQueue(ws, config.psk);
  // After a short period, we close the connection if no hello has yet received.
  // TODO: Move this code to WebSocketQueue constructor.
  setTimeout(() => {
    if (!producerConnection.secure) {
      console.log("Peer timeout.");
      ws.close();
    }
  }, config.connectionTimeout);

  producerConnection.on("error", () => {
    console.log("Peer disconnected by error.");
  });

  producerConnection.on("message", (msg) => {
    GlobalState.messages += 1;

    const hash = hashCode(msg.topic);
    const consumer = consumerList[hash % consumerList.length];
    consumer.send({t: "m", s: msg.topic, d: msg.message});

    console.log("Message received");
    console.log(msg);
  });

  producerConnection.on("close", () => {
    GlobalState.connections -= 1;
    console.log("Peer disconnected. Total connections: " + GlobalState.connections);
  });
});

let consumerList: WebSocketQueue[] = [];

console.log("Connecting to consumers");
ConnectToConsumers().then((consumers) => {
  if (consumers) {
    consumerList = consumers;
    // Listen on port 3000, IP defaults to 127.0.0.1
    app.listen(config.port, () => {
      // Put a friendly message on the terminal
      console.log("Server running at http://127.0.0.1:" + config.port + "/");
    });
  }
});
