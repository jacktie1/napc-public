import React, { useState, useEffect } from 'react';
import { Row, Form, Col } from 'react-bootstrap';
import RequiredFieldFormLabel from './RequiredFieldFormLabel'
import * as formik from 'formik';
import * as yup from 'yup';

const VolunteerHousingCapacityForm = ({ innerRef, onSubmit, lazyLoadToggle, userId, formReadOnly }) => {
  const { Formik } = formik;

  const [showCapacityDetails, setShowCapacityDetails] = useState(false);

  useEffect(() => {
    if (
      userId !== undefined &&
      userId !== null &&
      ((lazyLoadToggle === undefined || lazyLoadToggle === null) || lazyLoadToggle) // either not passed in or true
      ) {
      innerRef.current.setValues({
        doesHousing: 'yes',
        homeAddress: '131 Mars St, Atlanta, GA, 30332',
        numStudents: '2',
        startDate: '2024-08-17',
        endDate: '2024-08-19',
        numDoubleBeds: '2',
        numSingleBeds: '2',
        studentGenderPreference: 'male',
        providesRide: 'yes',
        comment: 'Nothing special',
      });

      setShowCapacityDetails(true);
    }
  }, [lazyLoadToggle]);

  const initialValues = {
    doesHousing: '',
    homeAddress: '',
    numStudents: '',
    startDate: '',
    endDate: '',
    numDoubleBeds: '',
    numSingleBeds: '',
    studentGenderPreference: '',
    providesRide: '',
    comment: '',
  };

  const requiredAlphaNumSpaceTest =  yup.string().required('Required!').matches(/^[a-zA-Z0-9][a-zA-Z0-9, ]*$/, { message: 'Can only contain English letters, numbers, comma(,) and spaces!', excludeEmptyString: true });
  const capacityNumTest = yup.number().typeError('Must be a whole number!')
    .integer('Must be a whole number!')
    .min(0, 'Must be from 0-9')
    .max(9, 'Must be from 0-9');
  const optionalDateTest = yup.date().typeError('Must be a valid date!');
  const requiredSelectTest = yup.string().required('Required!');

  const schema = yup.object().shape({
    doesHousing: requiredSelectTest,
    homeAddress: yup.string().when('doesHousing', { is: 'yes', then: () => requiredAlphaNumSpaceTest}),
    numStudents: capacityNumTest,
    startDate: optionalDateTest,
    endDate: optionalDateTest.min(yup.ref('startDate'), "End time cannot be before start time"),
    numDoubleBeds: capacityNumTest,
    numSingleBeds: capacityNumTest,
    studentGenderPreference: '',
    comment: yup.string().max(500),
  });

  const yesOrNoOptions = [
    { value: '', label: "Select an option" },
    { value: 'yes', label: "Yes" },
    { value: 'no', label: "No" },
  ];

  const genderOptions = [
    { value: '', label: "Select an option" },
    { value: 'male', label: "Male" },
    { value: 'Female', label: "Female" },
    { value: 'noPref', label: "I don't have any preference" },

  ];

  const handleDoesHousingChange = (e, action) => {
    setShowCapacityDetails(e.target.value === 'yes');
    action({values: { ...initialValues, doesHousing: e.target.value}}); 
  }; 

  return (
    <Formik
      innerRef={innerRef}
      onSubmit={onSubmit}
      validationSchema={schema}
      initialValues={initialValues}
    >
      {({ handleSubmit, handleChange, resetForm, values, touched, errors }) => (

        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="VolunteerHousingCapacityFormDoesHousing">
              <RequiredFieldFormLabel>Are you willing to provide temporary housing?</RequiredFieldFormLabel>
              <Form.Select
                name='doesHousing'
                onChange={(e) => {handleChange(e); handleDoesHousingChange(e, resetForm);}}
                value={values.doesHousing}
                isValid={touched.doesHousing && !errors.doesHousing}
                isInvalid={touched.doesHousing && !!errors.doesHousing}
                disabled={formReadOnly}
              >
                {yesOrNoOptions.map((option) => (
                  <option key={option.value} value={option.value} label={option.label} />
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.doesHousing}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          { showCapacityDetails ? <>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="VolunteerHousingCapacityFormHomeAddress">
                <RequiredFieldFormLabel>If yes, what is your home address (please provide street with number, city, and zip)</RequiredFieldFormLabel>
                    <Form.Control
                    name='homeAddress'
                    value={values.homeAddress}
                    onChange={handleChange}
                    isValid={touched.homeAddress && !errors.homeAddress}
                    isInvalid={touched.homeAddress && !!errors.homeAddress}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.homeAddress}
                    </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="VolunteerHousingCapacityFormNumStudents">
                    <Form.Label>How many students could you host at the same time?</Form.Label>
                    <Form.Control
                    type="number"
                    name='numStudents'
                    value={values.numStudents}
                    onChange={handleChange}
                    isValid={touched.numStudents && !errors.numStudents}
                    isInvalid={touched.numStudents && !!errors.numStudents}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.numStudents}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="VolunteerHousingCapacityFormStartDate">
                    <Form.Label>Temp housing is available from date</Form.Label>
                    <Form.Control
                    type="date"
                    name='startDate'
                    value={values.startDate}
                    onChange={handleChange}
                    isValid={touched.startDate && !errors.startDate}
                    isInvalid={touched.startDate && !!errors.startDate}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.startDate}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="VolunteerHousingCapacityFormEndDate">
                    <Form.Label>Temp housing is available to date</Form.Label>
                    <Form.Control
                    type="date"
                    name='endDate'
                    value={values.endDate}
                    onChange={handleChange}
                    isValid={touched.endDate && !errors.endDate}
                    isInvalid={touched.endDate && !!errors.endDate}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.endDate}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="VolunteerHousingCapacityFormNumDoubleBeds">
                    <Form.Label>No. of double bed (use a number from 0 - 9)</Form.Label>
                    <Form.Control
                    type="number"
                    name='numDoubleBeds'
                    value={values.numDoubleBeds}
                    onChange={handleChange}
                    isValid={touched.numDoubleBeds && !errors.numDoubleBeds}
                    isInvalid={touched.numDoubleBeds && !!errors.numDoubleBeds}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.numDoubleBeds}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="VolunteerHousingCapacityFormNumSingleBeds">
                  <Form.Label>No. of single bed (use a number from 0 - 9)</Form.Label>
                  <Form.Control
                  type="number"
                  name='numSingleBeds'
                  value={values.numSingleBeds}
                  onChange={handleChange}
                  isValid={touched.numSingleBeds && !errors.numSingleBeds}
                  isInvalid={touched.numSingleBeds && !!errors.numSingleBeds}
                  readOnly={formReadOnly}
                  disabled={formReadOnly}
                  />
                  <Form.Control.Feedback type="invalid">
                  {errors.numSingleBeds}
                  </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="VolunteerHousingCapacityFormStudentGenderPreference">
                <Form.Label>Preference of male or female student</Form.Label>
                <Form.Select
                  name='studentGenderPreference'
                  onChange={handleChange}
                  value={values.studentGenderPreference}
                  isValid={touched.studentGenderPreference && !errors.studentGenderPreference}
                  isInvalid={touched.studentGenderPreference && !!errors.studentGenderPreference}
                  readOnly={formReadOnly}
                  disabled={formReadOnly}
                >
                  {genderOptions.map((option) => (
                    <option key={option.value} value={option.value} label={option.label} />
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.studentGenderPreference}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="VolunteerHousingCapacityFormProvidesRide">
                <Form.Label>Could you provide ride to and from campus for students?</Form.Label>
                <Form.Select
                  name='providesRide'
                  onChange={handleChange}
                  value={values.providesRide}
                  isValid={touched.providesRide && !errors.providesRide}
                  isInvalid={touched.providesRide && !!errors.providesRide}
                  disabled={formReadOnly}
                >
                  {yesOrNoOptions.map((option) => (
                    <option key={option.value} value={option.value} label={option.label} />
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.providesRide}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
          </>: null}
          <Row className="mb-3">
            <Form.Group as={Col} controlId="VolunteerHousingCapacityFormComment">
              <Form.Label>Do you have any comment or special needs (Maximum 500 characters):</Form.Label>
              <Form.Control
                 as="textarea"
                 rows={3}
                name='comment'
                value={values.comment}
                onChange={handleChange}
                isValid={touched.comment && !errors.comment}
                isInvalid={touched.comment && !!errors.comment}
                readOnly={formReadOnly}
                disabled={formReadOnly}
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

export default VolunteerHousingCapacityForm;