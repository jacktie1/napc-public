import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';

function CollapsibleAlert({ children, ...props }) {
    const [showAlert, setShowAlert] = useState(false);

    const toggleAlert = () => {
        setShowAlert(!showAlert);
    };

    var trimmedChildren = children;
    // if children is any array, use the first element
    if (Array.isArray(children)) {
        trimmedChildren = trimmedChildren[0];
        trimmedChildren = trimmedChildren.length > 100 ? trimmedChildren.substring(0, 100) : trimmedChildren;
        trimmedChildren += ' ... (click to expand)';
    } else {
        trimmedChildren = trimmedChildren.length > 100 ? trimmedChildren.substring(0, 100) : trimmedChildren;
        trimmedChildren += ' ... (click to expand)';
    }

    if(showAlert)
    {
        return (
            <div onClick={toggleAlert} style={{ cursor: 'pointer' }}>
                <Alert onClose={toggleAlert} {...props}>
                {children}
                </Alert>
            </div>
        );
    }
    else
    {
        return (
            <div onClick={toggleAlert} style={{ cursor: 'pointer' }}>
                <Alert onClose={toggleAlert} {...props}>
                {trimmedChildren}
                </Alert>
            </div>
        );
    }
}

export default CollapsibleAlert;