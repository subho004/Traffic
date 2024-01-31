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

const MONGODB_URI = process.env.MONGODB_URI!;

(async () => {
  const client = await mongoose.connect(MONGODB_URI);

  console.log("Connected to MongoDB");

  app.use(cors());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api", apiRoutes);

  io.on("connection", (socket) => {
    SocketController(io)(socket);
  });

  server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
})();
