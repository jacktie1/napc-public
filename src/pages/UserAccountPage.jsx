import React, { useRef, useContext, useState, useEffect } from 'react';
import { Container, Button, Row, Col, Alert } from 'react-bootstrap';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import UserEditableAccountForm from '../components/UserEditableAccountForm';
import EmergencyContactInfo from '../components/EmergencyContactInfo';
import RequiredFieldInfo from '../components/RequiredFieldInfo';
import ApathNavbar from '../components/ApathNavbar';
import { UserContext } from '../auth/UserSession';
import * as formUtils from '../utils/formUtils';


const UserAccountPage = () => {
  const { userId } = useContext(UserContext);

  const [loadedData, setLoadedData] = useState({});

  const [serverError, setServerError] = useState('');

  var userAccount;

  const userAccountFormRef = useRef(null);

  useEffect(() => {
    const loadExistingData = async () => {
      try {
        let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/userAccount/getAccount/${userId}`);
  
        let userAccount = axiosResponse.data.result.userAccount;
  
        setLoadedData(userAccount);
      } catch (axiosError) {
        let { errorMessage } = parseAxiosError(axiosError);
  
        window.scrollTo(0, 0);
        setServerError(errorMessage);
      }
    }
  
    loadExistingData();
  }, [userId])

  const sendUpdateUserAccountRequest = async () => {
    try {
      let preparedUserAccount = formUtils.fromUserAccountForm(userAccount);

      await axiosInstance.put(`${process.env.REACT_APP_API_BASE_URL}/api/userAccount/updateAccount/${userId}`,
        {
          userAccount: preparedUserAccount
        });
  
      alert('Account updated successfully');
  
      setServerError('');
    } catch (axiosError) {
      let { errorMessage } = parseAxiosError(axiosError);
  
      window.scrollTo(0, 0);
      setServerError(errorMessage);
    }
  }

  const handleClick = () => {
    userAccountFormRef.current.submitForm().then(() => {
      let userAccountErrors = userAccountFormRef.current.errors;
    
        if (Object.keys(userAccountErrors).length === 0)
        {
          sendUpdateUserAccountRequest();
        }
    });
  };

  const handleUserAccountSubmit = (values, { setSubmitting }) => {
    userAccount = values;
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
              <h2 className="pretty-box-heading">Edit Account Setting</h2> 
              <RequiredFieldInfo />
              <hr/>
              {serverError && (
                <Alert variant='danger'>
                  {serverError}
                </Alert>
              )}
              <UserEditableAccountForm
                innerRef={userAccountFormRef}
                onSubmit={handleUserAccountSubmit}
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

export default UserAccountPage;