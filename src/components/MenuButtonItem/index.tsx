import React, { EventHandler, MouseEventHandler } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';

interface MenuButtonProps {
    label: string;
    toPath: string;
    className?:string;
    currentPath:string;
}

export default function MenuButtonItem(props: MenuButtonProps) {
    const { label, toPath, className , currentPath } = props;
    
//  function  //
    // navigate 함수
    const navigate = useNavigate();

//  event handler //
    // 메뉴 버튼 클릭 이벤트 핸들러
    const onMenuButtonClickHandler = (toPath: string, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        navigate(toPath);
        // 해당 요소의 텍스트를 굵게 하고 밑줄 추가
    }

    return (
        <button className={`menu-button${currentPath==toPath? ' selected-menu' : ''}${className? ' '+className: ''}`} 
                onClick={(e) => onMenuButtonClickHandler(toPath, e)} 
                style={{
                    color:currentPath==toPath? `rgba(50, 50, 50, 0.5)` : `black`
                }}>
            {currentPath==toPath? `* ${label}` : label}
        </button>
    );
}
