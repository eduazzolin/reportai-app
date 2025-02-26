import React from "react";
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom'
import Home from "../views/home";
import DetalhesRegistro from "../views/detalhesRegistro";
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
          <Route path="/registro/:id" element={<DetalhesRegistro />} />
        </Routes>
      </div>
    </Router>)
}

export default Rotas;