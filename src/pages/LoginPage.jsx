import React, { useState, useContext, useRef } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { UserContext } from './../auth/UserSession';
import AppTitle from './../components/AppTitle';
import { useNavigate } from 'react-router-dom';
import * as formik from 'formik';
import * as yup from 'yup';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';

const LoginPage = () => {
  const navigate = useNavigate();

  const { Formik } = formik;

  const { startSession } = useContext(UserContext);

  const [serverError, setServerError] = useState('');

  const loginFormRef = useRef(null);

  var loginInfo;;
  
  const initialValues = {
    username: '',
    password: '',
  };

  const schema = yup.object().shape({
    username: yup.string().required('Required'),
    password: yup.string().required('Required'),
  });

  // this has to be bound to form onSubmit because the boostrap validator binds
  // itself to form's submit() method
  const handleLogin = ()  => {
    loginFormRef.current.submitForm().then(async () => {
      let loginFormErrors = loginFormRef.current.errors;

      if (Object.keys(loginFormErrors).length > 0) {
        return;
      }

      try {
        let axiosResponse = await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
          username: loginInfo.username,
          password: loginInfo.password,
        });

        let data = axiosResponse.data.result;

        let jwtToken = data.token;
        let role = data.role;
        let firstName = data.firstName;
        let lastName = data.lastName;
        let userId = data.userId;
        let profile = {
          userId: userId,
          role: role,
          firstName: firstName,
          lastName: lastName,
        };

        startSession(jwtToken, profile);

        if (role === 'student') {
          navigate('/student/announcement');
        } else if (role === 'volunteer') {  
          navigate('/volunteer/agreement');
        } else if (role === 'admin') {  
          navigate('/admin/home');
        }
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);

        setServerError(errorMessage);
        loginFormRef.current.resetForm();
      }
    });
  };

  const handleLoginFormSubmit = (values, {setSubmitting}) => {
    loginInfo = values;
    setSubmitting(false);
  };

  return (
    <Container className="mt-5">
      <AppTitle />
      <Row className="mt-5 nrw-pretty-box-layout">
        <Col className="pretty-box">
        <Formik
          innerRef={loginFormRef}
          validationSchema={schema}
          onSubmit={handleLoginFormSubmit}
          enableReinitialize={true}
          initialValues={initialValues}
        >
          {({ handleSubmit, handleChange, values, touched, errors }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <h2 className="pretty-box-heading">Login</h2>

            <Form.Group controlId="loginFormUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                  name='username'
                  type='username'
                  value={values.username}
                  onChange={handleChange}
                  isInvalid={touched.username && !!errors.username}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="loginFormPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                  name='password'
                  type='password'
                  value={values.password}
                  onChange={handleChange}
                  isInvalid={touched.password && !!errors.password}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>

              <Form.Label><a href="/password/reset">Forgot Password?</a></Form.Label>
            </Form.Group>

            <Button variant="primary" onClick={handleLogin} className="pretty-box-button">
              Login
            </Button>

            <Form.Label>New User? <a href="/signup/option">Signup</a> instead</Form.Label>
            <hr />

            {serverError && (
            <Alert variant='danger'>
              {serverError}
            </Alert>
          )}
            
          </Form>
        )}
        </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;