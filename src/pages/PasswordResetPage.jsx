import React, { useState, useEffect, useRef } from 'react';
import AppTitle from '../components/AppTitle';
import { Container, Button, Row, Col, Alert, Form, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import RequiredFieldFormLabel from '../components/RequiredFieldFormLabel';
import * as formik from 'formik';
import * as yup from 'yup';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';

const PasswordResetPage = () => {
  const navigate = useNavigate();

  const { Formik } = formik;

  const [retrieveSecurityQuestionsServerError, setRetrieveSecurityQuestionsServerError] = useState('');
  const [submitSecurityAnswersServerError, setSubmitSecurityAnswersServerError] = useState('');
  const [resetPasswordServerError, setResetPasswordServerError] = useState('');

  const [securityQuestionReferenceById, setSecurityQuestionReferenceById] = useState([]);
  const [targetUsername, setTargeUsername] = useState('');
  const [token, setToken] = useState('');

  const [showUserSecurityQuestionsModal, setShowUserSecurityQuestionsModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

  const [securityQuestionReferenceId1, setSecurityQuestionReferenceId1] = useState('');
  const [securityQuestionReferenceId2, setSecurityQuestionReferenceId2] = useState('');
  const [securityQuestionReferenceId3, setSecurityQuestionReferenceId3] = useState('');


  useEffect(() => {
    const fetchSecurityQuestionReferences = async () => {
      try {
        let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/getReferences`, {
          params: {
            referenceTypes: ['SecurityQuestion'].join(','),
          }
        });
  
        let referencesByType = axiosResponse.data.result.referencesByType;
        let securityQuestionReferences = referencesByType.SecurityQuestion;

        // get reference_id from each security question reference and store in securityQuestionReferenceById
        let securityQuestionReferenceById = {};
        for (let securityQuestionReference of securityQuestionReferences) {
          securityQuestionReferenceById[securityQuestionReference.referenceId] = securityQuestionReference;
        }

        setSecurityQuestionReferenceById(securityQuestionReferenceById);
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);
  
        setRetrieveSecurityQuestionsServerError(errorMessage);
      }
    };
  
    fetchSecurityQuestionReferences();
  }, [])

  const securityQuestionRetrivalSchema = yup.object().shape({
    username: yup.string().required('Required'),
  });

  const securityAnswersSchema = yup.object().shape({
    securityAnswer1: yup.string().required('Required'),
    securityAnswer2: yup.string().required('Required'),
    securityAnswer3: yup.string().required('Required'),
  });

  const strongPasswordTest = yup.string()
  .required('Required!')
  .matches(
    /^[0-9a-zA-Z\!\@\#\$\%\^\&\*\(\)\+]+$/,
    "Cannot contain special symbols other than !@#$%^&*()+"
  )
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
    "Must contain at least 8 characters, which includes at least one Uppercase letter, one Lowercase letter, and one Number"
  );

  const confirmPasswordTest = yup.string()
  .required('Required!')
  .oneOf([yup.ref('password')], 'Your passwords do not match!');

  const resetPasswordSchema = yup.object().shape({
    password: strongPasswordTest,
    confirmPassword: confirmPasswordTest,
  });

  var retrieveSecurityQuestionsInfo;
  var securityAnswersInfo;
  var resetPasswordInfo;

  const retrieveSecurityQuestionsFormRef = useRef(null);
  const securityAnswersFormRef = useRef(null);
  const resetPasswordFormRef = useRef(null);

  const initialRetrieveSecurityQuestionsValues = {
    username: '',
  };

  const initialSecurityAnswersValues = {
    securityAnswer1: '',
    securityAnswer2: '',
    securityAnswer3: '',
  };

  const initialResetPasswordValues = {
    password: '',
    confirmPassword: '',
  };

  const handleRetrieveSecurityQuestionsFormSubmit = (values, { setSubmitting }) => {
    retrieveSecurityQuestionsInfo = values;
    setSubmitting(false);
  };

  const handleSecurityAnswersFormSubmit = (values, { setSubmitting }) => {
    securityAnswersInfo = values;
    setSubmitting(false);
  }

  const handleResetPasswordFormSubmit = (values, { setSubmitting }) => {
    resetPasswordInfo = values;
    setSubmitting(false);
  }

  const handleRetrieveSecurityQuestions = async () => {
    retrieveSecurityQuestionsFormRef.current.submitForm().then(async () => {
      let retrieveSecurityQuestionsFormRefErrors = retrieveSecurityQuestionsFormRef.current.errors;

      if (Object.keys(retrieveSecurityQuestionsFormRefErrors).length > 0) {
        return;
      }

      try {
        let givenUsername = retrieveSecurityQuestionsInfo.username;
        let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/userAccount/getAccountByUsername/${givenUsername}`);

        let fetchedUserAccount = axiosResponse.data.result.userAccount;

        if (fetchedUserAccount.securityQuestionReferenceId1 === null || fetchedUserAccount.securityQuestionReferenceId2 === null || fetchedUserAccount.securityQuestionReferenceId3 === null) {
          setRetrieveSecurityQuestionsServerError('Unexepected error. Please contact support.');
          return;
        }

        setRetrieveSecurityQuestionsServerError('');
        setTargeUsername(givenUsername);
        setSecurityQuestionReferenceId1(fetchedUserAccount.securityQuestionReferenceId1);
        setSecurityQuestionReferenceId2(fetchedUserAccount.securityQuestionReferenceId2);
        setSecurityQuestionReferenceId3(fetchedUserAccount.securityQuestionReferenceId3);
        setShowUserSecurityQuestionsModal(true);
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);
  
        setRetrieveSecurityQuestionsServerError(errorMessage);
      }
    });
  };

  const handleSubmitSecurityAnwsers = async () => {
    securityAnswersFormRef.current.submitForm().then(async () => {
      let securityAnswersFormRefErrors = securityAnswersFormRef.current.errors;

      if (Object.keys(securityAnswersFormRefErrors).length > 0) {
        return;
      }

      try {
        let axiosResponse = await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/api/auth/validateUserSecurityAnswers`, {
          username: targetUsername,
          securityQuestionReferenceId1: securityQuestionReferenceId1,
          securityAnswer1: securityAnswersInfo.securityAnswer1,
          securityQuestionReferenceId2: securityQuestionReferenceId2,
          securityAnswer2: securityAnswersInfo.securityAnswer2,
          securityQuestionReferenceId3: securityQuestionReferenceId3,
          securityAnswer3: securityAnswersInfo.securityAnswer3,
        });

        let data = axiosResponse.data.result;
        let fetchedToken = data.token;

        setToken(fetchedToken);
        setSubmitSecurityAnswersServerError('');
        setShowUserSecurityQuestionsModal(false);
        setShowResetPasswordModal(true);
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);
  
        setSubmitSecurityAnswersServerError(errorMessage);
      }
    });
  };

  const handleResetPassword = async () => {
    resetPasswordFormRef.current.submitForm().then(async () => {
      let resetPasswordFormRefErrors = resetPasswordFormRef.current.errors;

      if (Object.keys(resetPasswordFormRefErrors).length > 0) {
        return;
      }

      try {
        await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/auth/resetPassword`, {
          token: token,
          password: resetPasswordInfo.password,
        });

        alert('Password reset successful. Please login with your new password.');
        setResetPasswordServerError('');
        navigate('/login');
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);

        setResetPasswordServerError(errorMessage);
      }

      setShowResetPasswordModal(false);
    });
  };

  const handleUserSecurityQuestionsModalClose = () => {
    setToken('');
    setTargeUsername('');
    setSubmitSecurityAnswersServerError('');
    setShowUserSecurityQuestionsModal(false);
  }

  const handleResetPasswordModalClose = () => {
    setToken('');
    setTargeUsername('');
    setResetPasswordServerError('');
    setShowResetPasswordModal(false);
  }

  return (
    <>
      <Container className="mt-5">
        <AppTitle />
          <Row className="mt-5 nrw-pretty-box-layout">
            <Col className="pretty-box">
              <Formik
              innerRef={retrieveSecurityQuestionsFormRef}
              validationSchema={securityQuestionRetrivalSchema}
              onSubmit={handleRetrieveSecurityQuestionsFormSubmit}
              enableReinitialize={true}
              initialValues={initialRetrieveSecurityQuestionsValues}
              >
              {({ handleSubmit, handleChange, values, touched, errors }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  <h2 className="pretty-box-heading">Password Reset</h2>

                  <Alert>If you don't remember the username or security answer(s), please email Jason Chen at jasonchenatlanta@gmail.com for help</Alert>

                  {retrieveSecurityQuestionsServerError && (
                    <Alert variant='danger'>
                      {retrieveSecurityQuestionsServerError}
                    </Alert>
                  )}

                  <Form.Group controlId="retrieveSecurityQuestionsFormUsername">
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
                </Form>
              )}
              </Formik>
            <hr/>
          
            <Button variant="primary" onClick={handleRetrieveSecurityQuestions} className="pretty-box-button">
              Request Password Reset
            </Button>

            <Button variant="secondary" href='/login' className="pretty-box-button">
              Back To Login
            </Button>
          </Col>
        </Row>
      </Container>
      <Modal show={showUserSecurityQuestionsModal} onHide={handleUserSecurityQuestionsModalClose} centered>
        <Modal.Header closeButton>
        <Modal.Title>Answer Security Questions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Formik
            innerRef={securityAnswersFormRef}
            validationSchema={securityAnswersSchema}
            onSubmit={handleSecurityAnswersFormSubmit}
            enableReinitialize={true}
            initialValues={initialSecurityAnswersValues}
            >
            {({ handleSubmit, handleChange, values, touched, errors }) => (
              <Form noValidate onSubmit={handleSubmit}>
                {submitSecurityAnswersServerError && (
                  <Alert variant='danger'>
                    {submitSecurityAnswersServerError}
                  </Alert>
                )}

                <Row className="mb-3">
                  <Form.Group controlId="securityAnswersFormSecurityAnwser1">
                    <RequiredFieldFormLabel>{securityQuestionReferenceById[securityQuestionReferenceId1].value}</RequiredFieldFormLabel>
                    <Form.Control
                        name='securityAnswer1'
                        value={values.securityAnswer1}
                        onChange={handleChange}
                        isInvalid={touched.securityAnswer1 && !!errors.securityAnswer1}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.securityAnswer1}
                      </Form.Control.Feedback>
                  </Form.Group>   
                </Row>
                <Row className="mb-3">
                  <Form.Group controlId="securityAnswersFormSecurityAnwser2">
                    <RequiredFieldFormLabel>{securityQuestionReferenceById[securityQuestionReferenceId2].value}</RequiredFieldFormLabel>
                    <Form.Control
                        name='securityAnswer2'
                        value={values.securityAnswer2}
                        onChange={handleChange}
                        isInvalid={touched.securityAnswer2 && !!errors.securityAnswer2}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.securityAnswer2}
                      </Form.Control.Feedback>
                  </Form.Group>   
                </Row>
                <Row className="mb-3">
                  <Form.Group controlId="securityAnswersFormSecurityAnwser3">
                    <RequiredFieldFormLabel>{securityQuestionReferenceById[securityQuestionReferenceId3].value}</RequiredFieldFormLabel>
                    <Form.Control
                        name='securityAnswer3'
                        value={values.securityAnswer3}
                        onChange={handleChange}
                        isInvalid={touched.securityAnswer3 && !!errors.securityAnswer3}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.securityAnswer3}
                      </Form.Control.Feedback>
                  </Form.Group>
                </Row>
              </Form>
            )}
            </Formik>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="primary" onClick={handleSubmitSecurityAnwsers}>
            Continue
        </Button>
        <Button variant="secondary" onClick={handleUserSecurityQuestionsModalClose}>
            Close
        </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showResetPasswordModal} onHide={handleResetPasswordModalClose} centered>
        <Modal.Header closeButton>
        <Modal.Title>New Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
              innerRef={resetPasswordFormRef}
              validationSchema={resetPasswordSchema}
              onSubmit={handleResetPasswordFormSubmit}
              enableReinitialize={true}
              initialValues={initialResetPasswordValues}
              >
              {({ handleSubmit, handleChange, values, touched, errors }) => (
                <Form noValidate onSubmit={handleSubmit}>
                  {resetPasswordServerError && (
                    <Alert variant='danger'>
                      {resetPasswordServerError}
                    </Alert>
                  )}

                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="resetPasswordFormPassword">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        name='password'
                        type='password'
                        value={values.password}
                        onChange={handleChange}
                        isValid={touched.password && !errors.password}
                        isInvalid={touched.password && !!errors.password}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    <Form.Group as={Col} controlId="resetPasswordFormConfirmPassword">
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control
                        name='confirmPassword'
                        type='password'
                        value={values.confirmPassword}
                        onChange={handleChange}
                        isValid={touched.confirmPassword && !errors.confirmPassword}
                        isInvalid={touched.confirmPassword && !!errors.confirmPassword}

                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                </Form>
              )}
            </Formik>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="primary" onClick={handleResetPassword}>
            Continue
        </Button>
        <Button variant="secondary" onClick={handleResetPasswordModalClose}>
            Close
        </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PasswordResetPage;