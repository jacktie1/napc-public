// toXXX functions are used to convert database values to MagicDataGrid display values

export const toYesOrNoValue = (dbValue) => {
    if (dbValue === true) {
        return 'Yes';
    } else if (dbValue === false) {
        return 'No';
    } else {
        return null;
    }
}

export const toGenderValue = (dbValue) => {
    if (dbValue === 'Male') {
        return 'M';
    }
    else if (dbValue === 'Female' ) {
        return 'F';
    }
    else if (dbValue === 'No Preference') {
        return 'No';
    }
    else {
        return null;
    }
};

export const getDate = (dbValue) => {
    if (dbValue) {
        let dbDatetime = dbValue;
        // split the datetime string into date and time
        let dbDate = dbDatetime.split(' ')[0];

        let dateObject = new Date(dbDate);

        let utcDateString = dateObject.getUTCMonth() + 1 + '/' + dateObject.getUTCDate() + '/' + dateObject.getUTCFullYear();

        let retDate = new Date(utcDateString);

        return retDate;
    }
    else {
        return null;
    }
}

export const getTime = (dbValue) => {
    if (dbValue) {
        let dbDatetime = dbValue;
        let dbTime = dbDatetime.split(' ')[1];

        return dbTime;
    }
    else {
        return null;
    }
}

export const arraysAreIdentical = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
        return false;
    }

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }

    return true;
}