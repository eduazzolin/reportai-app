import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import {Link, NavLink, useLocation, useNavigate} from 'react-router-dom';
import {useContext} from "react";
import {AuthContext} from "../main/provedorAutenticacao";
import {Button} from "react-bootstrap";

function AppNavbar() {

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (

    <Navbar expand="md" className="bg-body-tertiary no-print">
      <Container>

        {/*  --------------------- logo --------------------------*/}
        <Navbar.Brand as={Link} to="/home">
          <img
            src="https://storage.googleapis.com/reportai/resources/logo.png"
            height="30"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">

          {/*  --------------------- links --------------------------*/}
          {isAdminPage ? (
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/admin/usuarios">Usuários</Nav.Link>
              <Nav.Link as={NavLink} to="/admin/registros">Registros</Nav.Link>
            </Nav>
          ) : (
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/home">Home</Nav.Link>
              <Nav.Link as={NavLink} to="/cadastrar-registro">Novo Registro</Nav.Link>
              <Nav.Link as={NavLink} to="/relatorios">Relatórios Públicos</Nav.Link>
              <Nav.Link as={NavLink} to="/sobre">Sobre</Nav.Link>
            </Nav>
          )}


         {!isAdminPage && authContext.isAdmin && (
            <Button variant="warning" onClick={() => navigate("/admin/usuarios")}>ADMIN</Button>
          )}


          {/*  --------------------- usuario --------------------------*/}
          <Nav className="ml-auto" hidden={authContext.isAutenticado}>
            <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
          </Nav>

          <Nav className="ml-auto" hidden={!authContext.isAutenticado}>
            <Dropdown align="end">
              <Dropdown.Toggle variant="gray" id="dropdown-basic" className="d-flex align-items-center gap-3">
                <span>{authContext.usuarioAutenticado?.nome ?? ''}</span>
                <img
                  src="/nav_user.png"
                  height="30"
                  width="30"
                  className="d-inline-block align-top"
                  alt="React Bootstrap logo"
                />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as={NavLink} to="/minha-conta">Minha Conta</Dropdown.Item>
                {!isAdminPage ?
                  <Dropdown.Item as={NavLink} to="/meus-registros">Meus Registros</Dropdown.Item>
                  :
                  <></>
                }
                <Dropdown.Item as={NavLink} onClick={authContext.encerrarSessao} to="/">Sair</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>

        </Navbar.Collapse>

      </Container>
    </Navbar>
  )
    ;
}

export default AppNavbar;
