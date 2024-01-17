import React, { useState, useContext } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { UserContext } from './../auth/UserSession';
import AppTitle from './../components/AppTitle';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const { startSession } = useContext(UserContext);

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
      startSession('test-token', {role: 'student', userId: 1});
      navigate('/student/announcement');
    }
    else if (username==='volunteer' && password==='123456')
    {
      startSession('test-token', {role: 'volunteer', userId: 2});
      navigate('/volunteer/agreement');
    }
    else if (username==='admin' && password==='123456')
    {
      startSession('test-token', {role: 'admin', userId: 3});
      navigate('/admin/home');
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
    <Container className="mt-5">
      <AppTitle />
      <Row className="mt-5 nrw-pretty-box-layout">
        <Col className="pretty-box">
          <Form onSubmit={handleLogin}>
            <h2 className="pretty-box-heading">Login</h2>

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

            <Button variant="primary" type="submit" className="pretty-box-button">
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