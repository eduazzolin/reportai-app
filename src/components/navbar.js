import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import {Link, NavLink} from 'react-router-dom';
import {useContext} from "react";
import {AuthContext} from "../main/provedorAutenticacao";

function AppNavbar() {

  const authContext = useContext(AuthContext);

  return (

    <Navbar expand="md" className="bg-body-tertiary">
      <Container>

        {/*logo*/}
        <Navbar.Brand as={Link} to="/home">
          <img
            src="/logo.png"
            height="30"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
          />
        </Navbar.Brand>


        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">

          {/*links*/}
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/home">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/cadastrar-registro">Novo Registro</Nav.Link>
            <Nav.Link as={NavLink} to="/relatorios">Relatórios Públicos</Nav.Link>
            <Nav.Link as={NavLink} to="/sobre">Sobre</Nav.Link>
          </Nav>


          {/*usuário*/}
          <Nav className="ml-auto" hidden={authContext.isAutenticado}>
            <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
          </Nav>

          <Nav className="ml-auto" hidden={!authContext.isAutenticado}>
            <Dropdown align="end">
              <Dropdown.Toggle variant="gray" id="dropdown-basic" className="d-flex align-items-center gap-3">
                <span>Eduardo</span>
                <img
                  src="/nav_user.png"
                  height="30"
                  width="30"
                  className="d-inline-block align-top"
                  alt="React Bootstrap logo"
                />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as={NavLink} to="/meus-relatorios">Meus Relatórios</Dropdown.Item>
                <Dropdown.Item as={NavLink} onClick={authContext.encerrarSessao} to="/">Sair</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>

        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
}

export default AppNavbar;
