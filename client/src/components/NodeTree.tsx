import React, { useEffect, useState } from "react";
import Tree, { TreeNodeDatum } from "react-d3-tree";
import NodeApiService from "../services/NodeApiService";
import { NodeDocument } from "../interfaces/Node";
import CreateNodeForm, { NodeFormData } from "./CreateNodeForm";
import "./NodeTree.scss";
import NodeDetails from "./NodeDetails";

interface TreeNode {
  name: string;
  attributes?: {
    streetAddress?: string;
    functional?: string;
    latitude?: string;
    longitude?: string;
  };
  children?: TreeNode[];
  [key: string]: any;
}

interface NodeTreeProps {}

const NodeTree: React.FC<NodeTreeProps> = () => {
  const [treeData, setTreeData] = useState<TreeNode | null>(null);
  const [isFormVisible, setFormVisible] = useState(false);
  const [isDetailsVisible, setDetailsVisible] = useState(false);
  const [selectedNodeDetails, setSelectedNodeDetails] = useState<{
    name: string;
    streetAddress: string;
    latitude: string;
    longitude: string;
    functional: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const nodes = await NodeApiService.getAllNodes();
        console.log(nodes);

        const mappedTreeData = generateTree(nodes);

        setTreeData(mappedTreeData);
      } catch (error) {
        console.error("Error fetching nodes:", error);
      }
    };

    fetchData();
  }, []);

  const generateTree = (nodes: NodeDocument[]): TreeNode | null => {
    const rootNode = nodes.find((node) => node.name === 1);

    if (!rootNode) {
      return null;
    }

    const mapChildren = (parentNode: NodeDocument): TreeNode[] => {
      return parentNode.children.map((childName) => {
        const childNode = nodes.find((node) => node.name === childName);
        return {
          name: `${childNode?.name}`,
          attributes: {
            streetAddress: childNode?.streetAddress || "",
            functional: childNode?.functional ? "Functional" : "Non-Functional",
          },
          children: mapChildren(childNode || ({} as NodeDocument)),
          className: childNode?.functional ? "node__green" : "node__red",
        };
      });
    };

    return {
      name: `${rootNode.name}`,
      attributes: {
        streetAddress: rootNode.streetAddress,
        functional: rootNode.functional ? "Functional" : "Non-Functional",
        latitude: String(rootNode.latitude || ""),
        longitude: String(rootNode.longitude || ""),
      },

      children: mapChildren(rootNode),
      className: rootNode.functional ? "node__green" : "node__red",
    };
  };

  const handleFormSubmit = async (nodeInfo: NodeFormData) => {
    try {
      const newNodeData = {
        name: parseInt(nodeInfo.name),
        streetAddress: nodeInfo.streetAddress,
        latitude: parseFloat(nodeInfo.latitude),
        longitude: parseFloat(nodeInfo.longitude),
        functional: nodeInfo.functional,
      };

      await NodeApiService.addNode(newNodeData);

      const updatedNodes = await NodeApiService.getAllNodes();

      const updatedTreeData = generateTree(updatedNodes);
      setTreeData(updatedTreeData);

      setFormVisible(false);
    } catch (error) {
      console.error("Error submitting node:", error);
    }
  };

  const handleFormCancel = () => {
    setFormVisible(!isFormVisible);
  };

  const handleCreateButtonClick = () => {
    setFormVisible(!isFormVisible);
    console.log(isFormVisible);
  };
  const handleNodeClick = (clickedNode: any, treeData: TreeNode) => {
    const { name, attributes } = clickedNode;
    setSelectedNodeDetails({
      name: treeData.name,
      streetAddress: treeData.attributes?.streetAddress || "",
      latitude: treeData.attributes?.latitude || "",
      longitude: treeData.attributes?.longitude || "",
      functional: treeData.attributes?.functional || "",
    });

    setDetailsVisible(!isDetailsVisible);
  };
  console.log("treeData:", treeData);

  return (
    <>
      <div className="node-tree-container">
        <button onClick={handleCreateButtonClick}>Create</button>

        {treeData && (
          <Tree
            data={treeData}
            orientation="vertical"
            collapsible={false}
            onNodeClick={(node) => handleNodeClick(node, treeData)}
          />
        )}
      </div>
      <div>
        {isFormVisible && (
          <CreateNodeForm
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        )}
        {/* {selectedNodeDetails && (
          <NodeDetails
            isOpen={isDetailsVisible}
            onClose={() => setDetailsVisible(false)}
            nodeDetails={selectedNodeDetails}
            modalId={selectedNodeDetails?.name ?? ""} 
          />
        )} */}
      </div>
    </>
  );
};

export default NodeTree;
