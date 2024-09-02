import ToolTip from 'components/Tooltip';
import React from 'react';
import './style.css';

interface InputCheckBoxProps {
    isChecked:boolean;
    labelText:string;
    onChangeHandler:() => void;
    // tooltip 관련(label 옆에 배치)
    tooltipMessage?:string;
    tooltipType?: 'left' | 'right' | 'top' | 'bottom' | 'mobile';
    tooltipSvgType?: 'info' | 'secret';
    inputElementId:string;
}

export default function InputCheckBox(props: InputCheckBoxProps) {
    const { isChecked, labelText, onChangeHandler, tooltipMessage, tooltipType, tooltipSvgType, inputElementId } = props;

    return (
        <div className='input-checkbox-container'>
            <label htmlFor={inputElementId}>
                {labelText}
                {tooltipType && tooltipMessage && tooltipSvgType && (
                    <ToolTip type={tooltipType} message={tooltipMessage} svgType={tooltipSvgType} />
                )}
            </label>
            <input id={inputElementId} type='checkbox' checked={isChecked} onChange={onChangeHandler}/>
        </div>
    )
}
