import React, { useRef, useEffect, useState } from "react";
import Tree, { TreeProps } from "react-d3-tree";

interface ClickableTreeProps extends TreeProps {
  onClick: (nodeDetails: any) => void;
}

const ClickableTree: React.FC<ClickableTreeProps> = ({
  data,
  onClick,
  ...rest
}) => {
  const treeRef = useRef<any>();
  const [selectedNode, setSelectedNode] = useState<any>(null);

  useEffect(() => {
    const svg = treeRef.current && treeRef.current.containerSelection;
    if (svg) {
      svg.selectAll("g.node").on("click", (node: any) => {
        onClick(node.data);
        setSelectedNode(node.data);
      });
    }
  }, [onClick]);

  return (
    <>
      <Tree data={data} ref={treeRef} {...rest} />
      {selectedNode && (
        <div className="node-details-container">
          {/* Render details for the selected node */}
          {/* You can use {selectedNode.name}, {selectedNode.streetAddress}, etc. */}
          {/* Add your own styling and content here */}
          Node Details: {JSON.stringify(selectedNode)}
        </div>
      )}
    </>
  );
};

export default ClickableTree;
