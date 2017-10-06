"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    consumers: ["192.168.50.152:20001/producer", "192.168.50.152:20002/producer"],
    id: process.env.UID || "1",
    psk: process.env.PSK || "pre-shared-key",
    port: parseInt(process.env.PORT || "", 10) || 80,
    connectionTimeout: parseInt(process.env.TIMEOUT || "", 10) || 3000,
};
exports.default = config;
