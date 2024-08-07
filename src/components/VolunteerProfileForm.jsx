import React, { useEffect, useState } from 'react';
import { Row, Form, Col } from 'react-bootstrap';
import RequiredFieldFormLabel from './RequiredFieldFormLabel'
import * as formik from 'formik';
import * as yup from 'yup';
import * as formUtils from '../utils/formUtils';

const VolunteerProfileForm = ({ innerRef, onSubmit, loadedData, formReadOnly, adminView }) => {
  const { Formik } = formik;

  const [initialValues, setInitialValues] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    affiliation: '',
    emailAddress: '',
    wechatId: '',
    primaryPhoneNumber: '',
    secondaryPhoneNumber: '',
  });

  useEffect(() => {
    if(loadedData && typeof loadedData === 'object' && Object.keys(loadedData).length > 0)
    {
      let formData = formUtils.toVolunteerProfileForm(loadedData);

      // If the current user is not an admin, remove the userStatus field from the form
      // because it cannot be edited by non-admin users
      if(!adminView)
      {
        delete formData.userStatus;
      }

      setInitialValues(formData);
    }
  }, [innerRef, loadedData]);

  const nameTest = yup.string().required('Required!').matches(/^[a-zA-Z &-]+$/, { message: "Can only contain English letters, spaces, '&', or '-'!", excludeEmptyString: true });
  const affiliationTest =  yup.string().required('Required!').matches(/^[a-zA-Z0-9][a-zA-Z0-9 \/\-&]*$/, { message: 'Can only contain English letters, numbers, spaces, "/", "&" or "-"!', excludeEmptyString: true });
  const optionalNoSpaceTest = yup.string().matches(/^[^ ]+$/, { message: 'Cannot contain any space!', excludeEmptyString: true });
  const requiredSelectTest = yup.string().required('Required!');
  const emailAddressTest = yup.string().email('Must be a valid email address').required('Required!');
  const phoneNumberTest = yup.string()
    .min(8, 'Too Short!')
    .matches( /^[0-9\+\-\(\) \.]*$/, 'Must be a valid phone number' );

  const schemaObject = {
    firstName: nameTest,
    lastName: nameTest,
    gender: requiredSelectTest,
    affiliation: affiliationTest,
    emailAddress: emailAddressTest,
    wechatId: optionalNoSpaceTest,
    primaryPhoneNumber: phoneNumberTest.required('Required!'),
    secondaryPhoneNumber: phoneNumberTest,
  }

  if(adminView)
  {
    schemaObject.userStatus = requiredSelectTest;
  }

  const schema = yup.object().shape(schemaObject);

  const genderOptions = [
    { value: '', label: "Select an option" },
    { value: 'male', label: "Male" },
    { value: 'female', label: "Female" },
  ];

  const userStatusOptions = [
    { value: 'enabled', label: "Enabled" },
    { value: 'disabled', label: "Disabled" },
  ];

  return (
    <Formik
      innerRef={innerRef}
      validationSchema={schema}
      onSubmit={onSubmit}
      initialValues={initialValues}
      enableReinitialize={true}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="studentProfileFormFirstName">
              <RequiredFieldFormLabel>First Name</RequiredFieldFormLabel>
              <Form.Control
                type="text"
                name='firstName'
                value={values.firstName}
                onChange={handleChange}
                isValid={touched.firstName && !errors.firstName}
                isInvalid={touched.firstName && !!errors.firstName}
                readOnly={formReadOnly}
                disabled={formReadOnly}
              />
              <Form.Control.Feedback type="invalid">
                {errors.firstName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="studentProfileFormLastName">
              <RequiredFieldFormLabel>Last Name</RequiredFieldFormLabel>
              <Form.Control
                type="text"
                name='lastName'
                value={values.lastName}
                onChange={handleChange}
                isValid={touched.lastName && !errors.lastName}
                isInvalid={touched.lastName && !!errors.lastName}
                readOnly={formReadOnly}
                disabled={formReadOnly}
              />
              <Form.Control.Feedback type="invalid">
                {errors.lastName}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentProfileFormGender">
              <RequiredFieldFormLabel>Gender</RequiredFieldFormLabel>
              <Form.Select
                name='gender'
                onChange={handleChange}
                value={values.gender}
                isValid={touched.gender && !errors.gender}
                isInvalid={touched.gender && !!errors.gender}
                disabled={formReadOnly}
              >
                {genderOptions.map((option) => (
                  <option key={option.value} value={option.value} label={option.label} />
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.gender}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentProfileFormAffiliation">
              <RequiredFieldFormLabel>Affiliation/Recommended by</RequiredFieldFormLabel>
              <Form.Control
                name='affiliation'
                value={values.affiliation}
                onChange={handleChange}
                isValid={touched.affiliation && !errors.affiliation}
                isInvalid={touched.affiliation && !!errors.affiliation}
                readOnly={formReadOnly}
                disabled={formReadOnly}
              />
              <Form.Control.Feedback type="invalid">
                {errors.affiliation}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentProfileFormEmailAddress">
              <RequiredFieldFormLabel>Email Address</RequiredFieldFormLabel>
              <Form.Control
                type="email"
                name='emailAddress'
                value={values.emailAddress}
                onChange={handleChange}
                isValid={touched.emailAddress && !errors.emailAddress}
                isInvalid={touched.emailAddress && !!errors.emailAddress}
                readOnly={formReadOnly}
                disabled={formReadOnly}
              />
              <Form.Control.Feedback type="invalid">
                {errors.emailAddress}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentProfileFormPrimaryPhoneNumber">
              <RequiredFieldFormLabel>Primary phone number to contact you</RequiredFieldFormLabel>
              <Form.Control
                name='primaryPhoneNumber'
                onChange={handleChange}
                value={values.primaryPhoneNumber}
                isValid={touched.primaryPhoneNumber && !errors.primaryPhoneNumber && values.primaryPhoneNumber !== ''}
                isInvalid={touched.primaryPhoneNumber && !!errors.primaryPhoneNumber}
                readOnly={formReadOnly}
                disabled={formReadOnly}
              />
              <Form.Control.Feedback type="invalid">
                {errors.primaryPhoneNumber}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentProfileFormSecondaryPhoneNumber">
              <Form.Label>Backup phone to contact you</Form.Label>
              <Form.Control
                name='secondaryPhoneNumber'
                onChange={handleChange}
                value={values.secondaryPhoneNumber}
                isValid={touched.secondaryPhoneNumber && !errors.secondaryPhoneNumber && values.secondaryPhoneNumber !== ''}
                isInvalid={touched.secondaryPhoneNumber && !!errors.secondaryPhoneNumber}
                readOnly={formReadOnly}
                disabled={formReadOnly}
              />
              <Form.Control.Feedback type="invalid">
                {errors.secondaryPhoneNumber}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentProfileFormWechatId">
              <Form.Label>WeChat ID</Form.Label>
              <Form.Control
                name='wechatId'
                value={values.wechatId}
                onChange={handleChange}
                isValid={touched.wechatId && !errors.wechatId}
                isInvalid={touched.wechatId && !!errors.wechatId}
                readOnly={formReadOnly}
                disabled={formReadOnly}
              />
              <Form.Control.Feedback type="invalid">
                {errors.wechatId}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          { adminView ? 
            <Row className="mb-3">
              <Form.Group as={Col} controlId="studentProfileFormUserStatus">
                <RequiredFieldFormLabel>User Status</RequiredFieldFormLabel>
                <Form.Select
                  name='userStatus'
                  onChange={handleChange}
                  value={values.userStatus}
                  isValid={touched.userStatus && !errors.userStatus}
                  isInvalid={touched.userStatus && !!errors.userStatus}
                  readOnly={formReadOnly}
                  disabled={formReadOnly}
                >
                  {userStatusOptions.map((option) => (
                    <option key={option.value} value={option.value} label={option.label} />
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.userStatus}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
          : null }
        </Form>
      )}
    </Formik>
  );
};

export default VolunteerProfileForm;