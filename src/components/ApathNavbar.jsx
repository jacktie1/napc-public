import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { UserContext } from '../auth/UserSession';
import { useNavigate, useLocation } from 'react-router-dom';

function ApathNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeKey = location.pathname === '/volunteer/home' ? '/volunteer/airport-pickup-needs' : location.pathname

  const { fullName, isAdmin, isStudent, isVolunteer, endSession } = useContext(UserContext);

  const handleLogout = () => {
      alert("You've logged out");
      endSession();
      navigate('/login');
  };

  if (isVolunteer) {
    return (
      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" bg="light" data-bs-theme="light">
        <Container>
          <Navbar.Brand href="/volunteer/home">APATH - International</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto" variant="underline" activeKey={activeKey}>
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
                <NavDropdown.Item href="/volunteer/account">Account Settings</NavDropdown.Item>
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
  } else if (isStudent) {
    return (
      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" bg="light" data-bs-theme="light">
        <Container>
          <Navbar.Brand href="/student/home">APATH - International</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto" variant='underline' activeKey={activeKey}>
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
                <NavDropdown.Item href="/student/account">Account Settings</NavDropdown.Item>
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
  } else if (isAdmin) {
    return (
      <Navbar collapseOnSelect expand="xl" className="bg-body-tertiary" bg="light" data-bs-theme="light">
        <Container>
          <Navbar.Brand href="/admin/home">APATH - International</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto" variant="underline" activeKey={activeKey}>
              <Nav.Item>
                <Nav.Link href="/admin/manage-announcement">Announcement</Nav.Link>
              </Nav.Item>
              <NavDropdown title='User Management' id="collapsible-nav-dropdown-1">
                <NavDropdown.Item href="/admin/manage-students">Manage Students</NavDropdown.Item>
                <NavDropdown.Item href="/admin/manage-volunteers">Manage Volunteers</NavDropdown.Item>
                <NavDropdown.Item href="/admin/export-students">Export Students</NavDropdown.Item>
                <NavDropdown.Item href="/admin/export-volunteers">Export Volunteers</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title='Airport Pickups' id="collapsible-nav-dropdown-2">
                <NavDropdown.Item href="/admin/airport-pickup-students">Student Pickup</NavDropdown.Item>
                <NavDropdown.Item href="/admin/airport-pickup-volunteers">Pickup Volunteers</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title='Temporary Housings' id="collapsible-nav-dropdown-3">
                <NavDropdown.Item href="/admin/temp-housing-students">Student Housing</NavDropdown.Item>
                <NavDropdown.Item href="/admin/temp-housing-volunteers">Housing Volunteers</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              <Navbar.Text>
                Signed in as:
              </Navbar.Text>
              <NavDropdown title={fullName} id="collapsible-nav-dropdown-4">
                <NavDropdown.Item href="/admin/account">Account Settings</NavDropdown.Item>
                <NavDropdown.Item href="/admin/profile">Edit Profile</NavDropdown.Item>
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

  } else {
    return null;
  }
}

export default ApathNavbar;