import React, { useState } from 'react';
import { Row, Form, Col, Alert } from 'react-bootstrap';
import * as formik from 'formik';
import * as yup from 'yup';

const StudentCommentForm = ({ innerRef, onSubmit }) => {
  const { Formik } = formik;

  const initialValues = {
    comment: ''
  };

  const schema = yup.object().shape({
    comment: yup.string().max(500),
  });

  return (
    <Formik
      innerRef={innerRef}
      onSubmit={onSubmit}
      validationSchema={schema}
      initialValues={initialValues}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="studentCommentFormComment">
              <Form.Label>Do you have any comment or special needs (Maximum 500 characters):</Form.Label>
              <Alert variant='warning'>Please let us know if you already got VISA or NOT in the comment.</Alert>
              <Form.Control
                 as="textarea"
                 rows={3}
                name='comment'
                value={values.comment}
                onChange={handleChange}
                isValid={touched.comment && !errors.comment}
                isInvalid={touched.comment && !!errors.comment}
              />
              <Form.Control.Feedback type="invalid">
                {errors.comment}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default StudentCommentForm;