import { ChangeEvent, FocusEvent, forwardRef, KeyboardEvent, useState } from "react";

interface InputLayoutProps {
    inputElementId:string;
    placeHolder:string;
    type:'text' | 'password';
    name:string;
    isRequired:boolean;
    label:string;
    value:string | number | null;
    isError:boolean;
    errorMessage:string;
    nonDuplicateNickname?: string;
    readonly?:boolean;

    switchInputType?:()=>void;
    onBlurEventHandler?:(event:FocusEvent<HTMLInputElement>) => void;
    onChangeEventHanlder:(event:ChangeEvent<HTMLInputElement>) => void;
    onKeyDownEventHandler?:(event:KeyboardEvent<HTMLInputElement>) => void;
}
//  component 1-1 : input 컴포넌트  //
const InputTextBox = forwardRef<HTMLInputElement, InputLayoutProps> ((props:InputLayoutProps, ref) => {
    //  variable : params  //
    const { inputElementId, placeHolder, type, name, isRequired, label, value, isError, errorMessage, readonly } = props;
    const { switchInputType, onBlurEventHandler, onChangeEventHanlder, onKeyDownEventHandler } = props;

    //  render : input 컴포넌트 렌더링  //
    return (
        <div className='border-label-box'>
            <label htmlFor={inputElementId}>
                {isRequired && <span>*&nbsp;</span>}{label}
            </label>
            <input readOnly={readonly!=undefined? readonly : false} disabled={readonly!=undefined? readonly : false} name={name} ref={ref} id={inputElementId} type={type} placeholder={placeHolder} value={value? value : ''}
                onBlur={onBlurEventHandler} onChange={onChangeEventHanlder} onKeyDown={onKeyDownEventHandler}
                style={switchInputType && ({width:`100%`})}
                /> 
            
            {switchInputType!==undefined && (
                <div className='border-label-box-icon-button' onClick={switchInputType}>
                    <div className={`icon ${type=='password'? 'icon-eye-light-off' : 'icon-eye-light-on'}`}></div>
                </div>
            )}
            <div className='border-label-message'>
                { isError && errorMessage }
            </div>
        </div>
    )
})

export default InputTextBox;