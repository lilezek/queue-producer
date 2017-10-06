"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const log = require("./logger");
const config_1 = require("./config");
const statistics_1 = require("./statistics");
const queue_protocol_1 = require("queue-protocol");
const consumers_1 = require("./consumers");
const app = express();
const expressWs = require("express-ws")(app);
exports.GlobalState = {
    connections: 0,
    messages: 0,
};
if (config_1.default.id === "") {
    log.log("Error: the environment variable UID is not set.");
    throw new Error("Error: the environment variable UID is not set.");
}
if (config_1.default.psk === "pre-shared-key") {
    log.log("Warning: the environment variable PSK is not set. The system may be insecure.");
}
// Serve static files
app.use(express.static("public"));
// Generate statistics
app.use(statistics_1.StatisticsRouter);
// Websocket connection
app.ws('/produce', (ws, req) => {
    // For every websocket connection at /produce we have a WebSocketQueue.
    exports.GlobalState.connections += 1;
    const producerConnection = new queue_protocol_1.WebSocketQueue(ws, config_1.default.psk);
    // After a short period, we close the connection if no hello has yet received.
    // TODO: Move this code to WebSocketQueue constructor.
    setTimeout(() => {
        if (!producerConnection.secure) {
            ws.close();
        }
    }, config_1.default.connectionTimeout);
    ws.on('message', (msg) => {
        exports.GlobalState.messages += 1;
        log.log(JSON.stringify(msg));
    });
    ws.on("close", () => {
        exports.GlobalState.connections -= 1;
    });
});
console.log("Connecting to consumers");
consumers_1.ConnectToConsumers().then((consumerList) => {
    if (consumerList) {
        // Listen on port 3000, IP defaults to 127.0.0.1
        app.listen(config_1.default.port, () => {
            // Put a friendly message on the terminal
            console.log("Server running at http://127.0.0.1:" + config_1.default.port + "/");
        });
    }
});
