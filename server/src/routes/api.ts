import express, { Request, Response, NextFunction } from "express";
import NodeDAO from "../dataAccess/NodeDAO";
import { io } from "../app";

const router = express.Router();

router.get(
  "/nodes",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nodes = await NodeDAO.getAllNodes();
      res.json(nodes);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/nodes",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newNode = req.body;
      const addedNode = await NodeDAO.addNode(newNode);

      io.emit("nodeAdded", addedNode);

      res.json(addedNode);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/nodes/:name",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nodeName = parseInt(req.params.name, 10);
      const update = req.body;
      const updatedNode = await NodeDAO.updateNode(nodeName);

      if (!updatedNode) {
        res.status(404).json({ error: "Node not found" });
      } else {
        io.emit("nodeUpdated", updatedNode);

        res.json(updatedNode);
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
