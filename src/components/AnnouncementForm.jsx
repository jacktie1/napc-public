import React, { useEffect } from 'react';
import { Row, Form, Col, Alert } from 'react-bootstrap';
import RequiredFieldFormLabel from './RequiredFieldFormLabel'
import * as formik from 'formik';
import * as yup from 'yup';
import * as formUtils from '../utils/formUtils';


const AnnouncementForm = ({ innerRef, onSubmit, loadedData }) => {
  const { Formik } = formik;

  useEffect(() => {
    if(loadedData && typeof loadedData === 'object' && Object.keys(loadedData).length > 0)
    {
      let formData = {
        doesAssignmentStart: formUtils.toYesOrNoOptionValue(loadedData.doesAssignmentStart),
        studentRegistrationStartDate: loadedData.studentRegistrationStartDate,
        studentRegistrationEndDate: loadedData.studentRegistrationEndDate,
        announcement: loadedData.announcement,
      }

      innerRef.current.setValues(formData);
    }
  }, [innerRef, loadedData]);

  const initialValues = {
    doesAssignmentStart: '',
    studentRegistrationStartDate: '',
    studentRegistrationEndDate: '',
    announcement: '',
  };

  const requiredSelectTest = yup.string().required('Required!');
  const requiredDateTest = yup.date().typeError('Must be a valid date!').required('Required!');
  const requiredNonEmptyTest = yup.string().required('Required!').test(
    'is-non-empty',
    'Cannot be empty!',
    (value) => value.trim() !== '',
)

  const schema = yup.object().shape({
    doesAssignmentStart: requiredSelectTest,
    studentRegistrationStartDate: requiredDateTest,
    studentRegistrationEndDate: requiredDateTest.min(yup.ref('studentRegistrationStartDate'), "End time cannot be before start time"),
    announcement: requiredNonEmptyTest,
  });


  const yesOrNoOptions = [
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
                <Form.Group as={Col} controlId="annoucementFormDoesAssignmentStart">
                    <Alert variant='warning'>
                        Note: After the Admin has decided which ones will be picked by WCF, 
                        Select "Start to Assign", and then "Submit" will make the rest of the pickup requests available for pick up volunteers to choose from.
                    </Alert>
                    <RequiredFieldFormLabel>
                        Start to Assign?
                    </RequiredFieldFormLabel>
                    <Form.Select
                    name='doesAssignmentStart'
                    onChange={handleChange}
                    value={values.doesAssignmentStart}
                    isValid={touched.doesAssignmentStart && !errors.doesAssignmentStart}
                    isInvalid={touched.doesAssignmentStart && !!errors.doesAssignmentStart}
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
                <Form.Group as={Col} controlId="annoucementFormStudentRegistrationStartDate">
                    <RequiredFieldFormLabel>Student Registration Start Date</RequiredFieldFormLabel>
                    <Form.Control
                    type="date"
                    name='studentRegistrationStartDate'
                    value={values.studentRegistrationStartDate}
                    onChange={handleChange}
                    isValid={touched.studentRegistrationStartDate && !errors.studentRegistrationStartDate}
                    isInvalid={touched.studentRegistrationStartDate && !!errors.studentRegistrationStartDate}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.studentRegistrationStartDate}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="annoucementFormStudentRegistrationEndDate">
                    <RequiredFieldFormLabel>Student Registration End Date</RequiredFieldFormLabel>
                    <Form.Control
                    type="date"
                    name='studentRegistrationEndDate'
                    value={values.studentRegistrationEndDate}
                    onChange={handleChange}
                    isValid={touched.studentRegistrationEndDate && !errors.studentRegistrationEndDate}
                    isInvalid={touched.studentRegistrationEndDate && !!errors.studentRegistrationEndDate}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.studentRegistrationEndDate}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
            <Form.Group as={Col} controlId="annoucementFormAnnouncement">
              <RequiredFieldFormLabel>Announcement Text</RequiredFieldFormLabel>
              <Form.Control
                as="textarea"
                rows={8}
                name='announcement'
                value={values.announcement}
                onChange={handleChange}
                isValid={touched.announcement && !errors.announcement}
                isInvalid={touched.announcement && !!errors.announcement}
              />
              <Form.Control.Feedback type="invalid">
                {errors.announcement}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default AnnouncementForm;