import React from 'react';
import AppTitle from '../components/AppTitle';
import { Container, Button, Row, Col, Alert } from 'react-bootstrap';

const PasswordResetPage = () => {
  return (
    <Container className="mt-5">
      <AppTitle />
        <Row className="mt-5 nrw-pretty-box-layout">
          <Col className="pretty-box">
          <Alert variant='info'>
            If you forgot your password, please email the system admin at jasonchenatlanta@gmail.com to retrieve it.
          </Alert>
          <Button variant="secondary" href='/login' className="pretty-box-button">
            Back To Login
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default PasswordResetPage;