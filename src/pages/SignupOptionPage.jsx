import React from 'react';
import AppTitle from '../components/AppTitle';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';

const SignupOptionPage = () => {
  return (
    <Container>
      <AppTitle />
      <Row className="mt-5 signup-form-box">
        <Col>
          <Form className="auth-form">
            <h2 className="auth-form-heading">You are a</h2>

            <Button variant="primary" href='/signup/student' className="auth-form-button">
              New Student
            </Button>

            <Button variant="primary" href='/signup/volunteer' className="auth-form-button">
              Volunteer (Airport Pickup and/or Housing)
            </Button>
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

export default SignupOptionPage;