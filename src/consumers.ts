import * as qp from "queue-protocol";
import config from "./config";
import * as WebSocket from "ws";

const consumers: Array<qp.WebSocketQueue> = [];

async function ConnectToConsumers() {
  if (consumers.length > 0) {
    // Already connected.
    return;
  } else {
    const promises: Array<Promise<any>> = [];
    for (const consumer of config.consumers) {
      promises.push(new Promise((res, rej) => {
        const ws = new WebSocket(consumer);
        ws.on("open", () => {
          res();
        });
        ws.on("error", (e) => {
          rej(e);
        });
      }));
    }
    return Promise.all(promises);
  }
}
