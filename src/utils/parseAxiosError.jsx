const parseAxiosError = (axiosError) => {
    let errorMessage = 'An unexpected error occurred. Please try again later.';
    let errorData = null;

    const retErrorData = axiosError?.response?.data?.error;
    const retErrorMessage = axiosError?.response?.data?.error?.message;
    const retFieldErrors = axiosError?.response?.data?.error?.fieldErrors;
    const retStatus = axiosError?.response?.status;

    if (retFieldErrors) {
        // loop through the field errors (key is field name and value is error message) and build a string named concatenatedErrorMessage
        let concatenatedErrorMessage = '';
        for (const [key, value] of Object.entries(retFieldErrors)) {
            concatenatedErrorMessage += `${key}: ${value}\n`;
        }
        errorMessage = concatenatedErrorMessage;
    } else if (retStatus === 500) {
        errorMessage = 'An unexpected error occurred. Please try again later.';
    } else if (retErrorMessage) {
        errorMessage = retErrorMessage;
    } else {
        console.error(axiosError);
    }

    if(retErrorData) {
        errorData = retErrorData;
    }

    return {
        errorMessage,
        errorData,
    };
};;

export default parseAxiosError;