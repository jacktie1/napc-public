import React, { useState, useEffect, useMemo } from 'react';
import { Row, Form, Col, Alert } from 'react-bootstrap';
import RequiredFieldFormLabel from './RequiredFieldFormLabel'
import * as formik from 'formik';
import * as yup from 'yup';
import * as formUtils from '../utils/formUtils';


const StudentFlightInfoForm = ({ innerRef, onSubmit, optionReferences, loadedData, formReadOnly, adminView }) => {
  const { Formik } = formik;

  const [showHasFlightInfoQ, setShowHasFlightInfoQ] = useState(false);
  const [showUpdateFlightInfoAlert, setShowUpdateFlightInfoAlert] = useState(false);
  const [showFlightDetails, setShowFlightDetails] = useState(false);

  const emptyFormData = {
    needsAirportPickup: '',
    hasFlightInfo: '',
    arrivalFlightNumber: '',
    arrivalAirlineReferenceId: '',
    customArrivalAirline: '',
    arrivalDate: '',
    arrivalTime: '',
    departureFlightNumber: '',
    departureAirlineReferenceId: '',
    customDepartureAirline: '',
    departureDate: '',
    departureTime: '',
    numLgLuggages: '',
    numSmLuggages: '',
  };

  const [initialValues, setInitialValues] = useState(emptyFormData);

  const airlineOptions = useMemo(() => {
    let airlineOptionReferences = optionReferences.Airline ?? [];
    airlineOptionReferences = airlineOptionReferences.map((optionReference) => ({ id: optionReference.referenceId, value: optionReference.value }));
    return [{ id: '', value: "Select an option" }, ...airlineOptionReferences, { id: 'other', value: "Other" }];
  }, [optionReferences]);

  useEffect(() => {
    if(loadedData && typeof loadedData === 'object' && Object.keys(loadedData).length > 0) {
      let formData = formUtils.toStudentFlightInfoForm(loadedData);
      setInitialValues(formData);

      if (formData.needsAirportPickup === 'yes') {
        setShowHasFlightInfoQ(true);

        if (formData.hasFlightInfo === 'yes') {
          setShowFlightDetails(true);
          setShowUpdateFlightInfoAlert(false);
        } else if (formData.hasFlightInfo === 'no') {
          setShowFlightDetails(false);
          setShowUpdateFlightInfoAlert(true);
        }
      }
      else {
        setShowHasFlightInfoQ(false);
        setShowUpdateFlightInfoAlert(false);
        setShowFlightDetails(false);
      }
    }
  }, [loadedData, innerRef]);

  const allowedDaysAhead = 5; // Minimum number of days ahead for flight date
  const today = new Date();
  const minFlightDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + allowedDaysAhead);
  // Format the date as YYYY-MM-DD for the input field
  const minFlightDateString = adminView ? '' : minFlightDate.toISOString().split('T')[0];


  const requiredAlphaSpaceTest =  yup.string().required('Required!').matches(/^[a-zA-Z][a-zA-Z ]*$/, { message: 'Can only contain English letters and spaces!', excludeEmptyString: true });
  const requiredAlphaNumSpaceTest =  yup.string().required('Required!').matches(/^[a-zA-Z0-9 ]+$/, { message: 'Can only contain English letters, numbers and spaces!', excludeEmptyString: true });
  const requiredSelectTest = yup.string().required('Required!');
  const requiredDateTest = adminView ?
    yup.date().typeError('Must be a valid date!').required('Required!'):
    yup.date().typeError('Must be a valid date!').required('Required!').test('minDate', 'Must be at least 5 days from today!', function(value) {
      return value >= minFlightDate;
   });

  const requiredTimeTest = yup.string().required('Required!').matches(/^([01][0-9]|2[0-3]):([0-5][0-9])$/, { message: 'Must be a valid time!', excludeEmptyString: true });
  const requiredNonNegIntegerTest = yup.number().typeError('Must be a whole number!').integer('Must be a whole number!').min(0, 'Must be a non-negative number！').required('Required!');

  const schema = yup.object().shape({
    needsAirportPickup: requiredSelectTest,
    hasFlightInfo: yup.string().when('needsAirportPickup', {is: 'yes', then: () => requiredSelectTest}),
    arrivalFlightNumber: yup.string().when('hasFlightInfo', {is: 'yes', then: () => requiredAlphaNumSpaceTest}),
    arrivalAirlineReferenceId: yup.string().when('hasFlightInfo', {is: 'yes', then: () => requiredSelectTest}),
    customArrivalAirline: yup.string()
        .when(
            ['hasFlightInfo','arrivalAirlineReferenceId'], 
            {
                is: (hasFlightInfo, arrivalAirlineReferenceId) => hasFlightInfo === 'yes' && arrivalAirlineReferenceId === 'other',
                then: () => requiredAlphaSpaceTest.required('Required if no provided airline is selected!'),
            }),
    arrivalDate: yup.string().when('hasFlightInfo', {is: 'yes', then: () => requiredDateTest}),
    arrivalTime: yup.string().when('hasFlightInfo', {is: 'yes', then: () => requiredTimeTest}),
    departureAirlineReferenceId: yup.string().when('hasFlightInfo', {is: 'yes', then: () => requiredSelectTest}),
    departureFlightNumber: yup.string().when('hasFlightInfo', {is: 'yes', then: () => requiredAlphaNumSpaceTest}),
    customDepartureAirline: yup.string()
        .when(
            ['hasFlightInfo','departureAirlineReferenceId'], 
            {
                is: (hasFlightInfo, departureAirlineReferenceId) => hasFlightInfo === 'yes' && departureAirlineReferenceId === 'other',
                then: () => requiredAlphaSpaceTest.required('Required if no provided airline is selected!'),
            }),
    departureDate: yup.string().when('hasFlightInfo', {is: 'yes', then: () => requiredDateTest}),
    departureTime: yup.string().when('hasFlightInfo', {is: 'yes', then: () => requiredTimeTest}),
    numLgLuggages: yup.string().when('hasFlightInfo', {is: 'yes', then: () => requiredNonNegIntegerTest}),
    numSmLuggages: yup.string().when('hasFlightInfo', {is: 'yes', then: () => requiredNonNegIntegerTest}),
  });

  const yesOrNoOptions = [
    { value: '', label: "Select an option" },
    { value: 'yes', label: "Yes" },
    { value: 'no', label: "No" },
  ];

  const handleNeedsAirportPickupChange = (e, action) => {
    setShowHasFlightInfoQ(e.target.value === 'yes');
    setShowUpdateFlightInfoAlert(false);
    setShowFlightDetails(false);
    action({ ...emptyFormData, needsAirportPickup: e.target.value}); 
  };

  return (
    <Formik
      innerRef={innerRef}
      validationSchema={schema}
      onSubmit={onSubmit}
      initialValues={initialValues}
      enableReinitialize={true}
    >
      {({ handleSubmit, handleChange, setValues, setFieldValue, values, touched, errors }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="StudentFlightInfoFormNeedsAirportPickup">
              <RequiredFieldFormLabel>Do you need airport pickup</RequiredFieldFormLabel>
              <Form.Select
                name='needsAirportPickup'
                onChange={(e) => {handleChange(e); handleNeedsAirportPickupChange(e, setValues);}}
                value={values.needsAirportPickup}
                isValid={touched.needsAirportPickup && !errors.needsAirportPickup}
                isInvalid={touched.needsAirportPickup && !!errors.needsAirportPickup}
                disabled={formReadOnly}
              >
                {yesOrNoOptions.map((option) => (
                  <option key={option.value} value={option.value} label={option.label} />
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.needsAirportPickup}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          { showHasFlightInfoQ ?
            <Row className="mb-3">
            <Form.Group as={Col} controlId="StudentFlightInfoFormHasFlightInfo">
                <RequiredFieldFormLabel>Do you have the flight information?</RequiredFieldFormLabel>
                <Form.Select
                name='hasFlightInfo'
                onChange={(e) => {handleChange(e); setShowUpdateFlightInfoAlert(e.target.value === 'no'); setShowFlightDetails(e.target.value === 'yes')}}
                value={values.hasFlightInfo}
                isValid={touched.hasFlightInfo && !errors.hasFlightInfo}
                isInvalid={touched.hasFlightInfo && !!errors.hasFlightInfo}
                disabled={formReadOnly}
                >
                {yesOrNoOptions.map((option) => (
                    <option key={option.value} value={option.value} label={option.label} />
                ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                {errors.hasFlightInfo}
                </Form.Control.Feedback>
            </Form.Group> 
            </Row>
          : null }
          { showUpdateFlightInfoAlert && showHasFlightInfoQ ?
            <Alert variant='info'>
            Remember to update the flight information once you purchased the ticket.
            Airport pickup and temporary housing are based on the flight information, please provide accurate information as soon as possible.
            </Alert>
          : null }
          { showFlightDetails && showHasFlightInfoQ ? <>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="StudentFlightInfoFormArrivalFlightNumber">
                    <RequiredFieldFormLabel>Arriving Atlanta - Flight Number (such as KE033)</RequiredFieldFormLabel>
                    <Form.Control
                    name='arrivalFlightNumber'
                    value={values.arrivalFlightNumber}
                    onChange={handleChange}
                    isValid={touched.arrivalFlightNumber && !errors.arrivalFlightNumber}
                    isInvalid={touched.arrivalFlightNumber && !!errors.arrivalFlightNumber}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.arrivalFlightNumber}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="StudentFlightInfoFormArrivalAirlineReferenceId">
                <RequiredFieldFormLabel>Arriving Atlanta - Airline Name (Select 'Other' if not present)</RequiredFieldFormLabel>
                <Form.Select
                    name='arrivalAirlineReferenceId'
                    onChange={(e) => {setFieldValue('customArrivalAirline', ''); handleChange(e);}}
                    value={values.arrivalAirlineReferenceId}
                    isValid={touched.arrivalAirlineReferenceId && !errors.arrivalAirlineReferenceId}
                    isInvalid={touched.arrivalAirlineReferenceId && !!errors.arrivalAirlineReferenceId}
                    disabled={formReadOnly}
                >
                    {airlineOptions.map((option) => (
                    <option key={option.id} value={option.id} label={option.value} />
                    ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    {errors.arrivalAirlineReferenceId}
                </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="StudentFlightInfoFormCustomArrivalAirline">
                <Form.Label>If Other:</Form.Label>
                <Form.Control
                    name='customArrivalAirline'
                    value={values.customArrivalAirline}
                    onChange={(e) => {setFieldValue('arrivalAirlineReferenceId', 'other'); handleChange(e);}}
                    isValid={touched.customArrivalAirline && !errors.customArrivalAirline}
                    isInvalid={touched.customArrivalAirline && !!errors.customArrivalAirline}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                <Form.Control.Feedback type="invalid">
                    {errors.customArrivalAirline}
                </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="StudentFlightInfoFormArrivalDate">
                    <RequiredFieldFormLabel>Arriving Atlanta - Date</RequiredFieldFormLabel>
                    <Form.Control
                    type="date"
                    name='arrivalDate'
                    min={minFlightDateString}
                    value={values.arrivalDate}
                    onChange={handleChange}
                    isValid={touched.arrivalDate && !errors.arrivalDate}
                    isInvalid={touched.arrivalDate && !!errors.arrivalDate}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.arrivalDate}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="StudentFlightInfoFormArrivalTime">
                    <RequiredFieldFormLabel>Arriving Atlanta - Time</RequiredFieldFormLabel>
                    <Form.Control
                    type="time"
                    name='arrivalTime'
                    value={values.arrivalTime}
                    onChange={handleChange}
                    isValid={touched.arrivalTime && !errors.arrivalTime}
                    isInvalid={touched.arrivalTime && !!errors.arrivalTime}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.arrivalTime}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="StudentFlightInfoFormDepartureFlightNumber">
                    <RequiredFieldFormLabel>Leaving China - Flight Number (such as KE033)</RequiredFieldFormLabel>
                    <Form.Control
                    name='departureFlightNumber'
                    value={values.departureFlightNumber}
                    onChange={handleChange}
                    isValid={touched.departureFlightNumber && !errors.departureFlightNumber}
                    isInvalid={touched.departureFlightNumber && !!errors.departureFlightNumber}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.departureFlightNumber}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="StudentFlightInfoFormDepartureAirlineReferenceId">
                <RequiredFieldFormLabel>Leaving China - Airline Name (Select 'Other' if not present)</RequiredFieldFormLabel>
                <Form.Select
                    name='departureAirlineReferenceId'
                    onChange={(e) => {setFieldValue('customDepartureAirline', ''); handleChange(e);}}
                    value={values.departureAirlineReferenceId}
                    isValid={touched.departureAirlineReferenceId && !errors.departureAirlineReferenceId}
                    isInvalid={touched.departureAirlineReferenceId && !!errors.departureAirlineReferenceId}
                    disabled={formReadOnly}
                >
                    {airlineOptions.map((option) => (
                    <option key={option.id} value={option.id} label={option.value} />
                    ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    {errors.departureAirlineReferenceId}
                </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="StudentFlightInfoFormCustomDepartureAirline">
                <Form.Label>If Other:</Form.Label>
                <Form.Control
                    name='customDepartureAirline'
                    value={values.customDepartureAirline}
                    onChange={(e) => {setFieldValue('departureAirlineReferenceId', 'other'); handleChange(e);}}
                    isValid={touched.customDepartureAirline && !errors.customDepartureAirline}
                    isInvalid={touched.customDepartureAirline && !!errors.customDepartureAirline}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                <Form.Control.Feedback type="invalid">
                    {errors.customDepartureAirline}
                </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="StudentFlightInfoFormDepartureDate">
                    <RequiredFieldFormLabel>Leaving China - Date</RequiredFieldFormLabel>
                    <Form.Control
                    type="date"
                    name='departureDate'
                    min={minFlightDateString}
                    value={values.departureDate}
                    onChange={handleChange}
                    isValid={touched.departureDate && !errors.departureDate}
                    isInvalid={touched.departureDate && !!errors.departureDate}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.departureDate}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="StudentFlightInfoFormDepartureTime">
                    <RequiredFieldFormLabel>Leaving China - Time</RequiredFieldFormLabel>
                    <Form.Control
                    type="time"
                    name='departureTime'
                    value={values.departureTime}
                    onChange={handleChange}
                    isValid={touched.departureTime && !errors.departureTime}
                    isInvalid={touched.departureTime && !!errors.departureTime}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.departureTime}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="StudentFlightInfoFormNumLgLuggages">
                    <RequiredFieldFormLabel>How many piece of large luggage</RequiredFieldFormLabel>
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
                <Form.Group as={Col} controlId="StudentFlightInfoFormNumSmLuggages">
                    <RequiredFieldFormLabel>How many piece of small luggage</RequiredFieldFormLabel>
                    <Form.Control
                    type="number"
                    name='numSmLuggages'
                    value={values.numSmLuggages}
                    onChange={handleChange}
                    isValid={touched.numSmLuggages && !errors.numSmLuggages}
                    isInvalid={touched.numSmLuggages && !!errors.numSmLuggages}
                    readOnly={formReadOnly}
                    disabled={formReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.numSmLuggages}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
        </> : null}
        </Form>
      )}
    </Formik>
  );
};

export default StudentFlightInfoForm;