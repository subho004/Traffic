import mongoose, { Schema, Document } from "mongoose";

export interface Node {
  name: number;
  streetAddress: string;
  latitude: number;
  longitude: number;
  functional: boolean;
  parent: number | null;
  children: number[];
}

export interface NodeDocument extends Omit<Node, "id">, Document {}

const nodeSchema = new Schema<NodeDocument>(
  {
    name: {
      type: Number,
      required: true,
    },
    streetAddress: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    functional: {
      type: Boolean,
      default: true,
    },
    parent: {
      type: Number,
      default: null,
    },
    children: {
      type: [Number],
      default: [],
    },
  },
  { timestamps: true }
);

const NodeModel = mongoose.model<NodeDocument>("Node", nodeSchema);

export default NodeModel;
