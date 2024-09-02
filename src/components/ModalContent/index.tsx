import React, { ForwardedRef } from 'react';
import './style.css';

interface ModalContentProps {
    children: JSX.Element;
    closeModal: () => void;
}

export default function ModalContent(props:ModalContentProps) {
    const { children, closeModal } = props;
    return (
        <div className="modal-container">
            <div className="modal-background" onClick={closeModal}></div>
            <div className='modal-content-box'>
                <div className='modal-content-close-button' onClick={closeModal}></div>
                <div className='modal-alert-text-box'>
                    {children}
                </div>
            </div>
        </div>
    )
}
