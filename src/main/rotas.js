import React from "react";
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom'
import Home from "../views/home";
import DetalhesRegistro from "../views/detalhesRegistro";
import NovoRegistro from "../views/novoRegistro";
import AppNavbar from "../components/navbar";
import Sandbox from "../views/sandbox";
import 'toastr/build/toastr.min.css';

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
          <Route path="/sandbox" element={<Sandbox />} />
        </Routes>
      </div>
    </Router>)
}

export default Rotas;