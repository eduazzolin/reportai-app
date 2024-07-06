import React from "react";
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom'
import Home from "../views/home";
import NovoRegistro from "../views/novoRegistro";
import AppNavbar from "../components/navbar";


function Rotas() {

  return (
    <Router>
      <div>
        <AppNavbar/>
        <Routes>
          <Route path="/" element={<Navigate to="/home"/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/novo-registro" element={<NovoRegistro/>}/>
        </Routes>
      </div>
    </Router>)
}

export default Rotas;