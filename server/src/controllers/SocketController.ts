import { Server, Socket } from "socket.io";
import NodeDAO from "../dataAccess/NodeDAO";
import { Node } from "../models/Node";

const SocketController =
  (io: Server) =>
  (socket: Socket): void => {
    console.log("Client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });

    socket.on("nodeAdded", async (newNode: Node) => {
      try {
        const addedNode = await NodeDAO.addNode(newNode);

        io.emit("nodeAdded", addedNode);
      } catch (error) {
        console.error("Error adding node:", error);
      }
    });

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
          const updatedNode = await NodeDAO.updateNode(nodeName);

          io.emit("nodeUpdated", updatedNode);

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
