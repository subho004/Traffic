// src/dataAccess/NodeDAO.ts

import mongoose from "mongoose";
import NodeModel, { NodeDocument, Node } from "../models/Node";

class NodeDAO {
  private static instance: NodeDAO;

  private constructor() {}
  private async findClosestParent(newNode: Node): Promise<NodeDocument | null> {
    try {
      const nodes = await NodeModel.find().exec();
      let closestParent: NodeDocument | null = null;
      let minDistance = Infinity;

      for (const node of nodes) {
        // Parent and child cannot have the same longitude
        if (node.longitude !== newNode.longitude && node.children.length < 2) {
          const distance = this.euclideanDistance(
            newNode.latitude,
            newNode.longitude,
            node.latitude,
            node.longitude
          );
          if (distance < minDistance) {
            closestParent = node as NodeDocument; // Cast node to NodeDocument
            minDistance = distance;
          }
        }
      }

      return closestParent;
    } catch (error) {
      throw new Error(`Error finding closest parent: ${error}`);
    }
  }

  private euclideanDistance(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  public async updateChildrenFunctionalValue(
    children: number[]
  ): Promise<void> {
    const queue: number[] = [...children];

    while (queue.length > 0) {
      const currentChildId = queue.shift();

      if (currentChildId) {
        const currentChild = await NodeModel.findById(currentChildId).exec();

        if (currentChild) {
          // Update the functional value
          currentChild.functional = !currentChild.functional;
          await currentChild.save();

          // Add current child's children to the queue
          queue.push(...currentChild.children);
        }
      }
    }
  }
  static getInstance(): NodeDAO {
    if (!NodeDAO.instance) {
      NodeDAO.instance = new NodeDAO();
    }
    return NodeDAO.instance;
  }

  async getAllNodes(): Promise<Node[]> {
    try {
      const nodes = await NodeModel.find().lean().exec();
      return nodes as Node[];
    } catch (error) {
      throw new Error(`Error fetching nodes: ${error}`);
    }
  }

  async addNode(node: Node): Promise<Node> {
    try {
      // If the database is not empty, get the last node and increment the name for the new node
      if ((await NodeModel.countDocuments({})) > 0) {
        const lastNode = await NodeModel.findOne()
          .sort({ name: -1 })
          .lean()
          .exec();
        if (lastNode) {
          node.name = lastNode.name + 1;
        }
      }

      // If the database is empty, set the parent to null
      if ((await NodeModel.countDocuments({})) === 0) {
        node.parent = null;
      } else {
        // If the database is not empty, find the nearest parent and update the children
        const closestParent = await this.findClosestParent(node);
        if (closestParent) {
          node.parent = closestParent.name;
          closestParent.children.push(node.name);
          await closestParent.save();
        }
      }

      // Create the new node in the database
      const createdNode = await NodeModel.create(node);
      return createdNode.toObject() as Node;
    } catch (error) {
      throw new Error(`Error adding node: ${error}`);
    }
  }

  async updateNode(nodeName: number): Promise<Node | null> {
    try {
      // Find the node by name
      const nodeToUpdate = await NodeModel.findOne({ name: nodeName }).exec();

      if (nodeToUpdate) {
        // Update the node itself
        nodeToUpdate.functional = !nodeToUpdate.functional;
        await nodeToUpdate.save();

        // If the node has children, update their functional values recursively
        // if (nodeToUpdate.children.length > 0) {
        //   const childIds = nodeToUpdate.children; // Convert child IDs to strings
        //   await this.updateChildrenFunctionalValue(childIds);
        // }

        return nodeToUpdate.toObject() as Node | null;
      } else {
        throw new Error(`Node with name ${nodeName} not found.`);
      }
    } catch (error) {
      throw new Error(`Error updating node: ${error}`);
    }
  }

  // Additional MongoDB operations as needed
}

export default NodeDAO.getInstance();
