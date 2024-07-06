import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function AppNavbar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary" >
      <Container>
        <Navbar.Brand href="#home">
          <img
            src="/logo.png"
            height="30"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#meus-registros">Meus Registros</Nav.Link>
            <Nav.Link href="#relatorios">Relatórios Públicos</Nav.Link>
            <Nav.Link href="#sobre">Sobre</Nav.Link>
          </Nav>
          <Nav className="ml-auto">
            <div className="d-flex align-items-center gap-3">
              <span>Eduardo</span>
              <img
                src="/nav_user.png"
                height="30"
                width="30"
                className="d-inline-block align-top"
                alt="React Bootstrap logo"
              />
              <Nav.Link href="#sair">Sair</Nav.Link>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;