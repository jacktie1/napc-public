import React, { useState, useRef, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import parseAxiosError from '../utils/parseAxiosError';
import { Modal, Button, Alert } from 'react-bootstrap';


const QuickViewModal = ({ title, data, show, onHide }) => {
    const [copySuccess, setCopySuccess] = useState(false);
    const [copyFailure, setCopyFailure] = useState(false);

    // data is in form of { label1: value1, label2: value2, ... }
    // separator key means <br/> in between
    const copyContentToClipboard = async () => {
        // separate means an empty line
        let contentLines = [];
        for (const [label, value] of Object.entries(data)) {
            if(label === 'SEPARATOR')
            {
                contentLines.push(''); // empty line
            }
            else if(label.startsWith('Title'))
            {
                contentLines.push(`[${value}]`);
            }
            else
            {
                contentLines.push(`${label}: ${value !== null && value !== undefined ? value.toString() : 'N/A'}`);
            }
        }
        try {
            await navigator.clipboard.writeText(contentLines.join('\n'));
            setCopySuccess(true);
            setCopyFailure(false);
        } catch (err) {
            setCopySuccess(false);
            setCopyFailure(true);
        }
    };

    const handleHiding = () => {
        setCopySuccess(false);
        setCopyFailure(false);
        onHide();
    };

    return (
      <>
        <Modal centered show={show} onHide={handleHiding}>
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Alert variant="success" className="m-3" show={copySuccess} dismissible onClose={() => setCopySuccess(false)}>
            Content Copied to Clipboard!
          </Alert>
          <Alert variant="danger" className="m-3" show={copyFailure} dismissible onClose={() => setCopyFailure(false)}>
            Failed to Copy Content to Clipboard.
          </Alert>
          <Modal.Body>
            {Object.entries(data).map(([label, value], index) => (
              label === 'SEPARATOR' ? <hr key={index} /> :
                label.startsWith('Title') ? null :
                <p key={index}><strong>{label}:</strong> {value !== null && value !== undefined ? value.toString() : 'N/A'}</p>
            ))}
            
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={copyContentToClipboard}>
              Copy
            </Button>
            <Button variant="secondary" onClick={handleHiding}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

export default QuickViewModal;