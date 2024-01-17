import React, { useState, useEffect } from 'react';
import { Row, Form, Col, Alert } from 'react-bootstrap';
import RequiredFieldFormLabel from './RequiredFieldFormLabel'
import * as formik from 'formik';
import * as yup from 'yup';

const AnnouncementForm = ({ innerRef, onSubmit }) => {
  const { Formik } = formik;

  useEffect(() => {
      innerRef.current.setValues({
        startsAssignment: 'yes',
        studentRegisterStartDate: '2024-01-01',
        studentRegisterEndDate: '2024-01-15',
        announcementText: 'This is the annoucement for the website',
      });
  }, [])

  const initialValues = {
    startsAssignment: '',
    studentRegisterStartDate: '',
    studentRegisterEndDate: '',
    announcementText: '',
  };

  const requiredSelectTest = yup.string().required('Required!');
  const requiredDateTest = yup.date().typeError('Must be a valid date!').required('Required!');

  const schema = yup.object().shape({
    startsAssignment: requiredSelectTest,
    studentRegisterStartDate: requiredDateTest,
    studentRegisterEndDate: requiredDateTest.min(yup.ref('studentRegisterStartDate'), "End time cannot be before start time"),
    announcementText: yup.string().required('Required!'),
  });


  const yesOrNoOptions = [
    { value: '', label: "Select an option" },
    { value: 'yes', label: "Yes - Start to assign" },
    { value: 'no', label: "No - Stop Assign" },
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
                <Form.Group as={Col} controlId="annoucementFormStartsAssignment">
                    <Alert variant='warning'>
                        Note: After the Admin has decided which ones will be picked by WCF, 
                        Select "Start to Assign", and then "Submit" will make the rest of the pickup requests available for pick up volunteers to choose from.
                    </Alert>
                    <RequiredFieldFormLabel>
                        Start to Assign?
                    </RequiredFieldFormLabel>
                    <Form.Select
                    name='startsAssignment'
                    onChange={handleChange}
                    value={values.startsAssignment}
                    isValid={touched.startsAssignment && !errors.startsAssignment}
                    isInvalid={touched.startsAssignment && !!errors.startsAssignment}
                    >
                    {yesOrNoOptions.map((option) => (
                        <option key={option.value} value={option.value} label={option.label} />
                    ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                    {errors.needsTempHousing}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="annoucementFormStudentRegisterStartDate">
                    <RequiredFieldFormLabel>Student Register Start Date</RequiredFieldFormLabel>
                    <Form.Control
                    type="date"
                    name='studentRegisterStartDate'
                    value={values.studentRegisterStartDate}
                    onChange={handleChange}
                    isValid={touched.studentRegisterStartDate && !errors.studentRegisterStartDate}
                    isInvalid={touched.studentRegisterStartDate && !!errors.studentRegisterStartDate}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.studentRegisterStartDate}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="annoucementFormStudentRegisterEndDate">
                    <RequiredFieldFormLabel>Student Register End Date</RequiredFieldFormLabel>
                    <Form.Control
                    type="date"
                    name='studentRegisterEndDate'
                    value={values.studentRegisterEndDate}
                    onChange={handleChange}
                    isValid={touched.studentRegisterEndDate && !errors.studentRegisterEndDate}
                    isInvalid={touched.studentRegisterEndDate && !!errors.studentRegisterEndDate}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.studentRegisterEndDate}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
            <Form.Group as={Col} controlId="annoucementFormAnnouncementText">
              <Form.Label>Announcement Text</Form.Label>
              <Form.Control
                 as="textarea"
                 rows={3}
                name='announcementText'
                value={values.announcementText}
                onChange={handleChange}
                isValid={touched.announcementText && !errors.announcementText}
                isInvalid={touched.announcementText && !!errors.announcementText}
              />
              <Form.Control.Feedback type="invalid">
                {errors.announcementText}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default AnnouncementForm;