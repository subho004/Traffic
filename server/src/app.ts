// src/app.ts

import express from "express";
import http from "http";
import { Server as SocketIoServer } from "socket.io";
import mongoose from "mongoose";
import apiRoutes from "./routes/api";
import SocketController from "./controllers/SocketController";
import NodeDAO from "./dataAccess/NodeDAO";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
export const io = new SocketIoServer(server);

// Use MONGODB_URI directly without non-null assertion
const MONGODB_URI = process.env.MONGODB_URI!;
//console.log("MONGODB_URI:", MONGODB_URI);

(async () => {
  const client = await mongoose.connect(MONGODB_URI);

  console.log("Connected to MongoDB");

  // Set up cors middleware to handle Cross-Origin Resource Sharing
  app.use(cors());

  // Set up express middleware, body-parser, etc.
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Set up your routes
  app.use("/api", apiRoutes);

  // Socket.io connection
  io.on("connection", (socket) => {
    SocketController(io)(socket);
  });

  server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
})();
