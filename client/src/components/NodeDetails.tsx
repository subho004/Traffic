import React from "react";
import Modal from "react-modal";

interface NodeDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  nodeDetails: {
    name: string;
    streetAddress: string;
    latitude: string;
    longitude: string;
    functional: string;
  } | null;
  modalId: string;
}

const NodeDetails: React.FC<NodeDetailsProps> = ({
  isOpen,
  onClose,
  nodeDetails,
  modalId,
}) => {
  function handleDelete(): void {
    console.log("clicked");
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Node Details"
      id={modalId}
    >
      <h2>Node Details</h2>
      {nodeDetails ? (
        <div>
          <p>Name: {nodeDetails.name}</p>
          <p>Street Address: {nodeDetails.streetAddress}</p>
          <p>Latitude: {nodeDetails.latitude}</p>
          <p>Longitude: {nodeDetails.longitude}</p>
          <p>Functional: {nodeDetails.functional}</p>
        </div>
      ) : (
        <p>No details available</p>
      )}
      <button onClick={onClose}>Close</button>
      <button onClick={handleDelete}>Delete</button>
    </Modal>
  );
};

export default NodeDetails;
