import * as core from "express-serve-static-core";
import express = require("express");
import * as log from "./logger";
import { GlobalState } from "./app";

export const StatisticsRouter = express.Router();

StatisticsRouter.post("/statistics", (req, res) => {
  const body = req.body;

  log.log(`Stastics:\tConnections\t${GlobalState.connections}\tMessages\t${GlobalState.messages}`);
  res.writeHead(200, "OK", { "Content-Type": "text/plain" });
  res.end();
});