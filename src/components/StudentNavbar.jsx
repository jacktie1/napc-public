import React, { useContext, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { UserContext } from '../auth/UserSession';
import { useNavigate, useLocation } from 'react-router-dom';

function StudentNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeKey = location.pathname === '/student/home' ? '/student/airport-pickup-assignment' : location.pathname

  const { fullName, endSession } = useContext(UserContext);

  const handleLogout = () => {
      alert("You've logged out");
      endSession();
      navigate('/login');
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" bg="light" data-bs-theme="light">
      <Container>
        <Navbar.Brand href="/student/home">APATH - International</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto" variant='underline' activeKey={activeKey}>
            <Nav.Item>
              <Nav.Link href="/student/home">Home</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/student/airport-pickup-assignment">Airport Pickup Assignment</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/student/temp-housing-assignment">Temporary Housing Assignment</Nav.Link>
            </Nav.Item>
          </Nav>
          <Nav>
            <Navbar.Text>
              Signed in as:
            </Navbar.Text>
            <NavDropdown title={fullName} id="collapsible-nav-dropdown">
              <NavDropdown.Item href="/student/profile">Edit Profile</NavDropdown.Item>
              <NavDropdown.Item href="/student/flight-info">Update Flight Information</NavDropdown.Item>
              <NavDropdown.Item href="/student/temp-housing">Update Temporary Housing</NavDropdown.Item>
              <NavDropdown.Item href="/student/comment">Comment For Admin</NavDropdown.Item>
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

export default StudentNavbar;