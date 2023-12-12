import React from 'react';
import AppTitle from '../components/AppTitle';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';

const SignupVolunteerPage = () => {
  return (
    <Container>
      <AppTitle />
      <Row className="mt-5 signup-form-box">
        <Col>
          <Form className="auth-form">
            <h2 className="auth-form-heading">Volunteer Registration</h2> 
            <hr/>
            <Button variant="secondary" href='/login' className="auth-form-button">
              Back To Login
            </Button> 
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupVolunteerPage;