import { useEffect, useRef, useState } from "react";

export enum InputCheckUserFormType {
    Notice,
    Agreed,
    Secret,
    Writer
}



const useUserInfoCheckForm = <T>(initFormType:InputCheckUserFormType, initIsChecked?:boolean) => {
    //  variable : formType에 따라 동적으로 적용되는 변수   //
    let labelText:string = '';
    let tooltipType:'left' | 'right' | 'top' | 'bottom' | 'mobile' = 'right';
    let tooltipMessage:string = '';
    let tooltipSvgType:'info' | 'secret' = 'info';
    let inputElementId:string = '';

    
    //  state : 체크 여부 상태  //
    const [ isChecked, setChecked ] = useState<boolean>(initIsChecked!=null && initIsChecked!=undefined ? initIsChecked : false);
    //  state : input 엘리먼크 참조 상태    //
    const ref = useRef<HTMLInputElement>(null);

    //  event handler : isChecked 변경 이벤트 처리 기본   //
    const onCheckChangeDefaultHandler = () => {
        setChecked(!isChecked);
    }

    const initInternalValue = () => {
        switch(initFormType) {
            case InputCheckUserFormType.Agreed:
                labelText = '개인정보 제공 동의';
                // tooltipType = 'right';
                tooltipMessage = '개인정보 입력 시 개인정보 제공 동의는 필수사항입니다.';
                // tooltipSvgType = 'info';
                inputElementId = 'border-write-agreed-checkbox';
                break;
            case InputCheckUserFormType.Notice:
                labelText = '공지사항으로 등록';
                // tooltipType = 'right';
                tooltipMessage = '공지사항으로 등록하시려면 체크해주세요.';
                // tooltipSvgType = 'info';
                inputElementId = 'border-write-notice-checkbox'
            break;  
            case InputCheckUserFormType.Secret:
                labelText = '비밀글로 설정';
                // tooltipType = 'right';
                tooltipMessage = '홈페이지 관리자에게만 글을 공개하고 싶으시면 체크해주세요.';
                tooltipSvgType = 'info';
                
                inputElementId = 'border-write-secret-checkbox';
            break;
            case InputCheckUserFormType.Writer:
                labelText = '이 게시물의 작성자이십니까?';
                // tooltipType = 'right';
                tooltipMessage = '게시물의 작성자일 경우 게시물 작성시 입력한 비밀번호를 입력해주세요.';
                // tooltipSvgType = 'info';
                
                inputElementId = 'border-write-writer-checkbox';
            break;
        }
    };

    initInternalValue();
    

    return {
        ref,
        labelText,
        tooltipType,
        tooltipMessage,
        tooltipSvgType,
        isChecked,
        setChecked,
        inputElementId,
        onCheckChangeDefaultHandler
    };
}

export default useUserInfoCheckForm;