import React, { useRef, useContext, useState, useEffect } from 'react';
import { Container, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import UserSecurityQuestionsForm from '../components/UserSecurityQuestionsForm';
import RequiredFieldInfo from '../components/RequiredFieldInfo';
import AppTitle from '../components/AppTitle';

import { UserContext } from '../auth/UserSession';
import * as formUtils from '../utils/formUtils';


const UserSecurityQuestionsPage = () => {
  const navigate = useNavigate();

  const {userId, isAdmin, isStudent, isVolunteer} = useContext(UserContext)

  const [optionReferences, setOptionReferences] = useState({});

  const [serverError, setServerError] = useState('');

  var userSecurityQuestions;

  const userSecurityQuestionFormRef = useRef(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/getReferences`, {
          params: {
            referenceTypes: ['SecurityQuestion'].join(','),
          }
        });
  
        setOptionReferences(axiosResponse.data.result.referencesByType);
  
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);
  
        setServerError(errorMessage);
      }
    };

    const checkHasSecurityQuestion = async () => {
      try {
        let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/userAccount/getAccount/${userId}`);
  
        let fetchedUserSecurityQuestions = axiosResponse.data.result.userAccount;

        if (fetchedUserSecurityQuestions.securityQuestionReferenceId1 || fetchedUserSecurityQuestions.securityQuestionReferenceId2 || fetchedUserSecurityQuestions.securityQuestionReferenceId3) {
          setServerError('You are reaching this page in error. You have already set up your security questions.');
          
          if (isStudent) {
            navigate('/student/announcement');
          } else if (isVolunteer) {
            navigate('/volunteer/agreement');
          } else if (isAdmin) {
            navigate('/admin/home');
          }
        }
  
        fetchOptions();
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);
  
        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    }
  
    checkHasSecurityQuestion();
  }, [userId, isStudent, isVolunteer, isAdmin, navigate]);

  const sendUpdateUserSecurityQuestionsRequest = async () => {
    try {
      let preparedUserSecurityQuestions = formUtils.fromUserSecurityQustionsForm(userSecurityQuestions);

      await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/userAccount/updateSecurityQuestions/${userId}`,
        {
          securityQuestionReferenceId1: preparedUserSecurityQuestions.securityQuestionReferenceId1,
          securityAnswer1: preparedUserSecurityQuestions.securityAnswer1,
          securityQuestionReferenceId2: preparedUserSecurityQuestions.securityQuestionReferenceId2,
          securityAnswer2: preparedUserSecurityQuestions.securityAnswer2,
          securityQuestionReferenceId3: preparedUserSecurityQuestions.securityQuestionReferenceId3,
          securityAnswer3: preparedUserSecurityQuestions.securityAnswer3,
        });
  
      alert('Security questions setup successfully');
  
      setServerError('');

      if (isStudent) {
        navigate('/student/announcement');
      } else if (isVolunteer) {
        navigate('/volunteer/agreement');
      } else if (isAdmin) {
        navigate('/admin/home');
      }
    } catch (axiosError) {
      let { errorMessage } = parseAxiosError(axiosError);
  
      window.scrollTo(0, 0);
      setServerError(errorMessage);
    }
  }

  const handleClick = () => {
    userSecurityQuestionFormRef.current.submitForm().then(() => {
      let userSecurityQuestionsErrors = userSecurityQuestionFormRef.current.errors;
    
        if (Object.keys(userSecurityQuestionsErrors).length === 0)
        {
          sendUpdateUserSecurityQuestionsRequest();
        }
    });
  };

  const handleUserSecurityQuestionsSubmit = (values, { setSubmitting }) => {
    userSecurityQuestions = values;
    setSubmitting(false);
  };

  return (
    <>
      <Container className="mt-5">
        <AppTitle />
        <Row className="mt-5 wide-pretty-box-layout">
          <Col className="pretty-box" >
              <h2 className="pretty-box-heading">Security Question Setup</h2> 
              <Alert dismissible variant='warning'>
                  In order to reset forgotten passwords in the future, you must provide answers to three security questions.
              </Alert>
              <RequiredFieldInfo />
              <hr/>
              {serverError && (
                <Alert variant='danger'>
                  {serverError}
                </Alert>
              )}
              <UserSecurityQuestionsForm
                innerRef={userSecurityQuestionFormRef}
                onSubmit={handleUserSecurityQuestionsSubmit}
                optionReferences={optionReferences}
              />
              <hr/>
              <Button variant="primary" onClick={handleClick} className="pretty-box-button">
                Submit
              </Button> 
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UserSecurityQuestionsPage;