import React, { useEffect } from 'react';
import { Row, Form, Col} from 'react-bootstrap';
import RequiredFieldFormLabel from './RequiredFieldFormLabel'
import * as formik from 'formik';
import * as yup from 'yup';

const VolunteerProfileForm = ({ innerRef, onSubmit, lazyLoadToggle, userId, formReadOnly, adminView }) => {
  const { Formik } = formik;

  useEffect(() => {
    if (
      userId !== undefined &&
      userId !== null &&
      ((lazyLoadToggle === undefined || lazyLoadToggle === null) || lazyLoadToggle) // either not passed in or true
      ) {
      if(adminView)
      {
        innerRef.current.setValues({
          firstName: 'Jason',
          lastName: 'Chen',
          gender: 'male',
          affiliation: 'Neal Hightower',
          emailAddress: 'test@gmail.com',
          weChatId: 'aaqqq1111',
          primaryPhoneNumber: '2212221233',
          secondaryPhoneNumber: '',
          username: 'volunteer',
          password: 'testPassword!123',
          confirmPassword: 'testPassword!123',
          enabled: 'enabled',
        });
      }
      else
      {
        innerRef.current.setValues({
          firstName: 'Jason',
          lastName: 'Chen',
          gender: 'male',
          affiliation: 'Neal Hightower',
          emailAddress: 'test@gmail.com',
          weChatId: 'aaqqq1111',
          primaryPhoneNumber: '2212221233',
          secondaryPhoneNumber: '',
          username: 'volunteer',
          password: 'testPassword!123',
          confirmPassword: 'testPassword!123',
        });
      }
    }
  }, [lazyLoadToggle]);


  const initialValues = adminView ? {
    firstName: '',
    lastName: '',
    gender: '',
    affiliation: '',
    emailAddress: '',
    weChatId: '',
    primaryPhoneNumber: '',
    secondaryPhoneNumber: '',
    username: '',
    password: '',
    confirmPassword: '',
  } : {
    firstName: '',
    lastName: '',
    gender: '',
    affiliation: '',
    emailAddress: '',
    weChatId: '',
    primaryPhoneNumber: '',
    secondaryPhoneNumber: '',
    username: '',
    password: '',
    confirmPassword: '',
    enabled: '',
  };

  const requiredAlphaTest = yup.string().required('Required!').matches(/^[a-zA-Z]+$/, { message: 'Can only contain English letters!', excludeEmptyString: true });
  const requiredAlphaNumTest = yup.string().required('Required!').matches(/^[a-zA-Z0-9]+$/, { message: 'Can only contain English letters and numbers!', excludeEmptyString: true });
  const requiredAlphaSpaceTest =  yup.string().required('Required!').matches(/^[a-zA-Z][a-zA-Z ]*$/, { message: 'Can only contain English letters and spaces!', excludeEmptyString: true });
  const optionalNoSpaceTest = yup.string().matches(/^[^ ]+$/, { message: 'Cannot contain any space!', excludeEmptyString: true });
  const requiredSelectTest = yup.string().required('Required!');
  const emailAddressTest = yup.string().email('Must be a valid email address').required('Required!');
  const phoneNumberTest = yup.string()
    .min(8, 'Too Short!')
    .matches( /^[0-9\+\-\(\) ]*$/, 'Must be a valid phone number' );
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

  const schema = adminView ? yup.object().shape({
      firstName: requiredAlphaTest,
      lastName: requiredAlphaTest,
      gender: requiredSelectTest,
      affiliation: requiredAlphaSpaceTest,
      emailAddress: emailAddressTest,
      weChatId: optionalNoSpaceTest,
      primaryPhoneNumber: phoneNumberTest.required('Required!'),
      secondaryPhoneNumber: phoneNumberTest,
      username: requiredAlphaNumTest,
      password: strongPasswordTest,
      confirmPassword: confirmPasswordTest,
  }) : yup.object().shape({
    firstName: requiredAlphaTest,
    lastName: requiredAlphaTest,
    gender: requiredSelectTest,
    affiliation: requiredAlphaSpaceTest,
    emailAddress: emailAddressTest,
    weChatId: optionalNoSpaceTest,
    primaryPhoneNumber: phoneNumberTest.required('Required!'),
    secondaryPhoneNumber: phoneNumberTest,
    username: requiredAlphaNumTest,
    password: strongPasswordTest,
    confirmPassword: confirmPasswordTest,
    enabled: requiredSelectTest,
});

  const genderOptions = [
    { value: '', label: "Select an option" },
    { value: 'male', label: "Male" },
    { value: 'Female', label: "Female" },
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
            <Form.Group as={Col} controlId="studentProfileFormWeChatId">
              <Form.Label>WeChat ID</Form.Label>
              <Form.Control
                name='weChatId'
                value={values.weChatId}
                onChange={handleChange}
                isValid={touched.weChatId && !errors.weChatId}
                isInvalid={touched.weChatId && !!errors.weChatId}
                readOnly={formReadOnly}
                disabled={formReadOnly}
              />
              <Form.Control.Feedback type="invalid">
                {errors.weChatId}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentProfileFormUsername">
              <RequiredFieldFormLabel>Username</RequiredFieldFormLabel>
              <Form.Control
                name='username'
                value={values.username}
                onChange={handleChange}
                isValid={touched.username && !errors.username}
                isInvalid={touched.username && !!errors.username}
                readOnly={formReadOnly}
                disabled={formReadOnly}
              />
              <Form.Control.Feedback type="invalid">
                {errors.username}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentProfileFormPassword">
              <RequiredFieldFormLabel>Password</RequiredFieldFormLabel>
              <Form.Control
                name='password'
                type='password'
                value={values.password}
                onChange={handleChange}
                isValid={touched.password && !errors.password}
                isInvalid={touched.password && !!errors.password}
                readOnly={formReadOnly}
                disabled={formReadOnly}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentProfileFormConfirmPassword">
              <RequiredFieldFormLabel>Confirm Password</RequiredFieldFormLabel>
              <Form.Control
                name='confirmPassword'
                type='password'
                value={values.confirmPassword}
                onChange={handleChange}
                isValid={touched.confirmPassword && !errors.confirmPassword}
                isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                readOnly={formReadOnly}
                disabled={formReadOnly}
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
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