import React, { useState } from "react";
import "./App.css";
import AddUser from "./components/AddUser";
import Login from "./components/Login";
import ViewUser from "./components/ViewUser";
import UpdateName from "./components/UpdateName";

function App() {
  const [token, setToken] = useState(null);
  return (
    <>
      <AddUser />

      <Login setToken={setToken} />
      <ViewUser token={token} />
      <UpdateName token={token} />
    </>
  );
}

export default App;
