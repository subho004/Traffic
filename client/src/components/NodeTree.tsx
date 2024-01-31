import React, { useEffect, useState } from "react";
import Tree, { TreeNodeDatum } from "react-d3-tree";
import NodeApiService from "../services/NodeApiService";
import { NodeDocument } from "../interfaces/Node";
import CreateNodeForm, { NodeFormData } from "./CreateNodeForm"; // Import the CreateNodeForm component
import "./NodeTree.scss"; // Import the styles
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
        // Fetch nodes from the API using NodeApiService
        const nodes = await NodeApiService.getAllNodes();
        console.log(nodes);

        // Map nodes to the tree data structure
        const mappedTreeData = generateTree(nodes);

        // Set the tree data state
        setTreeData(mappedTreeData);
      } catch (error) {
        console.error("Error fetching nodes:", error);
      }
    };

    fetchData();
  }, []);

  const generateTree = (nodes: NodeDocument[]): TreeNode | null => {
    // Find the node with name equal to 1
    const rootNode = nodes.find((node) => node.name === 1);

    if (!rootNode) {
      // If no node with name 1 is found, return null
      return null;
    }

    // Function to recursively map children nodes
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
        // Adjust class name based on 'isFunctional'
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
      // Convert NodeFormData to a format accepted by the API
      const newNodeData = {
        name: parseInt(nodeInfo.name),
        streetAddress: nodeInfo.streetAddress,
        latitude: parseFloat(nodeInfo.latitude),
        longitude: parseFloat(nodeInfo.longitude),
        functional: nodeInfo.functional,
      };

      // Make an API call to submit the form data to the database
      await NodeApiService.addNode(newNodeData);

      // Fetch updated nodes from the API
      const updatedNodes = await NodeApiService.getAllNodes();

      // Update the tree data
      const updatedTreeData = generateTree(updatedNodes);
      setTreeData(updatedTreeData);

      // Hide the form after successful submission
      setFormVisible(false);
    } catch (error) {
      console.error("Error submitting node:", error);
    }
  };

  const handleFormCancel = () => {
    // Close the form
    setFormVisible(!isFormVisible);
  };

  const handleCreateButtonClick = () => {
    // Show the form when the Create button is clicked
    setFormVisible(!isFormVisible);
    console.log(isFormVisible);
  };
  const handleNodeClick = (clickedNode: any, treeData: TreeNode) => {
    // Extract relevant details from the clicked node
    const { name, attributes } = clickedNode;
    setSelectedNodeDetails({
      name: treeData.name,
      streetAddress: treeData.attributes?.streetAddress || "",
      latitude: treeData.attributes?.latitude || "",
      longitude: treeData.attributes?.longitude || "",
      functional: treeData.attributes?.functional || "",
    });

    // Show the NodeDetails modal
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
