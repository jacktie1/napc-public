import React, { useState } from 'react';
import { Row, Form, Col, Alert } from 'react-bootstrap';
import RequiredFieldFormLabel from './RequiredFieldFormLabel'
import * as formik from 'formik';
import * as yup from 'yup';

const FlightInfoForm = ({ innerRef, onSubmit }) => {
  const { Formik } = formik;

  const [showHasFlightInfoQ, setShowHasFlightInfoQ] = useState(false);
  const [showUpdateFlightInfoAlert, setShowUpdateFlightInfoAlert] = useState(false);
  const [showFlightDetails, setShowFlightDetails] = useState(false);

  const initialValues = {
    needsPickup: '',
    hasFlightInfo: '',
    arrivingFlightNum: '',
    arrivingFlightAirline: '',
    arrivingFlightAirlineOther: '',
    arrivingFlightDate: '',
    arrivingFlightTime: '',
    leavingFlightNum: '',
    leavingFlightAirline: '',
    leavingFlightAirlineOther: '',
    leavingFlightDate: '',
    leavingFlightTime: '',
    numLgLuggages: '',
    numSmLuggages: '',
  };

  const requiredAlphaNumTest = yup.string().required('Required!').matches(/^[a-zA-Z0-9]+$/, { message: 'Can only contain English letters and numbers!', excludeEmptyString: true });
  const requiredAlphaSpaceTest =  yup.string().required().matches(/^[a-zA-Z][a-zA-Z ]*$/, { message: 'Can only contain English letters and spaces!', excludeEmptyString: true });
  const requiredSelectTest = yup.string().required('Required!');
  const requiredDateTest = yup.date().typeError('Must be a valid date!').required('Required!');
  const requiredTimeTest = yup.string().required('Required!').matches(/^([01][0-9]|2[0-3]):([0-5][0-9])$/, { message: 'Must be a valid time!', excludeEmptyString: true });
  const requiredPosIntegerTest = yup.number().typeError('Must be a whole number!').integer('Must be a whole number!').min(0, 'Must be a positive number！').required('Required!');

  const schema = yup.object().shape({
    needsPickup: requiredSelectTest,
    hasFlightInfo: yup.string().when('needsPickup', {is: 'yes', then: () => requiredSelectTest}),
    arrivingFlightNum: yup.string().when('hasFlightInfo', {is: 'yes', then: () => requiredAlphaNumTest}),
    arrivingFlightAirline: yup.string().when('hasFlightInfo', {is: 'yes', then: () => requiredSelectTest}),
    arrivingFlightAirlineOther: yup.string()
        .when(
            ['hasFlightInfo','arrivingFlightAirline'], 
            {
                is: (hasFlightInfo, arrivingFlightAirline) => hasFlightInfo == 'yes' && arrivingFlightAirline == 'ot',
                then: () => requiredAlphaSpaceTest,
            }),
    arrivingFlightDate: yup.string().when('hasFlightInfo', {is: 'yes', then: () => requiredDateTest}),
    arrivingFlightTime: yup.string().when('hasFlightInfo', {is: 'yes', then: () => requiredTimeTest}),
    leavingFlightNum: yup.string().when('hasFlightInfo', {is: 'yes', then: () => requiredAlphaNumTest}),
    leavingFlightAirline: yup.string().when('hasFlightInfo', {is: 'yes', then: () => requiredSelectTest}),
    leavingFlightAirlineOther: yup.string()
        .when(
            ['hasFlightInfo','leavingFlightAirline'], 
            {
                is: (hasFlightInfo, leavingFlightAirline) => hasFlightInfo == 'yes' && leavingFlightAirline == 'ot',
                then: () => requiredAlphaSpaceTest,
            }),
    leavingFlightDate: yup.string().when('hasFlightInfo', {is: 'yes', then: () => requiredDateTest}),
    leavingFlightTime: yup.string().when('hasFlightInfo', {is: 'yes', then: () => requiredTimeTest}),
    numLgLuggages: yup.string().when('hasFlightInfo', {is: 'yes', then: () => requiredPosIntegerTest}),
    numSmLuggages: yup.string().when('hasFlightInfo', {is: 'yes', then: () => requiredPosIntegerTest}),
  });

  const yesOrNoOptions = [
    { value: '', label: "Select an option" },
    { value: 'yes', label: "Yes" },
    { value: 'no', label: "No" },
  ];

  const airlineOptions = [
    { value: '', label: "Select an option" },
    { value: 'dl', label: "Delta" },
    { value: 'ke', label: "Korean Airlines" },
    { value: 'ca', label: "Air China" },
    { value: 'cx', label: "Cathay Pacific Airways" },
    { value: 'ot', label: "Other (Please provide the name)"},
  ]

  const handleNeedsPickupChange = (e, action) => {
    setShowHasFlightInfoQ(e.target.value == 'yes');
    setShowUpdateFlightInfoAlert(false);
    setShowFlightDetails(false);
    action({values: { ...initialValues, needsPickup: e.target.value}}); 
  };

  return (
    <Formik
      innerRef={innerRef}
      validationSchema={schema}
      onSubmit={onSubmit}
      initialValues={initialValues}
    >
      {({ handleSubmit, handleChange, resetForm, values, touched, errors }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="flightInfoFormNeedsPickup">
              <RequiredFieldFormLabel>Do you need airport pickup</RequiredFieldFormLabel>
              <Form.Select
                name='needsPickup'
                onChange={(e) => {handleChange(e); handleNeedsPickupChange(e, resetForm);}}
                value={values.needsPickup}
                isValid={touched.needsPickup && !errors.needsPickup}
                isInvalid={touched.needsPickup && !!errors.needsPickup}
              >
                {yesOrNoOptions.map((option) => (
                  <option key={option.value} value={option.value} label={option.label} />
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.needsPickup}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          { showHasFlightInfoQ ?
            <Row className="mb-3">
            <Form.Group as={Col} controlId="flightInfoFormHasFlightInfo">
                <RequiredFieldFormLabel>Do you have the flight information?</RequiredFieldFormLabel>
                <Form.Select
                name='hasFlightInfo'
                onChange={(e) => {handleChange(e); setShowUpdateFlightInfoAlert(e.target.value == 'no'); setShowFlightDetails(e.target.value == 'yes')}}
                value={values.hasFlightInfo}
                isValid={touched.hasFlightInfo && !errors.hasFlightInfo}
                isInvalid={touched.hasFlightInfo && !!errors.hasFlightInfo}
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
                <Form.Group as={Col} controlId="flightInfoFormArrivingFlightNum">
                    <RequiredFieldFormLabel>Arriving Atlanta - Flight Number (such as KE033)</RequiredFieldFormLabel>
                    <Form.Control
                    name='arrivingFlightNum'
                    value={values.arrivingFlightNum}
                    onChange={handleChange}
                    isValid={touched.arrivingFlightNum && !errors.arrivingFlightNum}
                    isInvalid={touched.arrivingFlightNum && !!errors.arrivingFlightNum}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.arrivingFlightNum}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="flightInfoFormArrivingFlightAirline">
                <RequiredFieldFormLabel>Arriving Atlanta - Airline Name</RequiredFieldFormLabel>
                <Form.Select
                    name='arrivingFlightAirline'
                    onChange={handleChange}
                    value={values.arrivingFlightAirline}
                    isValid={touched.arrivingFlightAirline && !errors.arrivingFlightAirline}
                    isInvalid={touched.arrivingFlightAirline && !!errors.arrivingFlightAirline}
                >
                    {airlineOptions.map((option) => (
                    <option key={option.value} value={option.value} label={option.label} />
                    ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    {errors.arrivingFlightAirline}
                </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="flightInfoFormArrivingFlightAirlineOther">
                <Form.Label>If Other:</Form.Label>
                <Form.Control
                    name='arrivingFlightAirlineOther'
                    value={values.arrivingFlightAirlineOther}
                    onChange={handleChange}
                    isValid={touched.arrivingFlightAirlineOther && !errors.arrivingFlightAirlineOther}
                    isInvalid={touched.arrivingFlightAirlineOther && !!errors.arrivingFlightAirlineOther}
                    />
                <Form.Control.Feedback type="invalid">
                    {errors.arrivingFlightAirlineOther}
                </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="flightInfoFormArrivingFlightDate">
                    <RequiredFieldFormLabel>Arriving Atlanta - Date</RequiredFieldFormLabel>
                    <Form.Control
                    type="date"
                    name='arrivingFlightDate'
                    value={values.arrivingFlightDate}
                    onChange={handleChange}
                    isValid={touched.arrivingFlightDate && !errors.arrivingFlightDate}
                    isInvalid={touched.arrivingFlightDate && !!errors.arrivingFlightDate}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.arrivingFlightDate}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="flightInfoFormArrivingFlightTime">
                    <RequiredFieldFormLabel>Arriving Atlanta - Time</RequiredFieldFormLabel>
                    <Form.Control
                    type="time"
                    name='arrivingFlightTime'
                    value={values.arrivingFlightTime}
                    onChange={handleChange}
                    isValid={touched.arrivingFlightTime && !errors.arrivingFlightTime}
                    isInvalid={touched.arrivingFlightTime && !!errors.arrivingFlightTime}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.arrivingFlightTime}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="flightInfoFormLeavingFlightNum">
                    <RequiredFieldFormLabel>Leaving China - Flight Number (such as KE033)</RequiredFieldFormLabel>
                    <Form.Control
                    name='leavingFlightNum'
                    value={values.leavingFlightNum}
                    onChange={handleChange}
                    isValid={touched.leavingFlightNum && !errors.leavingFlightNum}
                    isInvalid={touched.leavingFlightNum && !!errors.leavingFlightNum}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.leavingFlightNum}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="flightInfoFormLeavingFlightAirline">
                <RequiredFieldFormLabel>Leaving China - Airline Name</RequiredFieldFormLabel>
                <Form.Select
                    name='leavingFlightAirline'
                    onChange={handleChange}
                    value={values.leavingFlightAirline}
                    isValid={touched.leavingFlightAirline && !errors.leavingFlightAirline}
                    isInvalid={touched.leavingFlightAirline && !!errors.leavingFlightAirline}
                >
                    {airlineOptions.map((option) => (
                    <option key={option.value} value={option.value} label={option.label} />
                    ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    {errors.leavingFlightAirline}
                </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="flightInfoFormLeavingFlightAirlineOther">
                <Form.Label>If Other:</Form.Label>
                <Form.Control
                    name='leavingFlightAirlineOther'
                    value={values.leavingFlightAirlineOther}
                    onChange={handleChange}
                    isValid={touched.leavingFlightAirlineOther && !errors.leavingFlightAirlineOther}
                    isInvalid={touched.leavingFlightAirlineOther && !!errors.leavingFlightAirlineOther}
                    />
                <Form.Control.Feedback type="invalid">
                    {errors.leavingFlightAirlineOther}
                </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="flightInfoFormLeavingFlightDate">
                    <RequiredFieldFormLabel>Leaving China - Date</RequiredFieldFormLabel>
                    <Form.Control
                    type="date"
                    name='leavingFlightDate'
                    value={values.leavingFlightDate}
                    onChange={handleChange}
                    isValid={touched.leavingFlightDate && !errors.leavingFlightDate}
                    isInvalid={touched.leavingFlightDate && !!errors.leavingFlightDate}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.leavingFlightDate}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="flightInfoFormLeavingFlightTime">
                    <RequiredFieldFormLabel>Leaving China - Time</RequiredFieldFormLabel>
                    <Form.Control
                    type="time"
                    name='leavingFlightTime'
                    value={values.leavingFlightTime}
                    onChange={handleChange}
                    isValid={touched.leavingFlightTime && !errors.leavingFlightTime}
                    isInvalid={touched.leavingFlightTime && !!errors.leavingFlightTime}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.leavingFlightTime}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="flightInfoFormNumLgLuggages">
                    <RequiredFieldFormLabel>How many piece of large luggage</RequiredFieldFormLabel>
                    <Form.Control
                    type="number"
                    name='numLgLuggages'
                    value={values.numLgLuggages}
                    onChange={handleChange}
                    isValid={touched.numLgLuggages && !errors.numLgLuggages}
                    isInvalid={touched.numLgLuggages && !!errors.numLgLuggages}
                    />
                    <Form.Control.Feedback type="invalid">
                    {errors.numLgLuggages}
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="flightInfoFormNumSmLuggages">
                    <RequiredFieldFormLabel>How many piece of small luggage</RequiredFieldFormLabel>
                    <Form.Control
                    type="number"
                    name='numSmLuggages'
                    value={values.numSmLuggages}
                    onChange={handleChange}
                    isValid={touched.numSmLuggages && !errors.numSmLuggages}
                    isInvalid={touched.numSmLuggages && !!errors.numSmLuggages}
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

export default FlightInfoForm;