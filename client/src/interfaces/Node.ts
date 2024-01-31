import { Document } from "mongoose";

export interface Node {
  name: number;
  streetAddress: string;
  latitude: number;
  longitude: number;
  functional: boolean;
  parent: number | null;
  children: number[];
}

export interface NodeDocument extends Node, Document {}
