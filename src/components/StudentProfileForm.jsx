import React from 'react';
import { Row, Form, Col} from 'react-bootstrap';
import RequiredFieldFormLabel from './RequiredFieldFormLabel'
import * as formik from 'formik';
import * as yup from 'yup';

const StudentProfileForm = ({ innerRef, onSubmit }) => {
  const { Formik } = formik;

  const initialValues = {
    firstName: '',
    lastName: '',
  };

  const nameTest = yup.string().required('Required!').matches(/^[a-zA-Z]+$/, { message: 'Can only contain English letters!', excludeEmptyString: true });

  const schema = yup.object().shape({
      firstName: nameTest,
      lastName: nameTest,
  });

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
            <Form.Group as={Col} md="6" controlId="firstName">
              <RequiredFieldFormLabel>First Name (名)</RequiredFieldFormLabel>
              <Form.Control
                type="text"
                name='firstName'
                placeholder="Enter first name"
                value={values.firstName}
                onChange={handleChange}
                isValid={touched.firstName && !errors.firstName}
                isInvalid={touched.firstName && !!errors.firstName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.firstName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="lastName">
              <RequiredFieldFormLabel>Last Name (姓)</RequiredFieldFormLabel>
              <Form.Control
                type="text"
                name='lastName'
                placeholder="Enter last name"
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
        </Form>
      )}
    </Formik>
  );
};

export default StudentProfileForm;