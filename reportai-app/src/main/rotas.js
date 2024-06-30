import React from "react";
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom'
import Home from "../views/home";
import AppNavbar from "../components/navbar";


function Rotas() {

  return (
    <Router>
      <div>
        <AppNavbar/>
        <Routes>
          <Route path="/home" element={<Home/>}/>
          <Route path="/" element={<Navigate to="/home"/>}/>
        </Routes>
      </div>
    </Router>)
}

export default Rotas;