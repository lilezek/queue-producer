import * as qp from "queue-protocol";
import config from "./config";
import * as WebSocket from "ws";
import { WebSocketQueue } from "queue-protocol";

const consumers: Array<qp.WebSocketQueue> = [];

export async function ConnectToConsumers() {
  if (consumers.length > 0) {
    // Already connected.
    return;
  } else {
    const promises: Array<Promise<WebSocketQueue>> = [];
    for (const consumer of config.consumers) {
      promises.push(new Promise((res, rej) => {
        const ws = new WebSocket("ws://" + consumer);
        ws.on("open", () => {
          res(new WebSocketQueue(ws, config.psk));
        });
        ws.on("error", (e) => {
          rej(e);
        });
      }));
    }
    return Promise.all(promises);
  }
}
