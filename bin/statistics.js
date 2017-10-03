"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const log = require("./logger");
const app_1 = require("./app");
exports.StatisticsRouter = express.Router();
exports.StatisticsRouter.post("/statistics", (req, res) => {
    const body = req.body;
    log.log(`Stastics:\tConnections\t${app_1.GlobalState.connections}\tMessages\t${app_1.GlobalState.messages}`);
    res.writeHead(200, "OK", { "Content-Type": "text/plain" });
    res.end();
});
