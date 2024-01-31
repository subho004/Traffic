import React, { useState } from "react";
import "./CreateNodeForm.scss";

interface CreateNodeFormProps {
  onSubmit: (nodeInfo: NodeFormData) => void;
  onCancel: () => void;
}

export interface NodeFormData {
  name: string;
  streetAddress: string;
  latitude: string;
  longitude: string;
  functional: boolean;
}

const CreateNodeForm: React.FC<CreateNodeFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [nodeInfo, setNodeInfo] = useState<NodeFormData>({
    name: "",
    streetAddress: "",
    latitude: "",
    longitude: "",
    functional: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNodeInfo((prevNodeInfo) => ({ ...prevNodeInfo, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(nodeInfo);
  };

  return (
    <div className="create-node-form-container">
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={nodeInfo.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Street Address:
          <input
            type="text"
            name="streetAddress"
            value={nodeInfo.streetAddress}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Latitude:
          <input
            type="text"
            name="latitude"
            value={nodeInfo.latitude}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Longitude:
          <input
            type="text"
            name="longitude"
            value={nodeInfo.longitude}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Functional:
          <input
            type="checkbox"
            name="functional"
            checked={nodeInfo.functional}
            onChange={() =>
              setNodeInfo((prevNodeInfo) => ({
                ...prevNodeInfo,
                functional: !prevNodeInfo.functional,
              }))
            }
          />
        </label>
        <div className="form-buttons">
          <button type="submit">Submit</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNodeForm;
