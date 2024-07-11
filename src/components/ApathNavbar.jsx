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
            <Nav className="me-auto" activeKey={activeKey}>
              <Nav.Item>
                <Nav.Link href="/volunteer/airport-pickup-needs">Airport Pickup Needs</Nav.Link>
              </Nav.Item>
              <NavDropdown title='My Assignments' id="collapsible-nav-dropdown-1">
                <NavDropdown.Item href="/volunteer/airport-pickup-assignment">Airport Pickup Assignment</NavDropdown.Item>
                <NavDropdown.Item href="/volunteer/temp-housing-assignment">Temporary Housing Assignment</NavDropdown.Item>
              </NavDropdown>
              <Nav.Item>
                <Nav.Link href="/volunteer/airport-pickup">Airport Pickup Profile</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/volunteer/temp-housing">Temp Housing Profile</Nav.Link>
              </Nav.Item>
            </Nav>
            <Nav>
              <Navbar.Text>
                Signed in as:
              </Navbar.Text>
              <NavDropdown title={fullName} id="collapsible-nav-dropdown">
                <NavDropdown.Item href="/volunteer/account">Account Settings</NavDropdown.Item>
                <NavDropdown.Item href="/volunteer/profile">Edit Volunteer Profile</NavDropdown.Item>
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
            <Nav className="me-auto" activeKey={activeKey}>
            <NavDropdown title='My Assignments' id="collapsible-nav-dropdown-1">
                <NavDropdown.Item href="/student/airport-pickup-assignment">Airport Pickup Assignment</NavDropdown.Item>
                <NavDropdown.Item href="/student/temp-housing-assignment">Temporary Housing Assignment</NavDropdown.Item>
              </NavDropdown>
              <Nav.Item>
                <Nav.Link href="/student/flight-info">Flight Information</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/student/temp-housing">Temporary Housing</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/student/comment">Comment For Admin</Nav.Link>
              </Nav.Item>
            </Nav>
            <Nav>
              <Navbar.Text>
                Signed in as:
              </Navbar.Text>
              <NavDropdown title={fullName} id="collapsible-nav-dropdown">
                <NavDropdown.Item href="/student/account">Account Settings</NavDropdown.Item>
                <NavDropdown.Item href="/student/profile">Edit Student Profile</NavDropdown.Item>
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
            <Nav className="me-auto" activeKey={activeKey}>
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
                <NavDropdown.Item href="/admin/airport-pickup-students">View Students</NavDropdown.Item>
                <NavDropdown.Item href="/admin/airport-pickup-volunteers">View Volunteers</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title='Temporary Housings' id="collapsible-nav-dropdown-3">
                <NavDropdown.Item href="/admin/temp-housing-students">View Students</NavDropdown.Item>
                <NavDropdown.Item href="/admin/temp-housing-volunteers">View Volunteers</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              <Navbar.Text>
                Signed in as:
              </Navbar.Text>
              <NavDropdown title={fullName} id="collapsible-nav-dropdown-4">
                <NavDropdown.Item href="/admin/account">Account Settings</NavDropdown.Item>
                <NavDropdown.Item href="/admin/profile">Edit Admin Profile</NavDropdown.Item>
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