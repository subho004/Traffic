import React, { useState } from "react";
import "./UpdateNodeForm.scss";
import { NodeFormData } from "./CreateNodeForm";

interface UpdateNodeFormProps {
  onSubmit: (nodeName: string, newNodeData?: NodeFormData) => void;
  onCancel: () => void;
}

const UpdateNodeForm: React.FC<UpdateNodeFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [nodeName, setNodeName] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(nodeName);
  };

  return (
    <div className="update-node-form-container">
      <form onSubmit={handleSubmit}>
        <label>
          Node Name to Update:
          <input
            type="text"
            name="nodeName"
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            required
          />
        </label>
        <div className="form-buttons">
          <button type="submit">Update</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateNodeForm;
