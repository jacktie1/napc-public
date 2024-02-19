import React from 'react';
import { Alert } from 'react-bootstrap';

const MultipleSortingInfo = () => {
    return (
        <Alert dismissible variant='warning'>
            To <b>sort by multiple columns</b>, try holding <b>'Shift'</b> key and click on the column header in order.
        </Alert>
    );
};

export default MultipleSortingInfo;