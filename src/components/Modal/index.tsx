import React, { ForwardedRef, useState } from 'react';
import './style.css';


interface ModalProps {
    type: 'alert' | 'confirm' | 'prompt';
    title: string;
    alterText: string;
    closeModal: () => void;
    children?: JSX.Element;
    okButtonRef?:ForwardedRef<HTMLButtonElement>;
    onOkPasswordSubmitButtonHandler?:() => void;
};

export default function Modal (props: ModalProps) {
    const { type, title, alterText, closeModal, children, okButtonRef, onOkPasswordSubmitButtonHandler } = props;

    return (
    <div className="modal-container">
        <div className="modal-background" onClick={closeModal}></div>
        <div className='modal-content-box'>
            <div className='modal-title-box'>
                {title}
            </div>
            <div className='modal-alert-text-box'>
                {alterText}
            </div>
            
            {props.children && (
                props.children
            )}

            <div className='modal-button-box'>
                {type==='alert' && (
                    <button className='able-button-dark' onClick={closeModal}>확인</button>
                )}
                {type==='confirm' || type==='prompt' && (
                    <>
                        <button className='disable-button' ref={okButtonRef} onClick={onOkPasswordSubmitButtonHandler}>확인</button>
                        <button className='able-button-light' onClick={closeModal}>취소</button>
                    </>
                )} 
            </div>
        </div>
    </div>
    );
    
}
