import React, { useState, useEffect } from 'react';
import { Row, Form, Col, Alert } from 'react-bootstrap';
import RequiredFieldFormLabel from './RequiredFieldFormLabel'
import * as formik from 'formik';
import * as yup from 'yup';

const PickupCapacityForm = ({ innerRef, onSubmit, lazyLoadToggle, userId, formReadOnly }) => {
  const { Formik } = formik;

  const [showCapacityDetails, setShowCapacityDetails] = useState(false);

  useEffect(() => {
    if (
      userId !== undefined &&
      userId !== null &&
      ((lazyLoadToggle === undefined || lazyLoadToggle === null) || lazyLoadToggle) // either not passed in or true
      ) {
      innerRef.current.setValues({
        doesPickup: 'yes',
        carManufacturer: 'Honda',
        carModel: 'Civic',
        numSeats: '4',
        numLgLuggages: '2',
        numTrips: '9',
        comment: 'Nothing'
      });

      setShowCapacityDetails(true);
    }
  }, [lazyLoadToggle]);

  const initialValues = {
    doesPickup: '',
    carManufacturer: '',
    carModel: '',
    numSeats: '',
    numLgLuggages: '',
    numTrips: '',
    comment: ''
  };

  const optionalAlphaSpaceTest =  yup.string().matches(/^[a-zA-Z][a-zA-Z ]*$/, { message: 'Can only contain English letters and spaces!', excludeEmptyString: true });
  const optionalAlphaNumSpaceTest =  yup.string().matches(/^[a-zA-Z0-9][a-zA-Z0-9 ]*$/, { message: 'Can only contain English letters and spaces!', excludeEmptyString: true });
  const capacityNumTest = yup.number().typeError('Must be a whole number!')
    .integer('Must be a whole number!')
    .min(0, 'Must be from 0-9')
    .max(9, 'Must be from 0-9');

  const requiredSelectTest = yup.string().required('Required!');

  const schema = yup.object().shape({
    doesPickup: requiredSelectTest,
    carManufacturer: optionalAlphaSpaceTest,
    carModel: optionalAlphaNumSpaceTest,
    numSeats: capacityNumTest,
    numLgLuggages: capacityNumTest,
    numTrips: capacityNumTest,
    comment: yup.string().max(500),
  });

  const yesOrNoOptions = [
    { value: '', label: "Select an option" },
    { value: 'yes', label: "Yes" },
    { value: 'no', label: "No" },
  ];

  const handleDoesPickupChange = (e, action) => {
    setShowCapacityDetails(e.target.value == 'yes');
    action({values: { ...initialValues, doesPickup: e.target.value}}); 
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
            <Form.Group as={Col} controlId="pickupCapacityFormDoesPickup">
              <RequiredFieldFormLabel>Are you willing to pick up students from the airport?</RequiredFieldFormLabel>
              <Form.Select
                name='doesPickup'
                onChange={(e) => {handleChange(e); handleDoesPickupChange(e, resetForm);}}
                value={values.doesPickup}
                isValid={touched.doesPickup && !errors.doesPickup}
                isInvalid={touched.doesPickup && !!errors.doesPickup}
                disabled={formReadOnly}
              >
                {yesOrNoOptions.map((option) => (
                  <option key={option.value} value={option.value} label={option.label} />
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.doesPickup}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          { showCapacityDetails ? <>
            <Row className="mb-3">
                <Form.Group md="8" as={Col} controlId="pickupCapacityFormCarManufacturer">
                    <Form.Label>What is the manufacture of you car?</Form.Label>
                    <Form.Control
                    name='carManufacturer'
                    value={values.carManufacturer}
                    onChange={handleChange}
                    isValid={touched.carManufacturer && !errors.carManufacturer}
                    isInvalid={touched.carManufacturer && !!errors.carManufacturer}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.carManufacturer}
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group md="4" as={Col} controlId="pickupCapacityFormCarModel">
                    <Form.Label>Car Model</Form.Label>
                    <Form.Control
                    name='carModel'
                    value={values.carModel}
                    onChange={handleChange}
                    isValid={touched.carModel && !errors.carModel}
                    isInvalid={touched.carModel && !!errors.carModel}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.carModel}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="pickupCapacityFormNumSeats">
                    <Form.Label>How many seats your car has (use a number from 0 - 9)</Form.Label>
                    <Form.Control
                    type="number"
                    name='numSeats'
                    value={values.numSeats}
                    onChange={handleChange}
                    isValid={touched.numSeats && !errors.numSeats}
                    isInvalid={touched.numSeats && !!errors.numSeats}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.numSeats}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="pickupCapacityFormNumLgLuggages">
                    <Form.Label>How many seats your car has (use a number from 0 - 9)</Form.Label>
                    <Form.Control
                    type="number"
                    name='numLgLuggages'
                    value={values.numLgLuggages}
                    onChange={handleChange}
                    isValid={touched.numLgLuggages && !errors.numLgLuggages}
                    isInvalid={touched.numLgLuggages && !!errors.numLgLuggages}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.numLgLuggages}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="pickupCapacityFormNumTrips">
                    <Form.Label>How many seats your car has (use a number from 0 - 9)</Form.Label>
                    <Form.Control
                    type="number"
                    name='numTrips'
                    value={values.numTrips}
                    onChange={handleChange}
                    isValid={touched.numTrips && !errors.numTrips}
                    isInvalid={touched.numTrips && !!errors.numTrips}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.numTrips}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
          </>: null}
          <Row className="mb-3">
            <Form.Group as={Col} controlId="pickupCapacityFormComment">
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

export default PickupCapacityForm;