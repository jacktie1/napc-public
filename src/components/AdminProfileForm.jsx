import React, { useEffect } from 'react';
import { Row, Form, Col} from 'react-bootstrap';
import RequiredFieldFormLabel from './RequiredFieldFormLabel'
import * as formik from 'formik';
import * as yup from 'yup';

const AdminProfileForm = ({ innerRef, onSubmit, userId }) => {
  const { Formik } = formik;

  useEffect(() => {
    if (userId !== undefined && userId !== null) {
      innerRef.current.setValues({
        firstName: 'Jason',
        lastName: 'Chen',
        sex: 'male',
        affiliation: 'Neal Hightower',
        emailAddress: 'test@gmail.com',
        primaryPhoneNumber: '2212221233',
        username: 'admin',
        password: 'testPassword!123',
        confirmPassword: 'testPassword!123',
      });
    }
  }, []);

  const initialValues = {
    firstName: '',
    lastName: '',
    sex: '',
    affiliation: '',
    emailAddress: '',
    primaryPhoneNumber: '',
    username: '',
    password: '',
    confirmPassword: '',
  }

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

  const schema = yup.object().shape({
      firstName: requiredAlphaTest,
      lastName: requiredAlphaTest,
      sex: requiredSelectTest,
      affiliation: requiredAlphaSpaceTest,
      emailAddress: emailAddressTest,
      primaryPhoneNumber: phoneNumberTest.required('Required!'),
      username: requiredAlphaNumTest,
      password: strongPasswordTest,
      confirmPassword: confirmPasswordTest,
  });

  const sexOptions = [
    { value: '', label: "Select an option" },
    { value: 'male', label: "Male" },
    { value: 'Female', label: "Female" },
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
              />
              <Form.Control.Feedback type="invalid">
                {errors.lastName}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentProfileFormGender">
              <RequiredFieldFormLabel>Sex</RequiredFieldFormLabel>
              <Form.Select
                name='sex'
                onChange={handleChange}
                value={values.sex}
                isValid={touched.sex && !errors.sex}
                isInvalid={touched.sex && !!errors.sex}
              >
                {sexOptions.map((option) => (
                  <option key={option.value} value={option.value} label={option.label} />
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.sex}
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
              />
              <Form.Control.Feedback type="invalid">
                {errors.primaryPhoneNumber}
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
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default AdminProfileForm;