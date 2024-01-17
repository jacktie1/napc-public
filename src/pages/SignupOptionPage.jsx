import React from 'react';
import AppTitle from '../components/AppTitle';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';

const SignupOptionPage = () => {
  return (
    <Container className="mt-5">
      <AppTitle />
      <Row className="mt-5 wide-pretty-box-layout">
        <Col>
          <Form className="pretty-box">
            <h2 className="pretty-box-heading">You are a</h2>

            <Button variant="primary" href='/signup/student' className="pretty-box-button">
              New Student
            </Button>

            <Button variant="primary" href='/signup/volunteer' className="pretty-box-button">
              Volunteer (Airport Pickup and/or Housing)
            </Button>
            <hr/>
            <Button variant="secondary" href='/login' className="pretty-box-button">
              Back To Login
            </Button>  
          </Form>
        </Col>
      </Row>

    </Container>
  );
};

export default SignupOptionPage;