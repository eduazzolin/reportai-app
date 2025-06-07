import React, {useContext} from "react";
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom'
import Home from "../views/home";
import VerRegistro from "../views/verRegistro";
import CadastrarRegistro from "../views/cadastrarRegistro";
import AppNavbar from "../components/navbar";
import CadastrarUsuario from "../views/cadastrarUsuario";
import MinhaConta from "../views/minhaConta";
import EntrarUsuario from "../views/entrarUsuario";
import {AuthContext} from "./provedorAutenticacao";
import MeusRegistros from "../views/meusRegistros";
import AdminUsuarios from "../views/adminUsuarios";
import {AdminRegistros} from "../views/adminRegistros";
import RelatoriosPublicos from "../views/relatoriosPublicos";
import Sobre from "../views/sobre";
import RedefinirSenha from "../views/redefinirSenha";

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

          {/*------------------------------ rotas abertas ------------------------------*/}
          <Route path="/" element={<Navigate to="/home"/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/sobre" element={<Sobre/>}/>
          <Route path="/registro/:id" element={<VerRegistro/>}/>
          <Route path="/relatorios" element={<RelatoriosPublicos/>}/>
          <Route path="/cadastrar-usuario" element={<CadastrarUsuario/>}/>
          <Route path="/login" element={<EntrarUsuario/>}/>
          <Route path="/redefinir-senha" element={<RedefinirSenha/>}/>

          {/*------------------------------ rotas privadas ------------------------------*/}
          <Route path="/cadastrar-registro" element={<PrivateRoute isUsuarioAutenticado={isAutenticado} element={<CadastrarRegistro/>}/>}/>
          <Route path="/meus-registros" element={<PrivateRoute isUsuarioAutenticado={isAutenticado} element={<MeusRegistros/>}/>}/>
          <Route path="/minha-conta" element={<PrivateRoute isUsuarioAutenticado={isAutenticado} element={<MinhaConta/>}/>}/>

          {/*------------------------------ rotas admin --------------------------------*/}
          <Route path="/admin/usuarios" element={<PrivateRoute isUsuarioAutenticado={isAutenticado} element={<AdminUsuarios/>}/>}/>
          <Route path="/admin/registros" element={<PrivateRoute isUsuarioAutenticado={isAutenticado} element={<AdminRegistros/>}/>}/>

        </Routes>
      </div>
    </Router>)
}

export default Rotas;