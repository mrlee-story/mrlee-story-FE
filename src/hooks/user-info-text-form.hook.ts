import { R_E_EMAIL_FORMAT, R_E_NUMBER_FORMAT } from "constant";
import { ChangeEvent, FocusEvent, useEffect, useRef, useState } from "react";

export enum InputTextUserFormType {
    Email,
    Nickname,
    Password,
    TelNumber
}

interface userInfoFormTextProps {
    mustSameValue?:string;
    mustDiffentValue?:string;
}

const useUserInfoTextForm = <T>(initFormType:InputTextUserFormType, props:userInfoFormTextProps) => {
    //  state : props 상태  //
    const { mustSameValue, mustDiffentValue } = props;
    
    //  state : input element 요소 참조 상태    //
    const ref = useRef<HTMLInputElement>(null);

    //  state(private:formType) : 폼 구분 상태    //
    const [ formType, setFormType ] = useState<InputTextUserFormType>(initFormType);
    //  state(private:setValue) : input 값 상태   //
    const [ value, setValue ] = useState<string>('');
    //  state(private:setError) : 에러 여부 상태  //
    const [ isError, setError ] = useState<boolean>(false);
    //  state(private:setErrorMessage) : 에러 메시지 상태    //
    const [ errorMessage, setErrorMessage ] = useState<string>('');

    //  state : input type 상태    //
    const [ inputType, setInputType ] = useState<'text' | 'password'>('text');

    //  effect : type 변경 시 효과  //
    useEffect(() => {
        switch (formType) {
            case InputTextUserFormType.Email:
            break;
            case InputTextUserFormType.Nickname:
            break;

            case InputTextUserFormType.Password:
                setInputType('password');
            break;

            case InputTextUserFormType.TelNumber:
            break;
        }
    }, []);

    //  event handler(private) : 이메일 요소 포커스 아웃 이벤트 처리    //
    const onEmailBlurHandler = (e:FocusEvent<HTMLInputElement>) => {
        const isValid = checkEmailValidate(value);

        if (isValid && isError) {
            setError(false);
            setErrorMessage('');
        }
    }

    //  event handler(private) : 닉네임 요소 포커스 아웃 이벤트 처리   //
    const onNicknameBlurHandler = (e:FocusEvent<HTMLInputElement>) => {
        const isValid = checkNicknameValidate(value);

        if (isValid && isError) {
            setError(false);
            setErrorMessage('');
        }
    };
    
    //  event handler(private) : 패스워드 요소 포커스 아웃 이벤트 처리 //
    const onPasswordBlurHandler = (e:FocusEvent<HTMLInputElement>) => {
        const isValid = checkPasswordValidate(value);
        
        if (isValid && isError) {
            setError(false);
            setErrorMessage('');
        }
    };

    //  event handler(private) : 전화번호 요소 포커스 아웃 이벤트 처리 //
    const onTelNumberBlurHandler = (e:FocusEvent<HTMLInputElement>) => {
        const isValid = checkTelNumberValidate(value);

        if (isValid && isError) {
            setError(false);
            setErrorMessage('');
        }
    };
    //  event handler : 이메일 변경 이벤트 처리 //
    const onEmailChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
        if (!event?.target) {
            return;
        }
        const { value } = event.target;

        const isValid = checkEmailValidate(value);

        if (isValid) {
            setValue(value);
            setError(false);
            setErrorMessage('');
        }
    }
    //  event handler : 닉네임 변경 이벤트 처리 //
    const onNicknameChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
        if (!event?.target) {
            return;
        }
        const { value } = event.target;

        const isValidNickname = checkNicknameValidate(value);

        if (isValidNickname) {
            setValue(value);
            setError(false);
            setErrorMessage('');
        }
    }
    //  event handler : 비밀번호 변경 이벤트 처리 //
    const onPasswordChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
        if (!event?.target) return;
        const { value } = event.target;

        const isValidPassword = checkPasswordValidate(value);

        if (isValidPassword) {
            setValue(value);
            setError(false);
            setErrorMessage('');
        }
    }
    //  event handler : 전화번호 변경 이벤트 처리 //
    const onTelNumberChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
        if (!event?.target) return;
        const { value } = event.target;
        const isValidTelNumber = checkTelNumberValidate(value);

        if (isValidTelNumber) {
            setValue(value);
            setError(false);
            setErrorMessage('');
        }
    }

    //  function(private) : 이메일 검증 함수(필수 입력. 이메일 포맷 여부 확인)    //
    const checkEmailValidate = (value:string) => {
        setValue(value);
        const isEmailPattern = R_E_EMAIL_FORMAT.test(value);
        if (!isEmailPattern) {
            setError(true);
            setErrorMessage('이메일 주소 포맷이 맞지 않습니다.');
            return false;
        }
        return true;
    }


    //  function(private) : 닉네임 검증 함수(필수 입력. 3자 이상 10자 이하)    //
    const checkNicknameValidate = (value:string) => {
        let tmpErrorMessage = null;
        let tmpValue = null;

        if (!value || value.length==0) {
            tmpErrorMessage = '닉네임을 입력해주세요.';
        }
        if (value.length>10) {
            tmpErrorMessage = '닉네임은 최대 10자까지 입력해주세요.';
            tmpValue = value.substring(0,10);
        }

        if (value.length<3) {
            tmpErrorMessage = '닉네님은 최소 3자 이상 입력해주세요.';
        }

        if (value==='admin' || value==='관리자') {
            tmpErrorMessage = '관리자와 혼동되는 닉네임(\'admin\' 또는 \'관리자\') 사용 불가합니다.';
        } else if (mustDiffentValue && value===mustDiffentValue) {
            setError(true);
            tmpErrorMessage = `작성자와 동일한 닉네임(${mustDiffentValue})은 사용 불가합니다.`;
        }

        if (tmpErrorMessage) {
            setError(true);
            setValue(tmpValue? tmpValue : value);
            setErrorMessage(tmpErrorMessage? tmpErrorMessage : '닉네임은 다시 입력해주세요.');
            return false;
        }
        
        return true;
    }

    //  function(private) : 암호 검증 함수(필수 입력. 16자 이하)    //
    const checkPasswordValidate = (value:string) => {
        if (!value || value.length==0) {
            setError(true);
            setErrorMessage('비밀번호를 입력해주세요.');
            setValue(value);
            return false;
        }
        if (value.length<8) {
            setError(true);
            setErrorMessage('비밀번호는 최소 8자 이상 입력해주세요.');
            setValue(value);
            return false;
        }
        if (value.length>16) {
            setError(true);
            setErrorMessage('비밀번호는 최대 16자까지 입력해주세요.');
            setValue(value.substring(0, 16));
            return false;
        }
        if (mustSameValue && value!==mustSameValue) {
            setError(true);
            setErrorMessage('비밀번호가 일치하지 않습니다.');
            setValue(value);
            return false;
        }
        return true;
    }
    //  function(private) : 전화번호 숫자 포맷 검증 함수(선택 입력. 9자 이상 13자 이하)    //
    const checkTelNumberValidate = (value:string) => {
        if (!value || value.length==0) {
            if (isError) {
                setError(false);
                setErrorMessage('');
            }
            return true;
        }

        const isValid = R_E_NUMBER_FORMAT.test(value);

        if (!isValid) {
            setError(true);
            setErrorMessage('9~13자리 숫자만 입력해주세요.');
            if (value.length>13) {
                setValue(value.substring(0, 13).replace(/[^0-9]/g, ""));
            } else {
                setValue(value.replace(/[^0-9]/g, ""));
            }
            return false;
        }
        return true;
    }

    //  function : 상태 초기화 함수 //
    const resetValue = () => {
        setValue('');
        setError(false);
        setErrorMessage('');
    }

    //  function : 패스워드 input type 변경 함수    //
    const switchInputType = () => {
        if (inputType=='text') {
            setInputType('password');
        } else {
            setInputType('text');
        }
    }


    return {
        ref,
        setFormType,
        value,
        setValue,
        resetValue,
        isError,
        setError,
        errorMessage,
        setErrorMessage,
        onEmailBlurHandler,
        onNicknameBlurHandler,
        onPasswordBlurHandler,
        onTelNumberBlurHandler,

        onEmailChangeHandler,
        onNicknameChangeHandler,
        onPasswordChangeHandler,
        onTelNumberChangeHandler,

        inputType,
        switchInputType
    }
}

export default useUserInfoTextForm;