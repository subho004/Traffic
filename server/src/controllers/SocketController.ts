// src/controllers/SocketController.ts

import { Server, Socket } from "socket.io";
import NodeDAO from "../dataAccess/NodeDAO";
import { Node } from "../models/Node";

const SocketController =
  (io: Server) =>
  (socket: Socket): void => {
    console.log("Client connected:", socket.id);

    // You can handle various socket events here
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });

    // Handle node added event
    socket.on("nodeAdded", async (newNode: Node) => {
      try {
        // Add the new node to the database using NodeDAO
        const addedNode = await NodeDAO.addNode(newNode);

        // Emit the added node to all connected clients
        io.emit("nodeAdded", addedNode);
      } catch (error) {
        console.error("Error adding node:", error);
      }
    });

    // Handle update node event
    socket.on(
      "updateNode",
      async ({
        nodeName,
        newFunctionalValue,
      }: {
        nodeName: number;
        newFunctionalValue: boolean;
      }) => {
        try {
          // Update the node in the database using NodeDAO
          const updatedNode = await NodeDAO.updateNode(nodeName);

          // Emit the updated node to all connected clients
          io.emit("nodeUpdated", updatedNode);

          // If the node has children, update their functional values recursively
          if (
            updatedNode?.children.length &&
            updatedNode?.children.length > 0
          ) {
            await NodeDAO.updateChildrenFunctionalValue(updatedNode.children);
          }
        } catch (error) {
          console.error("Error updating node:", error);
        }
      }
    );
  };

export default SocketController;
