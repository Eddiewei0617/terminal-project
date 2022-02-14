import React from "react";
import { Routes, Route } from "react-router-dom";
import HomeComponent from "./components/Home-component";
import NavComponent from "./components/Nav-component";
import RegisterComponent from "./components/Register-component";
import LoginComponent from "./components/Login-component";

function App() {
  return (
    <div>
      <NavComponent />
      <Routes>
        <Route path="/" element={<HomeComponent />} exact></Route>
      </Routes>
      <Routes>
        <Route path="/register" element={<RegisterComponent />} exact></Route>
      </Routes>
      <Routes>
        <Route path="/login" element={<LoginComponent />} exact></Route>
      </Routes>
    </div>
  );
}

export default App;
