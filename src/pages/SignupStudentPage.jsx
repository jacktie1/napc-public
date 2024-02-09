import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import { Container, Button, Row, Col, Accordion, Alert } from 'react-bootstrap';

import AppTitle from '../components/AppTitle';
import StudentProfileForm from '../components/StudentProfileForm';
import UserAccountForm from '../components/UserAccountForm';
import StudentFlightInfoForm from '../components/StudentFlightInfoForm';
import StudentTempHousingForm from '../components/StudentTempHousingForm';
import StudentCommentForm from '../components/StudentCommentForm';
import PrivacyStatement from '../components/PrivacyStatement';
import PatienceInfo from '../components/PatienceInfo';
import RequiredFieldInfo from '../components/RequiredFieldInfo';
import { fromYesOrNoOptionValue, fromReferenceIdOptionValue, fromGenderOptionValue, fromCustomOptionValue, fromOptionalTextValue, fromStudentTypeValue } from '../utils/formUtils';

const SignupStudentPage = () => {
  const navigate = useNavigate();

  const [activeCard, setActiveCard] = useState('studentProfile');
  const [serverError, setServerError] = useState('');

  const [studentRegisterationStartDate, setStudentRegisterationStartDate] = useState('');
  const [studentRegisterationEndDate, setStudentRegisterationEndDate] = useState('');

  const [optionReferences, setOptionReferences] = useState({});

  var studentProfile;
  var userAccount;
  var flightInfo;
  var tempHousing;
  var studentComment;

  const studentProfileFormRef = useRef(null);
  const userAccountFormRef = useRef(null);
  const StudentFlightInfoFormRef = useRef(null);
  const StudentTempHousingFormRef = useRef(null);
  const studentCommentFormRef = useRef(null);

  const currentDate = new Date();

  const fetchStudentRigistrationDateRange = async () => {
    try {
      let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/getManagement`);

      let managent = axiosResponse?.data?.result?.management;

      // Error, we just forbid the user to register
      if(!managent)
      {
        setStudentRegisterationStartDate('1900-01-01');
        setStudentRegisterationEndDate('1900-01-01');
        throw new Error('No management data found');
      }
      
      let startDate = managent.studentRegistrationStartDate;
      let endDate = managent.studentRegistrationEndDate;

      // Add one day to the end date for comparison purpose
      let endDateObject = new Date(endDate);
      endDateObject.setDate(endDateObject.getDate() + 1);
      endDate = endDateObject.toISOString().split('T')[0];

      setStudentRegisterationStartDate(startDate);
      setStudentRegisterationEndDate(endDate);

      fetchOptions();
    } catch (axiosError) {
      let { errorMessage } = parseAxiosError(axiosError);

      setServerError(errorMessage);
    }
  };

  const fetchOptions = async () => {
    try {
      let axiosResponse = await axiosInstance.get(`${process.env.REACT_APP_API_BASE_URL}/api/admin/getReferences`, {
        params: {
          referenceTypes: ['Major', 'Airline', 'Area', 'Location', 'Apartment', 'SecurityQuestion'].join(','),
        }
      });

      setOptionReferences(axiosResponse.data.result.referencesByType);

    } catch (axiosError) {
      let { errorMessage } = parseAxiosError(axiosError);

      setServerError(errorMessage);
    }
  };

  const sendSignupStudentRequest = async () => {
    try {
      let preparedStudentProfile = {
        firstName: studentProfile.firstName,
        lastName: studentProfile.lastName,
        englishName: fromOptionalTextValue(studentProfile.englishName),
        gender: fromGenderOptionValue(studentProfile.gender),
        isNewStudent: fromYesOrNoOptionValue(studentProfile.isNewStudent),
        graduatesFrom: fromOptionalTextValue(studentProfile.graduatesFrom),
        studentType: fromStudentTypeValue(studentProfile.studentType),
        majorReferenceId: fromReferenceIdOptionValue(studentProfile.majorReferenceId),
        customMajor: fromCustomOptionValue(studentProfile.customMajor, studentProfile.majorReferenceId),
        hasCompanion: fromYesOrNoOptionValue(studentProfile.hasCompanion),
        emailAddress: studentProfile.emailAddress,
        wechatId: studentProfile.wechatId,
        cnPhoneNumber: fromOptionalTextValue(studentProfile.cnPhoneNumber),
        usPhoneNumber: fromOptionalTextValue(studentProfile.usPhoneNumber),
      };

      let preparedUserAccount = {
        username: userAccount.username,
        password: userAccount.password,
        securityQuestionReferenceId1: fromReferenceIdOptionValue(userAccount.securityQuestionReferenceId1),
        securityAnswer1: userAccount.securityAnswer1,
        securityQuestionReferenceId2: fromReferenceIdOptionValue(userAccount.securityQuestionReferenceId2),
        securityAnswer2: userAccount.securityAnswer2,
        securityQuestionReferenceId3: fromReferenceIdOptionValue(userAccount.securityQuestionReferenceId3),
        securityAnswer3: userAccount.securityAnswer3,
      };

      let preparedFlightInfo = {
        needsAirportPickup: fromYesOrNoOptionValue(flightInfo.needsAirportPickup),
      };

      if(preparedFlightInfo.needsAirportPickup)
      {
        preparedFlightInfo = {
          ...preparedFlightInfo,
          hasFlightInfo: fromYesOrNoOptionValue(flightInfo.hasFlightInfo),
        };
      }

      if(preparedFlightInfo.hasFlightInfo)
      {
        preparedFlightInfo = {
          ...preparedFlightInfo,
          arrivalFlightNumber: flightInfo.arrivalFlightNumber,
          arrivalAirlineReferenceId: fromReferenceIdOptionValue(flightInfo.arrivalAirlineReferenceId),
          customArrivalAirline: fromCustomOptionValue(flightInfo.customArrivalAirline, flightInfo.arrivalAirlineReferenceId),
          arrivalDatetime: flightInfo.arrivalDate + ' ' + flightInfo.arrivalTime,
          departureFlightNumber: flightInfo.departureFlightNumber,
          departureAirlineReferenceId: fromReferenceIdOptionValue(flightInfo.departureAirlineReferenceId),
          customDepartureAirline: fromCustomOptionValue(flightInfo.customDepartureAirline, flightInfo.departureAirlineReferenceId),
          departureDatetime: flightInfo.departureDate + ' ' + flightInfo.departureTime,
          numLgLuggages: flightInfo.numLgLuggages,
          numSmLuggages: flightInfo.numSmLuggages,
        };
      }

      let preparedTempHousing = {
        needsTempHousing: fromYesOrNoOptionValue(tempHousing.needsTempHousing),
        apartmentReferenceId: fromReferenceIdOptionValue(tempHousing.apartmentReferenceId),
        customDestinationAddress: fromCustomOptionValue(tempHousing.customDestinationAddress, tempHousing.apartmentReferenceId),
      }

      if(preparedTempHousing.needsTempHousing)
      {
        preparedTempHousing = {
          ...preparedTempHousing,
          numNights: fromReferenceIdOptionValue(tempHousing.numNights),
        };
      }
      else
      {
        preparedTempHousing = {
          ...preparedTempHousing,
          contactName: fromOptionalTextValue(tempHousing.contactName),
          contactPhoneNumber: fromOptionalTextValue(tempHousing.contactPhoneNumber),
          contactEmail: fromOptionalTextValue(tempHousing.contactEmail),
        };
      }

      let preparedStudentComment = {
        studentComment: fromOptionalTextValue(studentComment.studentComment),
      };

      await axiosInstance.post(`${process.env.REACT_APP_API_BASE_URL}/api/student/register`, {
        userAccount: preparedUserAccount,
        studentProfile: preparedStudentProfile,
        studentFlightInfo: preparedFlightInfo,
        studentTempHousing: preparedTempHousing,
        studentComment: preparedStudentComment,
      });

      alert('Student registration is successful!');
      navigate('/login');
    } catch (axiosError) {
      let { errorMessage } = parseAxiosError(axiosError);

      setServerError(errorMessage);
    }
  };

  useEffect(() => {
    fetchStudentRigistrationDateRange();
  }, [])

  const handleClick = () => {
    studentProfileFormRef.current.submitForm().then(() => {
        userAccountFormRef.current.submitForm().then(() => {
          StudentFlightInfoFormRef.current.submitForm().then(() => {
            StudentTempHousingFormRef.current.submitForm().then(() => {
              studentCommentFormRef.current.submitForm().then(() => {
                let studentProfileErrors = studentProfileFormRef.current.errors;
                let userAccountErrors = userAccountFormRef.current.errors;
                let flightInfoErrors = StudentFlightInfoFormRef.current.errors;
                let tempHousingErrors = StudentTempHousingFormRef.current.errors;
                let studentCommentErrors = studentCommentFormRef.current.errors;
          
                if (Object.keys(studentProfileErrors).length == 0
                  && Object.keys(userAccountErrors).length == 0
                  && Object.keys(flightInfoErrors).length == 0
                  && Object.keys(tempHousingErrors).length == 0
                  && Object.keys(studentCommentErrors).length == 0)
                {
                  sendSignupStudentRequest();
                }
                else if (Object.keys(studentProfileErrors).length > 0)
                {
                  setActiveCard("studentProfile");
                }
                else if (Object.keys(userAccountErrors).length > 0)
                {
                  setActiveCard("userAccount");
                }
                else if (Object.keys(flightInfoErrors).length > 0)
                {
                  setActiveCard("flightInfo");
                }
                else if (Object.keys(tempHousingErrors).length > 0)
                {
                  setActiveCard("tempHousing");
                }
                else if (Object.keys(studentCommentErrors).length > 0)
                {
                  setActiveCard("studentComment");
                }
            });
          });
        });
      });
    });
  };

  const handleStudentProfileSubmit = (values, { setSubmitting }) => {
    studentProfile = values;
    setSubmitting(false);
  };

  const handleUserAccountFormSubmit = (values, { setSubmitting }) => {
    userAccount = values;
    setSubmitting(false);
  };

  const handleStudentFlightInfoFormSubmit = (values, { setSubmitting }) => {
    flightInfo = values;
    setSubmitting(false);
  };

  const handleStudentTempHousingFormSubmit = (values, { setSubmitting }) => {
    tempHousing = values;
    setSubmitting(false);
  };

  const handleStudentCommentFormSubmit = (values, { setSubmitting }) => {
    studentComment = values;
    setSubmitting(false);
  };

  const selectAccordionItem = (eventKey) => {
    setActiveCard(eventKey);
  }


  if(currentDate >= new Date(studentRegisterationStartDate) && currentDate <= new Date(studentRegisterationEndDate))
  {
    return (
      <Container className="mt-5">
        <AppTitle />
        <Row className="mt-5 wide-pretty-box-layout">
          <Col className="pretty-box" >
              <h2 className="pretty-box-heading">Student Registration</h2> 
              <PrivacyStatement />
              <PatienceInfo targetGroup='student'/>
              <RequiredFieldInfo />
              <hr/>
              {serverError && (
                <Alert variant='danger'>
                  {serverError}
                </Alert>
              )}
              <Accordion defaultActiveKey="studentProfile" activeKey={activeCard} onSelect={selectAccordionItem}>
                <Accordion.Item eventKey="studentProfile">
                  <Accordion.Header>Basic Information</Accordion.Header>
                  <Accordion.Body>
                    <StudentProfileForm
                      innerRef={studentProfileFormRef}
                      onSubmit={handleStudentProfileSubmit}
                      optionReferences={optionReferences}
                    />
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="userAccount">
                  <Accordion.Header>Account Information</Accordion.Header>
                  <Accordion.Body>
                    <UserAccountForm
                      innerRef={userAccountFormRef}
                      onSubmit={handleUserAccountFormSubmit}
                      optionReferences={optionReferences}
                    />
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="flightInfo">
                  <Accordion.Header>Flight Information</Accordion.Header>
                  <Accordion.Body>
                    <StudentFlightInfoForm
                      innerRef={StudentFlightInfoFormRef}
                      onSubmit={handleStudentFlightInfoFormSubmit}
                      optionReferences={optionReferences}
                    />
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="tempHousing">
                  <Accordion.Header>Temporary Housing</Accordion.Header>
                  <Accordion.Body>
                    <StudentTempHousingForm
                        innerRef={StudentTempHousingFormRef}
                        onSubmit={handleStudentTempHousingFormSubmit}
                        optionReferences={optionReferences}
                      />
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="studentComment">
                  <Accordion.Header>Comment</Accordion.Header>
                  <Accordion.Body>
                    <StudentCommentForm
                        innerRef={studentCommentFormRef}
                        onSubmit={handleStudentCommentFormSubmit}
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
  }
  else
  {
    return (
      <Container className="mt-5">
        <AppTitle />
          <Row className="mt-5 nrw-pretty-box-layout">
            <Col className="pretty-box">
            <Alert variant='warning'>
                Student registation is only available between {studentRegisterationStartDate} and {studentRegisterationEndDate} (GMT).<br/><br/>
                If you have any special need, Please contact the system admin at jasonchenatlanta@gmail.com.
            </Alert>
            <Button variant="secondary" href='/login' className="pretty-box-button">
              Back To Login
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
};

export default SignupStudentPage;