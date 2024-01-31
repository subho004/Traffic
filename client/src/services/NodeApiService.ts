// src/services/NodeApiService.ts

import axios from "axios";
import { NodeDocument } from "../interfaces/Node";

const BASE_URL = "http://localhost:8000/api";

const NodeApiService = {
  getAllNodes: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/nodes`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  addNode: async (newNodeData: any) => {
    try {
      if (typeof newNodeData !== "object" || newNodeData === null) {
        throw new Error("Invalid node data format");
      }

      const response = await axios.post(`${BASE_URL}/nodes`, newNodeData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateNode: async (nodeName: number) => {
    try {
      const response = await axios.put(`${BASE_URL}/nodes/${nodeName}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  serializeNode: (node: NodeDocument) => {
    return node.toObject();
  },
};

export default NodeApiService;
