export const fromYesOrNoOptionValue = (optionValue) => {
    if (optionValue === 'yes') {
        return true;
    } else if (optionValue === 'no') {
        return false;
    } else {
        return null;
    }
}

export const toYesOrNoOptionValue = (dbValue) => {
    if (dbValue === true) {
        return 'yes';
    } else if (dbValue === false) {
        return 'no';
    } else {
        return '';
    }
}

export const fromReferenceIdOptionValue = (optionValue) => {
    if (optionValue === '') {
        return null;
    } else if (optionValue === 'other') {
        return null;
    }
    else {
        return parseInt(optionValue, 10);
    }
}

export const toReferenceIdOptionValue = (dbValue) => {
    if (dbValue === null) {
        return 'other';
    } else {
        return dbValue;
    }
}

export const fromGenderOptionValue = (optionValue) => {
    if (optionValue === 'male') {
        return 'Male';
    }
    else if (optionValue === 'female') {
        return 'Female';
    }
    else {
        return null;
    }
};

export const toGenderOptionValue = (dbValue) => {
    if (dbValue === 'Male') {
        return 'male';
    }
    else if (dbValue === 'Female' ) {
        return 'female';
    }
    else {
        return '';
    }
};

export const fromStudentTypeValue = (optionValue) => {
    if (optionValue === 'undergrad') {
        return 'Undergraduate Student';
    }
    else if (optionValue === 'grad') {
        return 'Graduate Student';
    }
    else if (optionValue === 'visiting') {
        return 'Visiting Scholar';
    }
    else if (optionValue === 'other') {
        return 'Other';
    }
    else {
        return null;
    }
}

export const toStudentTypeValue = (dbValue) => {
    if (dbValue === 'Undergraduate Student') {
        return 'undergrad';
    }
    else if (dbValue === 'Graduate Student') {
        return 'grad';
    }
    else if (dbValue === 'Visiting Scholar') {
        return 'visiting';
    }
    else if (dbValue === 'Other') {
        return 'other';
    }
    else {
        return '';
    }
}

export const fromCustomOptionValue = (optionValue, dependency, returnOnEmptyDependency) => {
    // 'other' selected, custom value will be used
    if(dependency === 'other') {
        return optionValue;
    }

    // if we want to return the option value even if the dependency is empty and the dependency is empty
    if(returnOnEmptyDependency && dependency === '') {
        return optionValue;
    }

    return null;
};

export const fromOptionalTextValue = (textValue) => {
    if (textValue === '') {
        return null;
    } else {
        return textValue;
    }
}