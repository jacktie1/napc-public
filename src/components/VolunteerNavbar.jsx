import React, { useContext, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { UserContext } from '../auth/UserSession';
import { useNavigate, useLocation } from 'react-router-dom';

function VolunteerNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeKey = location.pathname === '/volunteer/home' ? '/volunteer/airport-pickup-needs' : location.pathname

  const { fullName, endSession } = useContext(UserContext);

  const handleLogout = () => {
      alert("You've logged out");
      endSession();
      navigate('/login');
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" bg="light" data-bs-theme="light">
      <Container>
        <Navbar.Brand href="/volunteer/home">APATH - International</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto" variant="underline" activeKey={activeKey}>
            <Nav.Item>
              <Nav.Link href="/volunteer/home">Home</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/volunteer/airport-pickup-needs">Airport Pickup Needs</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/volunteer/airport-pickup-assignment">Airport Pickup Assignment</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/volunteer/temp-housing-assignment">Temporary Housing Assignment</Nav.Link>
            </Nav.Item>
          </Nav>
          <Nav>
            <Navbar.Text>
              Signed in as:
            </Navbar.Text>
            <NavDropdown title={fullName} id="collapsible-nav-dropdown">
              <NavDropdown.Item href="/volunteer/profile">Edit Account Profile</NavDropdown.Item>
              <NavDropdown.Item href="/volunteer/airport-pickup">Airport Pickup Profile</NavDropdown.Item>
              <NavDropdown.Item href="/volunteer/temp-housing">Temporary Housing Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default VolunteerNavbar;