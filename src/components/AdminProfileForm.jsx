import React, { useEffect } from 'react';
import { Row, Form, Col} from 'react-bootstrap';
import RequiredFieldFormLabel from './RequiredFieldFormLabel'
import * as formik from 'formik';
import * as yup from 'yup';
import * as formUtils from '../utils/formUtils';


const AdminProfileForm = ({ innerRef, onSubmit, loadedData }) => {
  const { Formik } = formik;

  useEffect(() => {
    if(loadedData && typeof loadedData === 'object' && Object.keys(loadedData).length > 0)
    {
      let formData = {
        firstName: loadedData.firstName,
        lastName: loadedData.lastName,
        gender: formUtils.toGenderOptionValue( loadedData.gender ),
        affiliation: loadedData.affiliation,
        emailAddress: loadedData.emailAddress,
        primaryPhoneNumber: loadedData.primaryPhoneNumber,
      }

      innerRef.current.setValues(formData);
    }
  }, [innerRef, loadedData]);

  const initialValues = {
    firstName: '',
    lastName: '',
    gender: '',
    affiliation: '',
    emailAddress: '',
    primaryPhoneNumber: '',
  }

  const requiredAlphaTest = yup.string().required('Required!').matches(/^[a-zA-Z]+$/, { message: 'Can only contain English letters!', excludeEmptyString: true });
  const requiredAlphaSpaceTest =  yup.string().required('Required!').matches(/^[a-zA-Z][a-zA-Z ]*$/, { message: 'Can only contain English letters and spaces!', excludeEmptyString: true });
  const requiredSelectTest = yup.string().required('Required!');
  const emailAddressTest = yup.string().email('Must be a valid email address').required('Required!');
  const phoneNumberTest = yup.string()
    .min(8, 'Too Short!')
    .matches( /^[0-9\+\-\(\) ]*$/, 'Must be a valid phone number' );

  const schema = yup.object().shape({
      firstName: requiredAlphaTest,
      lastName: requiredAlphaTest,
      gender: requiredSelectTest,
      affiliation: requiredAlphaSpaceTest,
      emailAddress: emailAddressTest,
      primaryPhoneNumber: phoneNumberTest.required('Required!'),
  });

  const genderOptions = [
    { value: '', label: "Select an option" },
    { value: 'male', label: "Male" },
    { value: 'female', label: "Female" },
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
              <RequiredFieldFormLabel>Gender</RequiredFieldFormLabel>
              <Form.Select
                name='gender'
                onChange={handleChange}
                value={values.gender}
                isValid={touched.gender && !errors.gender}
                isInvalid={touched.gender && !!errors.gender}
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
        </Form>
      )}
    </Formik>
  );
};

export default AdminProfileForm;