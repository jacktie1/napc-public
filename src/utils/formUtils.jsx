// fromXXXValue: convert form data to db data
// toXXXValue: convert db data to form data

export const fromYesOrNoOptionValue = (optionValue)=> {
    if (optionValue === 'yes'){
        return true;
    } else if (optionValue === 'no'){
        return false;
    } else {
        return null;
    }
}

export const toYesOrNoOptionValue = (dbValue)=> {
    if (dbValue === true){
        return 'yes';
    } else if (dbValue === false){
        return 'no';
    } else {
        return '';
    }
}

export const fromReferenceIdOptionValue = (optionValue)=> {
    if (optionValue === ''){
        return null;
    } else if (optionValue === 'other'){
        return null;
    }
    else {
        return parseInt(optionValue, 10);
    }
}

export const toReferenceIdOptionValue = (dbValue, emtpyOnNullValue)=> {
    if (dbValue === null){
        if(emtpyOnNullValue){
            return '';
        }

        return 'other';
    } else {
        return dbValue;
    }
}

export const fromGenderOptionValue = (optionValue)=> {
    if (optionValue === 'male'){
        return 'Male';
    }
    else if (optionValue === 'female'){
        return 'Female';
    }
    else if (optionValue === 'noPref'){
        return 'No Preference';
    }
    else {
        return null;
    }
};

export const toGenderOptionValue = (dbValue)=> {
    if (dbValue === 'Male'){
        return 'male';
    }
    else if (dbValue === 'Female'){
        return 'female';
    }
    else if (dbValue === 'No Preference'){
        return 'noPref';
    }
    else {
        return '';
    }
};

export const fromStudentTypeValue = (optionValue)=> {
    if (optionValue === 'undergrad'){
        return 'Undergraduate Student';
    }
    else if (optionValue === 'grad'){
        return 'Graduate Student';
    }
    else if (optionValue === 'visiting'){
        return 'Visiting Scholar';
    }
    else if (optionValue === 'other'){
        return 'Other';
    }
    else {
        return null;
    }
}

export const toStudentTypeValue = (dbValue)=> {
    if (dbValue === 'Undergraduate Student'){
        return 'undergrad';
    }
    else if (dbValue === 'Graduate Student'){
        return 'grad';
    }
    else if (dbValue === 'Visiting Scholar'){
        return 'visiting';
    }
    else if (dbValue === 'Other'){
        return 'other';
    }
    else {
        return '';
    }
}

export const fromUserStatusOptionValue = (optionValue)=> {
    if (optionValue === 'enabled'){
        return true;
    } else if (optionValue === 'disabled'){
        return false;
    } else {
        return null;
    }
}

export const toUserStatusOptionValue = (dbValue)=> {
    if (dbValue === true){
        return 'enabled';
    } else if (dbValue === false){
        return 'disabled';
    } else {
        return '';
    }
}

export const fromCustomOptionValue = (optionValue, dependency, returnOnEmptyDependency)=> {
    // 'other' selected, custom value will be used
    if(dependency === 'other'){
        return optionValue;
    }

    // if we want to return the option value even if the dependency is empty and the dependency is empty
    if(returnOnEmptyDependency && dependency === ''){
        return optionValue;
    }

    return null;
};

export const fromOptionalTextValue = (textValue)=> {
    if (textValue === ''){
        return null;
    } else {
        return textValue;
    }
}

export const toOptionalTextValue = (dbValue)=> {
    if (dbValue === null){
        return '';
    } else {
        return dbValue;
    }
}


// Form <=> DB data conversion functions
export const fromUserAccountForm = (formData)=> {
    let preparedUserAccount = {
        username: formData.username,
    };

    // password field should be updated only if it is not empty
    if(formData.password !== ''){
        preparedUserAccount.password = formData.password;
    }

    // if security question and answer fields are present, they should be updated
    if('securityQuestionReferenceId1' in formData && 'securityAnswer1' in formData){
        preparedUserAccount.securityQuestionReferenceId1 = fromReferenceIdOptionValue(formData.securityQuestionReferenceId1);
        preparedUserAccount.securityAnswer1 = formData.securityAnswer1;
    }

    if('securityQuestionReferenceId2' in formData && 'securityAnswer2' in formData){
        preparedUserAccount.securityQuestionReferenceId2 = fromReferenceIdOptionValue(formData.securityQuestionReferenceId2);
        preparedUserAccount.securityAnswer2 = formData.securityAnswer2;
    }

    if('securityQuestionReferenceId3' in formData && 'securityAnswer3' in formData){
        preparedUserAccount.securityQuestionReferenceId3 = fromReferenceIdOptionValue(formData.securityQuestionReferenceId3);
        preparedUserAccount.securityAnswer3 = formData.securityAnswer3;
    }

    return preparedUserAccount;
}

export const toUserAccountForm = (dbData)=> {
    let formData = {
        username: dbData.username,
        password: '', // password should not be shown
        confirmPassword: '' // password should not be shown
    };

    // if security question and answer fields are present, they should be updated
    if('securityQuestionReferenceId1' in dbData && 'securityAnswer1' in dbData){
        formData.securityQuestionReferenceId1 = toReferenceIdOptionValue(dbData.securityQuestionReferenceId1);
        formData.securityAnswer1 = ''; // security answer should not be shown
    }

    if('securityQuestionReferenceId2' in dbData && 'securityAnswer2' in dbData){
        formData.securityQuestionReferenceId2 = toReferenceIdOptionValue(dbData.securityQuestionReferenceId2);
        formData.securityAnswer2 = ''; // security answer should not be shown
    }

    if('securityQuestionReferenceId3' in dbData && 'securityAnswer3' in dbData){
        formData.securityQuestionReferenceId3 = toReferenceIdOptionValue(dbData.securityQuestionReferenceId3);
        formData.securityAnswer3 = ''; // security answer should not be shown
    }

    return formData;
}

export const fromUserSecurityQustionsForm = (formData)=> {
    let preparedUserSecurityQuestions = {
    };

    // if security question and answer fields are present, they should be updated
    if('securityQuestionReferenceId1' in formData && 'securityAnswer1' in formData){
        preparedUserSecurityQuestions.securityQuestionReferenceId1 = fromReferenceIdOptionValue(formData.securityQuestionReferenceId1);
        preparedUserSecurityQuestions.securityAnswer1 = formData.securityAnswer1;
    }

    if('securityQuestionReferenceId2' in formData && 'securityAnswer2' in formData){
        preparedUserSecurityQuestions.securityQuestionReferenceId2 = fromReferenceIdOptionValue(formData.securityQuestionReferenceId2);
        preparedUserSecurityQuestions.securityAnswer2 = formData.securityAnswer2;
    }

    if('securityQuestionReferenceId3' in formData && 'securityAnswer3' in formData){
        preparedUserSecurityQuestions.securityQuestionReferenceId3 = fromReferenceIdOptionValue(formData.securityQuestionReferenceId3);
        preparedUserSecurityQuestions.securityAnswer3 = formData.securityAnswer3;
    }

    return preparedUserSecurityQuestions;
}

export const fromStudentProfileForm = (formData)=> {
    let preparedStudentProfile = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        englishName: fromOptionalTextValue(formData.englishName),
        gender: fromGenderOptionValue(formData.gender),
        isNewStudent: fromYesOrNoOptionValue(formData.isNewStudent),
        graduatesFrom: fromOptionalTextValue(formData.graduatesFrom),
        studentType: fromStudentTypeValue(formData.studentType),
        majorReferenceId: fromReferenceIdOptionValue(formData.majorReferenceId),
        customMajor: fromCustomOptionValue(formData.customMajor, formData.majorReferenceId),
        hasCompanion: fromYesOrNoOptionValue(formData.hasCompanion),
        emailAddress: formData.emailAddress,
        wechatId: formData.wechatId,
        cnPhoneNumber: fromOptionalTextValue(formData.cnPhoneNumber),
        usPhoneNumber: fromOptionalTextValue(formData.usPhoneNumber),
        attendsWeekOfWelcome: fromYesOrNoOptionValue(formData.attendsWeekOfWelcome),
    };

    return preparedStudentProfile;
}

export const toStudentProfileForm = (dbData)=> {
    let formData = {
        firstName: dbData.firstName,
        lastName: dbData.lastName,
        englishName: toOptionalTextValue(dbData.englishName),
        gender: toGenderOptionValue(dbData.gender),
        isNewStudent: toYesOrNoOptionValue(dbData.isNewStudent),
        studentType: toStudentTypeValue(dbData.studentType),
        graduatesFrom: toOptionalTextValue(dbData.graduatesFrom),
        majorReferenceId: toReferenceIdOptionValue(dbData.majorReferenceId),
        customMajor: toOptionalTextValue(dbData.customMajor),
        hasCompanion: toYesOrNoOptionValue(dbData.hasCompanion),
        emailAddress: dbData.emailAddress,
        wechatId: dbData.wechatId,
        cnPhoneNumber: toOptionalTextValue(dbData.cnPhoneNumber),
        usPhoneNumber: toOptionalTextValue(dbData.usPhoneNumber),
        attendsWeekOfWelcome: toYesOrNoOptionValue(dbData.attendsWeekOfWelcome),
    }

    return formData;
}

export const fromStudentFlightInfoForm = (formData)=> {
    let preparedFlightInfo = {
        needsAirportPickup: fromYesOrNoOptionValue(formData.needsAirportPickup),
        hasFlightInfo: null,
        arrivalFlightNumber: null,
        arrivalAirlineReferenceId: null,
        customArrivalAirline: null,
        arrivalDatetime: null,
        departureFlightNumber: null,
        departureAirlineReferenceId: null,
        customDepartureAirline: null,
        departureDatetime: null,
        numLgLuggages: null,
        numSmLuggages: null,
    };

    if(preparedFlightInfo.needsAirportPickup)
    {
        preparedFlightInfo.hasFlightInfo = fromYesOrNoOptionValue(formData.hasFlightInfo);
    }

    if(preparedFlightInfo.hasFlightInfo)
    {
        preparedFlightInfo.arrivalFlightNumber = formData.arrivalFlightNumber;
        preparedFlightInfo.arrivalAirlineReferenceId = fromReferenceIdOptionValue(formData.arrivalAirlineReferenceId);
        preparedFlightInfo.customArrivalAirline = fromCustomOptionValue(formData.customArrivalAirline, formData.arrivalAirlineReferenceId);
        preparedFlightInfo.arrivalDatetime = formData.arrivalDate + ' ' + formData.arrivalTime;
        preparedFlightInfo.departureFlightNumber = formData.departureFlightNumber;
        preparedFlightInfo.departureAirlineReferenceId = fromReferenceIdOptionValue(formData.departureAirlineReferenceId);
        preparedFlightInfo.customDepartureAirline = fromCustomOptionValue(formData.customDepartureAirline, formData.departureAirlineReferenceId);
        preparedFlightInfo.departureDatetime = formData.departureDate + ' ' + formData.departureTime;
        preparedFlightInfo.numLgLuggages = formData.numLgLuggages;
        preparedFlightInfo.numSmLuggages = formData.numSmLuggages;
    }

    return preparedFlightInfo;
}

export const toStudentFlightInfoForm = (dbData)=> {
    let formData = {
        needsAirportPickup: toYesOrNoOptionValue(dbData.needsAirportPickup),
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

    if (formData.needsAirportPickup === 'yes') {
        formData.hasFlightInfo = toYesOrNoOptionValue(dbData.hasFlightInfo);
    }

    if (formData.hasFlightInfo === 'yes') {
        formData.arrivalFlightNumber = dbData.arrivalFlightNumber;
        formData.arrivalAirlineReferenceId = toReferenceIdOptionValue(dbData.arrivalAirlineReferenceId);
        formData.customArrivalAirline = toOptionalTextValue(dbData.customArrivalAirline);
        formData.departureFlightNumber = dbData.departureFlightNumber;
        formData.departureAirlineReferenceId = toReferenceIdOptionValue(dbData.departureAirlineReferenceId);
        formData.customDepartureAirline = toOptionalTextValue(dbData.customDepartureAirline);
        formData.numLgLuggages = dbData.numLgLuggages;
        formData.numSmLuggages = dbData.numSmLuggages;

        //split date and time in form of 'yyyy-MM-DD HH:mm'
        let arrivalDateTime = dbData.arrivalDatetime.split(' ');
        formData.arrivalDate = arrivalDateTime[0];
        formData.arrivalTime = arrivalDateTime[1];

        let departureDateTime = dbData.departureDatetime.split(' ');
        formData.departureDate = departureDateTime[0];
        formData.departureTime = departureDateTime[1];
    }

    return formData;
}

export const fromStudentTempHousingForm = (formData)=> {
    let preparedTempHousing = {
        needsTempHousing: fromYesOrNoOptionValue(formData.needsTempHousing),
        apartmentReferenceId: fromReferenceIdOptionValue(formData.apartmentReferenceId),
        customDestinationAddress: fromCustomOptionValue(formData.customDestinationAddress, formData.apartmentReferenceId, true),
        numNights: null,
        contactName: null,
        contactPhoneNumber: null,
        contactEmailAddress: null,
    };

    if(preparedTempHousing.needsTempHousing)
    {
        preparedTempHousing.numNights = fromReferenceIdOptionValue(formData.numNights);
    }
    else
    {
        preparedTempHousing.contactName = fromOptionalTextValue(formData.contactName);
        preparedTempHousing.contactPhoneNumber = fromOptionalTextValue(formData.contactPhoneNumber);
        preparedTempHousing.contactEmailAddress = fromOptionalTextValue(formData.contactEmailAddress);
    }

    return preparedTempHousing;
}

export const toStudentTempHousingForm = (dbData)=> {
    let formData = {
        needsTempHousing: toYesOrNoOptionValue(dbData.needsTempHousing),
        numNights: '',
        area: '',
        location: '',
        apartmentReferenceId: toReferenceIdOptionValue(dbData.apartmentReferenceId, true),
        customDestinationAddress: toOptionalTextValue(dbData.customDestinationAddress),
        contactName: '',
        contactEmailAddress: '',
        contactPhoneNumber: '',
    }
  
    if (formData.needsTempHousing === 'yes') {
        formData.numNights = dbData.numNights;
    } else if (formData.needsTempHousing === 'no') {
        formData.contactName = toOptionalTextValue(dbData.contactName);
        formData.contactEmailAddress = toOptionalTextValue(dbData.contactEmailAddress);
        formData.contactPhoneNumber = toOptionalTextValue(dbData.contactPhoneNumber);
    }

    return formData;
}

export const fromStudentCommentForm = (formData)=> {
    let preparedStudentComment = {
        studentComment: fromOptionalTextValue(formData.studentComment),
    };

    if('adminComment' in formData){
        preparedStudentComment.adminComment = fromOptionalTextValue(formData.adminComment);
    }

    return preparedStudentComment;
}

export const toStudentCommentForm = (dbData)=> {
    let formData = {
        studentComment: toOptionalTextValue(dbData.studentComment),
    };

    if('adminComment' in dbData){
        formData.adminComment = toOptionalTextValue(dbData.adminComment);
    }

    return formData;
}

export const fromVolunteerProfileForm = (formData)=> {
    let preparedVolunteerProfile = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: fromGenderOptionValue(formData.gender),
        affiliation: formData.affiliation,
        emailAddress: formData.emailAddress,
        wechatId: fromOptionalTextValue(formData.wechatId),
        primaryPhoneNumber: formData.primaryPhoneNumber,
        secondaryPhoneNumber: fromOptionalTextValue(formData.secondaryPhoneNumber),
      };

    if('userStatus' in formData) {
        preparedVolunteerProfile.enabled = fromUserStatusOptionValue(formData.userStatus);
    }

    return preparedVolunteerProfile;
}

export const toVolunteerProfileForm = (dbData)=> {
    let formData = {
        firstName: dbData.firstName,
        lastName: dbData.lastName,
        gender: toGenderOptionValue(dbData.gender),
        affiliation: dbData.affiliation,
        emailAddress: dbData.emailAddress,
        wechatId: toOptionalTextValue(dbData.wechatId),
        primaryPhoneNumber: dbData.primaryPhoneNumber,
        secondaryPhoneNumber: toOptionalTextValue(dbData.secondaryPhoneNumber),
      }

    if('enabled' in dbData) {
        formData.userStatus = toUserStatusOptionValue(dbData.enabled);
    }

    return formData;
}

export const fromVolunteerAirportPickupForm = (formData)=> {
    let preparedVolunteerAirportPickup = {
        providesAirportPickup: fromYesOrNoOptionValue(formData.providesAirportPickup),
        airportPickupComment: fromOptionalTextValue(formData.airportPickupComment),
        carManufacturer: null,
        carModel: null,
        numCarSeats: null,
        numMaxLgLuggages: null,
        numMaxTrips: null,
    };

    if(preparedVolunteerAirportPickup.providesAirportPickup) {
        preparedVolunteerAirportPickup.carManufacturer = fromOptionalTextValue(formData.carManufacturer);
        preparedVolunteerAirportPickup.carModel = fromOptionalTextValue(formData.carModel);
        preparedVolunteerAirportPickup.numCarSeats = fromOptionalTextValue(formData.numCarSeats);
        preparedVolunteerAirportPickup.numMaxLgLuggages = fromOptionalTextValue(formData.numMaxLgLuggages);
        preparedVolunteerAirportPickup.numMaxTrips = fromOptionalTextValue(formData.numMaxTrips);
    }

      return preparedVolunteerAirportPickup;
}

export const toVolunteerAirportPickupForm = (dbData)=> {
    let formData = {
        providesAirportPickup: toYesOrNoOptionValue(dbData.providesAirportPickup),
        carManufacturer: '',
        carModel: '',
        numCarSeats: '',
        numMaxLgLuggages: '',
        numMaxTrips: '',
        airportPickupComment: toOptionalTextValue(dbData.airportPickupComment)
    }

    if(formData.providesAirportPickup === 'yes') {
        formData.carManufacturer = toOptionalTextValue(dbData.carManufacturer);
        formData.carModel = toOptionalTextValue(dbData.carModel);
        formData.numCarSeats = toOptionalTextValue(dbData.numCarSeats);
        formData.numMaxLgLuggages = toOptionalTextValue(dbData.numMaxLgLuggages);
        formData.numMaxTrips = toOptionalTextValue(dbData.numMaxTrips);
    }

    return formData;
}

export const fromVolunteerTempHousingForm = (formData)=> {
    let preparedVolunteerTempHousing = {
        providesTempHousing: fromYesOrNoOptionValue(formData.providesTempHousing),
        homeAddress: null,
        numMaxStudentsHosted: null,
        tempHousingStartDate: null,
        tempHousingEndDate: null,
        numDoubleBeds: null,
        numSingleBeds: null,
        genderPreference: null,
        providesRide: null,
        tempHousingComment: fromOptionalTextValue(formData.tempHousingComment),
    };

    if(preparedVolunteerTempHousing.providesTempHousing) {
        preparedVolunteerTempHousing.homeAddress = formData.homeAddress;
        preparedVolunteerTempHousing.numMaxStudentsHosted = fromOptionalTextValue(formData.numMaxStudentsHosted);
        preparedVolunteerTempHousing.tempHousingStartDate = fromOptionalTextValue(formData.tempHousingStartDate);
        preparedVolunteerTempHousing.tempHousingEndDate = fromOptionalTextValue(formData.tempHousingEndDate);
        preparedVolunteerTempHousing.numDoubleBeds = fromOptionalTextValue(formData.numDoubleBeds);
        preparedVolunteerTempHousing.numSingleBeds = fromOptionalTextValue(formData.numSingleBeds);
        preparedVolunteerTempHousing.genderPreference = fromGenderOptionValue(formData.genderPreference);
        preparedVolunteerTempHousing.providesRide = fromYesOrNoOptionValue(formData.providesRide);
    }

    return preparedVolunteerTempHousing;
}

export const toVolunteerTempHousingForm = (dbData)=> {
    let formData = {
        providesTempHousing: toYesOrNoOptionValue(dbData.providesTempHousing),
        homeAddress: '',
        numMaxStudentsHosted: '',
        tempHousingStartDate: '',
        tempHousingEndDate: '',
        numDoubleBeds: '',
        numSingleBeds: '',
        genderPreference: '',
        providesRide: '',
        tempHousingComment: toOptionalTextValue(dbData.tempHousingComment),
    }

    if(formData.providesTempHousing === 'yes') {
        formData.homeAddress = dbData.homeAddress;
        formData.numMaxStudentsHosted = toOptionalTextValue(dbData.numMaxStudentsHosted);
        formData.tempHousingStartDate = toOptionalTextValue(dbData.tempHousingStartDate);
        formData.tempHousingEndDate = toOptionalTextValue(dbData.tempHousingEndDate);
        formData.numDoubleBeds = toOptionalTextValue(dbData.numDoubleBeds);
        formData.numSingleBeds = toOptionalTextValue(dbData.numSingleBeds);
        formData.genderPreference = toGenderOptionValue(dbData.genderPreference);
        formData.providesRide = toYesOrNoOptionValue(dbData.providesRide);
    }

    return formData;
}