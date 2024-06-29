import React from "react";
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom'
import Home from "../views/home";


function Rotas() {

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/home" element={<Home/>}/>
          <Route path="/" element={<Navigate to="/home"/>}/>
        </Routes>
      </div>
    </Router>)
}

export default Rotas;