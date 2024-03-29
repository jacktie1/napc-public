import React, { useState, useRef, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import AppTitle from '../components/AppTitle';
import VolunteerProfileForm from '../components/VolunteerProfileForm';
import UserAccountForm from '../components/UserAccountForm';
import VolunteerPickupCapacityForm from '../components/VolunteerPickupCapacityForm';
import VolunteerHousingCapacityForm from '../components/VolunteerHousingCapacityForm';
import PrivacyStatement from '../components/PrivacyStatement';
import PatienceInfo from '../components/PatienceInfo';
import RequiredFieldInfo from '../components/RequiredFieldInfo';
import { useNavigate } from 'react-router-dom';

import { Container, Button, Row, Col, Accordion, Alert } from 'react-bootstrap';
import * as formUtils from '../utils/formUtils';


const SignupVolunteerPage = () => {
  const navigate = useNavigate();

  const [activeCard, setActiveCard] = useState('volunteerProfile');

  const [serverError, setServerError] = useState('');

  const [optionReferences, setOptionReferences] = useState({});

  var volunteerProfile;
  var userAccount;
  var pickupCapacity;
  var housingCapacity;

  const volunteerProfileFormRef = useRef(null);
  const userAccountFormRef = useRef(null);
  const pickupCapacityFormRef = useRef(null);
  const housingCapacityFormRef = useRef(null);

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
  
    fetchOptions();
  }, [])

  const sendSignupVolunteerRequest = async () => {
    try {
      let preparedVolunteerProfile = formUtils.fromVolunteerProfileForm(volunteerProfile);
  
      let preparedUserAccount = formUtils.fromUserAccountForm(userAccount);

      let preparedVolunteerAirportPickup = formUtils.fromVolunteerAirportPickupForm(pickupCapacity);

      let preparedVolunteerTempHousing = formUtils.fromVolunteerTempHousingForm(housingCapacity);

      await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/api/volunteer/register`, {
        volunteerProfile: preparedVolunteerProfile,
        userAccount: preparedUserAccount,
        volunteerAirportPickup: preparedVolunteerAirportPickup,
        volunteerTempHousing: preparedVolunteerTempHousing
      });

      alert('Volunteer registration is successful!');
      navigate('/login');
    } catch (axiosError) {
      let { errorMessage } = parseAxiosError(axiosError);

      window.scrollTo(0, 0);
      setServerError(errorMessage);
    }
  };

  const handleClick = () => {
    volunteerProfileFormRef.current.submitForm()
      .then(() => {
        userAccountFormRef.current.submitForm()
        .then(() => {
          pickupCapacityFormRef.current.submitForm()
          .then(() => {
            housingCapacityFormRef.current.submitForm()
            .then(() => {
              const volunteerProfileErrors = volunteerProfileFormRef.current.errors;
              const userAccountErrors = userAccountFormRef.current.errors;
              const pickupCapacityErrors = pickupCapacityFormRef.current.errors;
              const housingCapacityErrors = housingCapacityFormRef.current.errors;
          
              if (Object.keys(volunteerProfileErrors).length === 0
                && Object.keys(userAccountErrors).length === 0
                && Object.keys(pickupCapacityErrors).length === 0
                && Object.keys(housingCapacityErrors).length === 0)
              {
                sendSignupVolunteerRequest();
              }
              else if (Object.keys(volunteerProfileErrors).length > 0)
              {
                setActiveCard("volunteerProfile");
              }
              else if (Object.keys(userAccountErrors).length > 0)
              {
                setActiveCard("userAccount");
              }
              else if (Object.keys(pickupCapacityErrors).length > 0)
              {
                setActiveCard("pickupCapacity");
              }
              else if (Object.keys(housingCapacityErrors).length > 0)
              {
                setActiveCard("housingCapacity");
              }
          });
        });
      });
    });
  };

  const handleVolunteerProfileSubmit = (values, { setSubmitting }) => {
    volunteerProfile = values;
    setSubmitting(false);
  };

  const handleUserAccountFormSubmit = (values, { setSubmitting }) => {
    userAccount = values;
    setSubmitting(false);
  };

  const handleVolunteerPickupCapacityFormSubmit = (values, { setSubmitting }) => {
    pickupCapacity = values;
    setSubmitting(false);
  };

  const handleVolunteerHousingCapacityFormSubmit = (values, { setSubmitting }) => {
    housingCapacity = values;
    setSubmitting(false);
  };

  const selectAccordionItem = (eventKey) => {
    setActiveCard(eventKey);
  }

  return (
    <Container className="mt-5">
      <AppTitle />
      <Row className="mt-5 wide-pretty-box-layout">
        <Col className="pretty-box" >
            <h2 className="pretty-box-heading">Volunteer Registration</h2> 
            <PrivacyStatement />
            <PatienceInfo targetGroup="volunteer"/>
            <RequiredFieldInfo />
            <hr/>
              {serverError && (
                <Alert variant='danger'>
                  {serverError}
                </Alert>
              )}
            <Accordion defaultActiveKey="volunteerProfile" activeKey={activeCard} onSelect={selectAccordionItem}>
              <Accordion.Item eventKey="volunteerProfile">
                <Accordion.Header>Basic Information</Accordion.Header>
                <Accordion.Body>
                  <VolunteerProfileForm
                    innerRef={volunteerProfileFormRef}
                    onSubmit={handleVolunteerProfileSubmit}
                  />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="userAccount">
                <Accordion.Header>User Account</Accordion.Header>
                <Accordion.Body>
                  <UserAccountForm
                    innerRef={userAccountFormRef}
                    onSubmit={handleUserAccountFormSubmit}
                    optionReferences={optionReferences}
                  />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="pickupCapacity">
                <Accordion.Header>Airport Pickup Volunteer</Accordion.Header>
                <Accordion.Body>
                  <VolunteerPickupCapacityForm
                    innerRef={pickupCapacityFormRef}
                    onSubmit={handleVolunteerPickupCapacityFormSubmit}
                  />
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="housingCapacity">
                <Accordion.Header>Temporary Housing Volunteer</Accordion.Header>
                <Accordion.Body>
                  <VolunteerHousingCapacityForm
                      innerRef={housingCapacityFormRef}
                      onSubmit={handleVolunteerHousingCapacityFormSubmit}
                    />
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <hr/>
            <Button variant="primary" onClick={handleClick} className="pretty-box-button">
              Submit
            </Button> 
            <Button variant="secondary" href='/login' className="pretty-box-button">
              Back To Login
            </Button> 
        </Col>
      </Row>
    </Container>
  );
};

export default SignupVolunteerPage;