import React, { useState, useEffect } from 'react';
import { Row, Form, Col } from 'react-bootstrap';
import RequiredFieldFormLabel from './RequiredFieldFormLabel'
import * as formik from 'formik';
import * as yup from 'yup';
import * as formUtils from '../utils/formUtils';

const VolunteerPickupCapacityForm = ({ innerRef, onSubmit, loadedData, formReadOnly }) => {
  const { Formik } = formik;

  const [showCapacityDetails, setShowCapacityDetails] = useState(false);

  const [initialValues, setInitialValues] = useState({
    providesAirportPickup: '',
    carManufacturer: '',
    carModel: '',
    numCarSeats: '',
    numMaxLgLuggages: '',
    numMaxTrips: '',
    airportPickupComment: ''
  });

  useEffect(() => {
    if(loadedData && typeof loadedData === 'object' && Object.keys(loadedData).length > 0)
    {
      let formData = formUtils.toVolunteerAirportPickupForm(loadedData);

      if(formData.providesAirportPickup === 'yes') {
        setShowCapacityDetails(true);
      }
      else {
        setShowCapacityDetails(false);
      }

      setInitialValues(formData);
    }
  }, [innerRef, loadedData]);

  const optionalAlphaSpaceTest =  yup.string().matches(/^[a-zA-Z][a-zA-Z ]*$/, { message: 'Can only contain English letters and spaces!', excludeEmptyString: true });
  const optionalAlphaNumSpaceTest =  yup.string().matches(/^[a-zA-Z0-9][a-zA-Z0-9 ]*$/, { message: 'Can only contain English letters and spaces!', excludeEmptyString: true });
  const capacityNumTest = yup.number().typeError('Must be a whole number!')
    .integer('Must be a whole number!')
    .min(0, 'Must be from 0-99')
    .max(99, 'Must be from 0-99');

  const requiredSelectTest = yup.string().required('Required!');

  const schema = yup.object().shape({
    providesAirportPickup: requiredSelectTest,
    carManufacturer: optionalAlphaSpaceTest,
    carModel: optionalAlphaNumSpaceTest,
    numCarSeats: capacityNumTest,
    numMaxLgLuggages: capacityNumTest,
    numMaxTrips: capacityNumTest,
    airportPickupComment: yup.string().max(500),
  });

  const yesOrNoOptions = [
    { value: '', label: "Select an option" },
    { value: 'yes', label: "Yes" },
    { value: 'no', label: "No" },
  ];

  const handleProvidesAirportPickupChange = (e, action) => {
    setShowCapacityDetails(e.target.value === 'yes');
    action({values: { ...initialValues, providesAirportPickup: e.target.value}}); 
  }; 

  return (
    <Formik
      innerRef={innerRef}
      onSubmit={onSubmit}
      validationSchema={schema}
      initialValues={initialValues}
      enableReinitialize={true}
    >
      {({ handleSubmit, handleChange, resetForm, values, touched, errors }) => (

        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="VolunteerPickupCapacityFormProvidesAirportPickup">
              <RequiredFieldFormLabel>Are you willing to pick up students from the airport?</RequiredFieldFormLabel>
              <Form.Select
                name='providesAirportPickup'
                onChange={(e) => {handleChange(e); handleProvidesAirportPickupChange(e, resetForm);}}
                value={values.providesAirportPickup}
                isValid={touched.providesAirportPickup && !errors.providesAirportPickup}
                isInvalid={touched.providesAirportPickup && !!errors.providesAirportPickup}
                disabled={formReadOnly}
              >
                {yesOrNoOptions.map((option) => (
                  <option key={option.value} value={option.value} label={option.label} />
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.providesAirportPickup}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          { showCapacityDetails ? <>
            <Row className="mb-3">
                <Form.Group md="8" as={Col} controlId="VolunteerPickupCapacityFormCarManufacturer">
                    <Form.Label>What is the manufacturer of you car?</Form.Label>
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
                <Form.Group md="4" as={Col} controlId="VolunteerPickupCapacityFormCarModel">
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
                <Form.Group as={Col} controlId="VolunteerPickupCapacityFormNumCarSeats">
                    <Form.Label>How many seats your car has (use a number from 0 - 99)</Form.Label>
                    <Form.Control
                    type="number"
                    name='numCarSeats'
                    value={values.numCarSeats}
                    onChange={handleChange}
                    isValid={touched.numCarSeats && !errors.numCarSeats}
                    isInvalid={touched.numCarSeats && !!errors.numCarSeats}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.numCarSeats}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="VolunteerPickupCapacityFormNumMaxLgLuggages">
                    <Form.Label>How many piece of big luggage your vehicle could handle (use a number from 0 - 99)</Form.Label>
                    <Form.Control
                    type="number"
                    name='numMaxLgLuggages'
                    value={values.numMaxLgLuggages}
                    onChange={handleChange}
                    isValid={touched.numMaxLgLuggages && !errors.numMaxLgLuggages}
                    isInvalid={touched.numMaxLgLuggages && !!errors.numMaxLgLuggages}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.numMaxLgLuggages}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="VolunteerPickupCapacityFormNumMaxTrips">
                    <Form.Label>How many trips to the airport you are willing to go (use a number from 0 - 99)</Form.Label>
                    <Form.Control
                    type="number"
                    name='numMaxTrips'
                    value={values.numMaxTrips}
                    onChange={handleChange}
                    isValid={touched.numMaxTrips && !errors.numMaxTrips}
                    isInvalid={touched.numMaxTrips && !!errors.numMaxTrips}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.numMaxTrips}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
          </>: null}
          <Row className="mb-3">
            <Form.Group as={Col} controlId="VolunteerPickupCapacityFormAirportPickupComment">
              <Form.Label>Do you have any comment or special needs (Maximum 500 characters):</Form.Label>
              <Form.Control
                 as="textarea"
                 rows={3}
                name='airportPickupComment'
                value={values.airportPickupComment}
                onChange={handleChange}
                isValid={touched.airportPickupComment && !errors.airportPickupComment}
                isInvalid={touched.airportPickupComment && !!errors.airportPickupComment}
                readOnly={formReadOnly}
                disabled={formReadOnly}
              />
              <Form.Control.Feedback type="invalid">
                {errors.airportPickupComment}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default VolunteerPickupCapacityForm;