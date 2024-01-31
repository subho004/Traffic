// src/services/SocketService.ts

import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:8000";

const socket = io(SOCKET_URL);

const SocketService = {
  onNodeAdded: (callback: (node: any) => void) => {
    socket.on("nodeAdded", callback);
  },

  onNodeUpdated: (callback: (node: any) => void) => {
    socket.on("nodeUpdated", callback);
  },

  // You can add more socket event handlers as needed

  disconnect: () => {
    socket.disconnect();
  },
};

export default SocketService;
