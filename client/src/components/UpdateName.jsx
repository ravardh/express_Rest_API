import React, { useState } from "react";
import axios from "../axiosInstance";
import { Alert, Form, Button } from "react-bootstrap";

const UpdateName = ({ token }) => {
  const [newName, setNewName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmitName = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "/user/update-name",
        { newName },
        {
          headers: { authorization: `Bearer ${token}` },
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.Message || "Error Updating name");
    }
  };

  return (
    <>
      <div className="container mt-4 forms">
        <h2>Add User</h2>
        {message && <Alert variant="info">{message}</Alert>}

        <Form onSubmit={handleSubmitName}>
          <Form.Group className="mb-3">
            <Form.Label>New Name</Form.Label>
            <Form.Control
              type="text"
              name="newName"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter you New Name"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Update Name
          </Button>
        </Form>
      </div>
    </>
  );
};

export default UpdateName;
