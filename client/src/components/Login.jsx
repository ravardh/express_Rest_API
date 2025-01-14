import React, { useState } from "react";
import axios from "../axiosInstance";
import { Alert, Form, Button } from "react-bootstrap";

const Login = ({ setToken }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/user/login", formData);
      setToken(response.data.token);
      setMessage("Login Sucessfull");
      setFormData({
        email: "",
        password: "",
      });
    } catch (error) {
      setMessage(error.response.data.Message || "Login Failed");
    }
  };

  return (
    <>
      <div className="container mt-4 forms">
        <h2>Login</h2>
        {message && <Alert variant="info">{message}</Alert>}

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your Email"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your Password"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Login
          </Button>
        </Form>
      </div>
    </>
  );
};

export default Login;
