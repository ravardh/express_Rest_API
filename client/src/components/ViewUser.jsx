import React, { useEffect, useState } from "react";
import axios from "../axiosInstance";
import { Alert, Table } from "react-bootstrap";

const ViewUser = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/user/view", {
          headers: { authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        if (response.data.length > 0) {
          setMessage("");
        }
      } catch (error) {
        setMessage(error.response.data.Message || "Error Fetching Users");
      }
    };

    fetchUsers();
  }, [token]);

  console.log(token);
  console.log(users);
  return (
    <>
      <div className="container mt-4">
        <h2>View User</h2>

        {message && <Alert variant="danger">{message}</Alert>}

        <Table bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              return (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default ViewUser;
