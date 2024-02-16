import React, { useRef, useState, useContext, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import StudentCommentForm from '../components/StudentCommentForm';
import RequiredFieldInfo from '../components/RequiredFieldInfo';
import ApathNavbar from '../components/ApathNavbar';
import { UserContext } from '../auth/UserSession';
import * as formUtils from '../utils/formUtils';

import { Container, Button, Row, Col, Alert } from 'react-bootstrap';

const StudentCommentPage = () => {
  const { userId } = useContext(UserContext);

  const [serverError, setServerError] = useState('');

  const [loadedData, setLoadedData] = useState(false);

  var studentComment;

  const studentCommentFormRef = useRef(null);

  useEffect(() => {
    const loadExistingData = async () => {
      try {
        let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/student/getComment/${userId}`);

        let studentComment = axiosResponse.data.result.student.studentComment;

        setLoadedData(studentComment);
      }
      catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);

        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    }

    loadExistingData();
  }, [userId])

  const sendUpdateStudentCommentRequest = async () => {
    try {
      let preparedStudentComment = formUtils.fromStudentCommentForm(studentComment);

      await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/student/updateComment/${userId}`,
        {
          studentComment: preparedStudentComment
        });

      alert('Comment updated successfully');

      setServerError('');
    }
    catch (axiosError) {
      let { errorMessage } = parseAxiosError(axiosError);

      window.scrollTo(0, 0);
      setServerError(errorMessage);
    }
  }

  const handleClick = () => {
    studentCommentFormRef.current.submitForm().then(() => {
        let studentCommentErrors = studentCommentFormRef.current.errors;
    
        if (Object.keys(studentCommentErrors).length === 0)
        {
          sendUpdateStudentCommentRequest();
        }
    });
  };

  const handleStudentCommentSubmit = (values, { setSubmitting }) => {
    studentComment = values;
    setSubmitting(false);
  };

  return (
    <div>
      <ApathNavbar />

      <Container>
          <Row className="mt-5">
            <EmergencyContactInfo targetGroup={'student'}/>
          </Row>
      </Container>

      <Container>
        <Row className="mt-5 wide-pretty-box-layout">
          <Col className="pretty-box" >
              <h2 className="pretty-box-heading">Comment</h2> 
              <RequiredFieldInfo />
              <hr/>
              {serverError && (
                <Alert variant='danger'>
                  {serverError}
                </Alert>
              )}
              <StudentCommentForm
                innerRef={studentCommentFormRef}
                onSubmit={handleStudentCommentSubmit}
                loadedData={loadedData}
              />
              <hr/>
              <Button variant="primary" onClick={handleClick} className="pretty-box-button">
                Submit
              </Button> 
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StudentCommentPage;