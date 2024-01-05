import React from 'react';
import AppTitle from '../components/AppTitle';
import { Container, Button, Row, Col, Alert } from 'react-bootstrap';

const PasswordResetPage = () => {
  return (
    <Container>
      <AppTitle />
        <Row className="mt-5 login-form-box">
          <Col className="auth-form">
          <Alert variant='info'>
            If you forgot your password, please email the system admin at jasonchenatlanta@gmail.com to retrieve it.
          </Alert>
          <Button variant="secondary" href='/login' className="auth-form-button">
            Back To Login
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default PasswordResetPage;