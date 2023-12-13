import React, { useState } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import UserSession from './../auth/UserSession';
import AppTitle from './../components/AppTitle';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [serverValidationError, setServerValidationError] = useState('');

  // this has to be bound to form onSubmit because the boostrap validator binds
  // itself to form's submit() method
  const handleLogin = (event)  => {
    // server side authentication code here
    // ...

    if (username==='student' && password==='123456')
    {
      UserSession.startSession('test-token', {role: 'student'});
      alert('You have succesfully logged in!');
    }
    else if (username==='volunteer' && password==='123456')
    {
      UserSession.startSession('test-token', {role: 'volunteer'});
      alert('You have succesfully logged in!');
    }
    else if (username==='admin' && password==='123456')
    {
      UserSession.startSession('test-token', {role: 'admin'});
      alert('You have succesfully logged in!');
    }
    else
    {
      setServerValidationError('Bad credentials - Please retry!');
      setPassword('');
      
      // stop submitting
      event.preventDefault();
      event.stopPropagation();
      return;
    }
  };

  return (
    <Container>
      <AppTitle />
      <Row className="mt-5 login-form-box">
        <Col className="auth-form">
          <Form onSubmit={handleLogin}>
            <h2 className="auth-form-heading">Login</h2>

            <Form.Group controlId="loginFormUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="loginFormPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Form.Label><a href="/password/reset">Forgot Password?</a></Form.Label>
            </Form.Group>

            <Button variant="primary" type="submit" className="auth-form-button">
              Login
            </Button>

            <Form.Label>New User? <a href="/signup/option">Signup</a> instead</Form.Label>
            <hr />

            {serverValidationError && (
            <Alert variant='danger'>
              {serverValidationError}
            </Alert>
          )}
            
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;