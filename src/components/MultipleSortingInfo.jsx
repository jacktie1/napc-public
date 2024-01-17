import React from 'react';
import { Alert } from 'react-bootstrap';

const MultipleSortingInfo = ({ }) => {
    return (
        <Alert dismissible variant='warning'>
            To sort by multiple columns, try holding 'Shift' key and click on the column header in order.
        </Alert>
    );
};

export default MultipleSortingInfo;