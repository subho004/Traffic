// src/routes/api.ts

import express, { Request, Response, NextFunction } from "express";
import NodeDAO from "../dataAccess/NodeDAO";
import { io } from "../app"; // Import io

const router = express.Router();

// Get all nodes
router.get(
  "/nodes",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nodes = await NodeDAO.getAllNodes();
      res.json(nodes);
    } catch (error) {
      next(error); // Pass the error to the next middleware
    }
  }
);

// Add a new node
router.post(
  "/nodes",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newNode = req.body;
      const addedNode = await NodeDAO.addNode(newNode);

      // Emit a socket event to notify clients about the new node
      io.emit("nodeAdded", addedNode);

      res.json(addedNode);
    } catch (error) {
      next(error); // Pass the error to the next middleware
    }
  }
);

// Update a node
router.put(
  "/nodes/:name",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nodeName = parseInt(req.params.name, 10); // Parse the name as a number
      const update = req.body;
      const updatedNode = await NodeDAO.updateNode(nodeName);

      if (!updatedNode) {
        res.status(404).json({ error: "Node not found" });
      } else {
        // Emit a socket event to notify clients about the updated node
        io.emit("nodeUpdated", updatedNode);

        res.json(updatedNode);
      }
    } catch (error) {
      next(error); // Pass the error to the next middleware
    }
  }
);

// Additional API routes as needed

export default router;
