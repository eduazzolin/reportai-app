import React, {useContext} from "react";
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom'
import Home from "../views/home";
import VerRegistro from "../views/verRegistro";
import CadastrarRegistro from "../views/cadastrarRegistro";
import AppNavbar from "../components/navbar";
import Sandbox from "../views/sandbox";
import CadastrarUsuario from "../views/cadastrarUsuario";
import MinhaConta from "../views/minhaConta";
import EntrarUsuario from "../views/entrarUsuario";
import {AuthContext} from "./provedorAutenticacao";

const PrivateRoute = ({isUsuarioAutenticado, element}) => {
  return isUsuarioAutenticado ? element : <Navigate to="/login"/>;
}

function Rotas() {

  const authContext = useContext(AuthContext);
  const {isAutenticado} = authContext;

  return (
    <Router>
      <div>
        <AppNavbar/>
        <Routes>
          <Route path="/" element={<Navigate to="/home"/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/cadastrar-registro" element={<PrivateRoute isUsuarioAutenticado={isAutenticado} element={<CadastrarRegistro/>}/>}/>
          <Route path="/minha-conta" element={<PrivateRoute isUsuarioAutenticado={isAutenticado} element={<MinhaConta/>}/>}/>
          <Route path="/registro/:id" element={<VerRegistro/>}/>
          <Route path="/sandbox" element={<Sandbox/>}/>
          <Route path="/cadastrar-usuario" element={<CadastrarUsuario/>}/>
          <Route path="/login" element={<EntrarUsuario/>}/>
        </Routes>
      </div>
    </Router>)
}

export default Rotas;