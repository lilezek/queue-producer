"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const WebSocket = require("ws");
const queue_protocol_1 = require("queue-protocol");
const consumers = [];
function ConnectToConsumers() {
    return __awaiter(this, void 0, void 0, function* () {
        if (consumers.length > 0) {
            // Already connected.
            return;
        }
        else {
            const promises = [];
            for (const consumer of config_1.default.consumers) {
                promises.push(new Promise((res, rej) => {
                    const ws = new WebSocket("ws://" + consumer);
                    ws.on("open", () => {
                        res(new queue_protocol_1.WebSocketQueue(ws, config_1.default.psk));
                    });
                    ws.on("error", (e) => {
                        rej(e);
                    });
                }));
            }
            return Promise.all(promises);
        }
    });
}
exports.ConnectToConsumers = ConnectToConsumers;
