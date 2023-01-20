import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Campaigner from "./Page/Campaigner";
import Dashboard from "./Page/Dashboard";
import Login from "./Page/Login";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/campaigner" element={<Campaigner />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
