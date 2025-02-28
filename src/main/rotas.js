import React from "react";
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom'
import Home from "../views/home";
import VerRegistro from "../views/verRegistro";
import CadastrarRegistro from "../views/cadastrarRegistro";
import AppNavbar from "../components/navbar";
import Sandbox from "../views/sandbox";
import 'toastr/build/toastr.min.css';
import CadastrarUsuario from "../views/cadastrarUsuario";

function Rotas() {

  return (
    <Router>
      <div>
        <AppNavbar/>
        <Routes>
          <Route path="/" element={<Navigate to="/home"/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/cadastrar-registro" element={<CadastrarRegistro/>}/>
          <Route path="/registro/:id" element={<VerRegistro />} />
          <Route path="/sandbox" element={<Sandbox />} />
          <Route path="/cadastrar-usuario" element={<CadastrarUsuario />} />
        </Routes>
      </div>
    </Router>)
}

export default Rotas;