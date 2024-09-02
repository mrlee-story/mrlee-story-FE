import { SignInRequestDto, SignUpRequestDto } from 'apis/request/auth';
import InputCheckBox from 'components/BoardForm/InputCheckBox';
import InputTextBox from 'components/BoardForm/InputTextBox';
import { ETC_ERROR_ALERT_MESSAGE, JWT_COOKIE_KEY, MAIN_PATH } from 'constant';
import { motion } from 'framer-motion';
import useUserInfoCheckForm, { InputCheckUserFormType } from 'hooks/user-info-check-form.hook';
import useUserInfoTextForm, { InputTextUserFormType } from 'hooks/user-info-text-form.hook';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import './style.css';
import { SignInResponseDto, SignUpResponseDto } from 'apis/response/auth';
import ResponseDto from 'apis/response/response.dto';
import { signInRequest, signUpRequest } from 'apis';
import UserAuthority from 'types/enum/user-authority.enum';
import ResponseCode from 'types/enum/response-code.enum';

//  Component : 인증 화면 컴포넌트  //
export default function Authentication() {

    //  state : 화면 상태   //
    const [view, setView] = useState<'sign-in' | 'sign-up'>('sign-in');

    //  state : 쿠키 상태   //
    const [, setCookie] = useCookies([JWT_COOKIE_KEY]);

    //  function : 네비게이트 함수  //
    const navigator = useNavigate();

    //  Component : 로그인 카드 컴포넌트 //
    const SignInCard = () => {
        //  state : 로그인 폼 이메일 훅 상태   //
        const {ref:emailRef, inputType:emailInputType, value:email, setValue:setEmail, resetValue:resetEmail, onEmailBlurHandler, onEmailChangeHandler, isError:isEmailError, errorMessage:emailErrorMessage } = useUserInfoTextForm(InputTextUserFormType.Email, {});
        //  state : 로그인 폼 비밀번호 훅 상태   //
        const {ref:passwordRef, inputType:passwordInputType, switchInputType:switchPasswordType, value:password, setValue:setPassword, onPasswordBlurHandler, onPasswordChangeHandler, isError:isPasswordError, errorMessage:passwordErrorMessage} = useUserInfoTextForm(InputTextUserFormType.Password, {});

        //  function : 로그인 response 처리 함수    //
        const signInResponse = (responseBody: SignInResponseDto | ResponseDto | null ) => {
            // 백엔드(서버) 네트워크 또는 도메인 이상 예외
            if (responseBody==null) {
                alert('네트워크 이상입니다.');
                return;
            }
            const { code } = responseBody;
            // 기타 예외
            if (code === ResponseCode.DATABASE_ERROR) {
                alert('데이터베이스 오류입니다.');
                return;
            }

            if (code === ResponseCode.SIGN_IN_FAIL || code===ResponseCode.VALIDATION_FAILED) {
                alert('인증에 실패하였습니다. 로그인 정보를 다시 확인해주세요.');
                emailRef.current?.focus();
                return;
            }
            if (code!==ResponseCode.SUCCESS) {
                alert(ETC_ERROR_ALERT_MESSAGE);
                return;
            }

            const { token, expirationTime } = responseBody as SignInResponseDto;
            const now = new Date().getTime();
            const expires = new Date(now + expirationTime);

            setCookie('accessToken', token, {expires, path:MAIN_PATH()});
            // alert('로그인에 성공하였습니다. 메인 페이지로 이동합니다.');
            navigator(MAIN_PATH());
        }

        //  event handler : 로그인 버튼 클릭 이벤트 처리    //
        const onSignInButtonClickHandler = () => {
            const requestBody: SignInRequestDto = { email, password };
            signInRequest(requestBody).then(signInResponse);
        }
        //  event handler : 로그인 버튼 클릭 이벤트 처리    //
        const onSignUpLinkClickHandler = () => {
            setView('sign-up');
        }
        
        //  render : 로그인 카드 렌더링
        return (
            <div className='auth-card'>
                <div className='auth-card-box'>
                    <div className='auth-card-top'>
                        <div className='auth-card-title-box'>
                            <div className='auth-card-title'>{'로그인'}</div>
                        </div>
                        <InputTextBox 
                                    ref={emailRef}
                                    inputElementId='border-write-writer-email' 
                                    label='이메일 주소'
                                    type={emailInputType}
                                    name='email'
                                    placeHolder='이메일 주소를 입력해주세요.' 
                                    isRequired={true}
                                    value={email}
                                    onBlurEventHandler={onEmailBlurHandler}
                                    onChangeEventHanlder={onEmailChangeHandler}
                                    isError={isEmailError}
                                    errorMessage={emailErrorMessage}
                                    readonly={false}
                                />
                                <InputTextBox 
                                    ref={passwordRef}
                                    inputElementId='bord-write-writer-password' 
                                    label='비밀번호'
                                    type={passwordInputType}
                                    name='password'
                                    placeHolder='비밀번호를 입력해주세요.' 
                                    isRequired={true}
                                    value={password}
                                    onBlurEventHandler={onPasswordBlurHandler}
                                    onChangeEventHanlder={onPasswordChangeHandler}
                                    isError={isPasswordError}
                                    errorMessage={passwordErrorMessage}
                                    switchInputType={switchPasswordType}
                                />
                    </div>
                    <div className='auth-card-bottom'>
                        {/* {error && (
                            <div className='auth-sign-in-error-box'>
                                <div className='auth-sign-in-error-message'>
                                    {'이메일 주소 또는 비밀번호를 잘못 입력하셨습니다.\n 입력하신 내용을 다시 확인해주세요.'}
                                </div>
                            </div>
                        )} */}
                        <div className='able-button-dark' onClick={onSignInButtonClickHandler}>
                            {'로그인'}
                        </div>
                        <div className='auth-description-box'>
                            <div className='auth-description'>
                                {'신규 사용자이신가요?'}&nbsp;&nbsp;&nbsp;&nbsp;
                                <span className='auth-description-link' onClick={onSignUpLinkClickHandler}>
                                    {'회원가입'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    //  Component : 회원가입 컴포넌트   //
    const SignUpCard = () => {
        //  state : 회원가입 폼 이메일 훅 상태   //
        const {ref:emailRef, inputType:emailInputType, value:email, setValue:setEmail, resetValue:resetEmail, onEmailBlurHandler, onEmailChangeHandler, isError:isEmailError, setError:setEmailError, errorMessage:emailErrorMessage, setErrorMessage:setEmailErrorMessage } = useUserInfoTextForm(InputTextUserFormType.Email, {});
        //  state : 회원가입 폼 닉네임 훅 상태   //
        const {ref:nicknameRef, inputType:nicknameInputType, value:nickname, setValue:setNickname, resetValue:resetNickname, onNicknameBlurHandler, onNicknameChangeHandler, isError:isNicknameError, setError:setNicknameError, errorMessage:nicknameErrorMessage, setErrorMessage:setNicknameErrorMessage } = useUserInfoTextForm(InputTextUserFormType.Nickname, {});
        //  state : 회원가입 폼 비밀번호 훅 상태   //
        const {ref:passwordRef, inputType:passwordInputType, switchInputType:switchPasswordType, value:password, setValue:setPassword, onPasswordBlurHandler, onPasswordChangeHandler, isError:isPasswordError, errorMessage:passwordErrorMessage} = useUserInfoTextForm(InputTextUserFormType.Password, {});
        //  state : 회원가입 폼 비밀번호 확인 훅 상태   //
        const {ref:passwordCheckRef, inputType:passwordCheckInputType, switchInputType:switchPasswordCheckType, value:passwordCheck, setValue:setPasswordCheck, onPasswordBlurHandler:onPasswordCheckBlurHandler, onPasswordChangeHandler:onPasswordCheckChangeHandler, isError:isPasswordCheckError, errorMessage:passwordCheckErrorMessage} = useUserInfoTextForm(InputTextUserFormType.Password, {mustSameValue:password});
        //  state : 전화번호 훅 상태   //
        const {ref:telNumberRef, inputType:telNumberInputType, value:telNumber, onTelNumberBlurHandler, onTelNumberChangeHandler, isError:isTelNumberError, setError:setTelNumberError, errorMessage:telNumberErrorMessage, setErrorMessage: setTelNumberErrorMessage} = useUserInfoTextForm(InputTextUserFormType.TelNumber, {});
        //  state : 개인정보 제공 동의 훅 상태    //
        const { isChecked:isAgreed, labelText:agreedLabelText, tooltipType:agreedTooltipType, tooltipMessage:agreedTooltipMessage, tooltipSvgType:agreedTooltipSvgType, onCheckChangeDefaultHandler:onAgreedChange, inputElementId:agreedInputElementId } = useUserInfoCheckForm(InputCheckUserFormType.Agreed);

        //  state : 페이지 번호 상태    //
        const [page, setPage] = useState<1 | 2>(1);

        //  function : 회원가입 api 처리 함수   //
        const signUpResponse = (responseBody:SignUpResponseDto | ResponseDto | null) => {
            // 백엔드(서버) 네트워크 또는 도메인 이상 예외
            if (responseBody==null) {
                alert('네트워크 이상입니다');
                return;
            }

            const { code } = responseBody;

            // 기타 오류
            if (code===ResponseCode.DUPLICATE_EMAIL) {
                setEmailError(true);
                setEmailErrorMessage('중복되는 이메일 주소입니다.');
            }
            if (code===ResponseCode.DUPLICATE_NICKNAME) {
                setNicknameError(true);
                setNicknameErrorMessage('중복되는 닉네임입니다.');
            }
            if (code===ResponseCode.DUPLICATE_TEL_NUMBER) {
                setTelNumberError(true);
                setTelNumberErrorMessage('중복되는 핸드폰 번호입니다.');
            }
            if (code===ResponseCode.VALIDATION_FAILED) {
                alert('모든 값을 입력하세요.');
            }
            if (code===ResponseCode.DATABASE_ERROR) {
                alert('데이터베이스 오류입니다.');
            }
            if (code!=ResponseCode.SUCCESS) return;

            // 성공
            setView('sign-in');
        }


        //  event handler : 다음으로 버튼 클릭 이벤트 처리  //
        const onNextButtonClickHandler = () => {
            const isValid = email && !isEmailError && password && !isPasswordError && passwordCheck && !isPasswordCheckError;
            if (!isValid) {
                alert('회원 정보를 정확히 입력해주세요.');
                return;
            }
            setPage(2);
        }
        //  event handler :  회원가입 버튼 클릭 이벤트 처리    //
        const onSignUpButtonClickHandler = () => {
            // 1번 페이지에 대한 재검증(이메일, 패스워드)   -> 유효하지 않을 시 1페이지 이동
            const isValidPageOne = email && !isEmailError && password && !isPasswordError && passwordCheck && !isPasswordCheckError;
            if (!isValidPageOne) {
                alert('회원 정보를 정확히 입력해주세요.');
                setPage(1);
                return;
            }

            // 2페이지 검증
            const isValidPageTwo = nickname && !isNicknameError && telNumber && !isTelNumberError && isAgreed;
            if (!isValidPageTwo) {
                alert('회원 정보를 정확히 입력해주세요.');
                return;
            }

            const requestBody:SignUpRequestDto = {
                email, password, nickname, telNumber, agreed: isAgreed, authorizationLevel: UserAuthority.MEMBER, profileImageUrl: null
            }

            signUpRequest(requestBody).then(signUpResponse);
        }
        //  event handler : 로그인 링크 클릭 이벤트 처리    //
        const onSignInLinkClickHandler = () => {
            setView('sign-in');
        }



        //  render : 회원가입 카드 렌더링   //
        return (
            <div className='auth-card'>
                <div className='auth-card-box'>
                    <div className='auth-card-top'>
                        <div className='auth-card-title-box'>
                            <div className='auth-card-title'>{'회원가입'}</div>
                            <div className='auth-card-page'>{`${page}/2`}</div>
                        </div>
                        {page===1 && (
                            <>
                                <InputTextBox 
                                    ref={emailRef}
                                    inputElementId='border-write-writer-email' 
                                    label='이메일 주소'
                                    type={emailInputType}
                                    name='email'
                                    placeHolder='이메일 주소를 입력해주세요.' 
                                    isRequired={true}
                                    value={email}
                                    onBlurEventHandler={onEmailBlurHandler}
                                    onChangeEventHanlder={onEmailChangeHandler}
                                    isError={isEmailError}
                                    errorMessage={emailErrorMessage}
                                    readonly={false}
                                />
                                <InputTextBox 
                                    ref={passwordRef}
                                    inputElementId='bord-write-writer-password' 
                                    label='비밀번호'
                                    type={passwordInputType}
                                    name='password'
                                    placeHolder='비밀번호를 입력해주세요.' 
                                    isRequired={true}
                                    value={password}
                                    onBlurEventHandler={onPasswordBlurHandler}
                                    onChangeEventHanlder={onPasswordChangeHandler}
                                    isError={isPasswordError}
                                    errorMessage={passwordErrorMessage}
                                    switchInputType={switchPasswordType}
                                />
                                <InputTextBox 
                                    ref={passwordCheckRef}
                                    inputElementId='bord-write-writer-password-check' 
                                    label='비밀번호 확인'
                                    type={passwordCheckInputType}
                                    name='password'
                                    placeHolder='비밀번호를 다시 입력해주세요.' 
                                    isRequired={true}
                                    value={passwordCheck}
                                    onBlurEventHandler={onPasswordCheckBlurHandler}
                                    onChangeEventHanlder={onPasswordCheckChangeHandler}
                                    isError={isPasswordCheckError}
                                    errorMessage={passwordCheckErrorMessage}
                                    switchInputType={switchPasswordCheckType}
                                />
                            </>
                        )}
                        {page===2 && (
                            <>
                                <InputTextBox 
                                    ref={nicknameRef}
                                    inputElementId='border-write-writer-nickname' 
                                    label='닉네임'
                                    type='text'
                                    name='nickname'
                                    placeHolder='닉네임을 입력해주세요.(3자~10자 이내)' 
                                    isRequired={true}
                                    value={nickname}
                                    onBlurEventHandler={onNicknameBlurHandler}
                                    onChangeEventHanlder={onNicknameChangeHandler}
                                    isError={isNicknameError}
                                    errorMessage={nicknameErrorMessage}
                                />
                                <InputTextBox 
                                    ref={telNumberRef}
                                    inputElementId='bord-write-writer-telnumber' 
                                    label='휴대폰 번호'
                                    type='text'
                                    name='telnumber'
                                    placeHolder='핸드폰 번호를 입력해주세요.' 
                                    isRequired={true}
                                    value={telNumber}
                                    onBlurEventHandler={onTelNumberBlurHandler}
                                    onChangeEventHanlder={onTelNumberChangeHandler}
                                    isError={isTelNumberError}
                                    errorMessage={telNumberErrorMessage}
                                />
                            </>
                        )}
                    </div>
                    <div className='auth-card-bottom'>
                        {page===1 && (
                            <div className='able-button-dark' onClick={onNextButtonClickHandler}>{'다음 단계'}</div>
                        )}
                        {page===2 && (
                            <>
                                <div className='auth-consent-box'>
                                    <InputCheckBox
                                        isChecked={isAgreed}
                                        labelText={agreedLabelText}
                                        onChangeHandler={onAgreedChange}
                                        tooltipMessage={agreedTooltipMessage}
                                        tooltipType={agreedTooltipType}
                                        tooltipSvgType={agreedTooltipSvgType}
                                        inputElementId={agreedInputElementId}
                                    />
                                    { !isAgreed && (
                                        <motion.div 
                                        className='board-write-agreed-description'
                                            initial={{ y: -10, opacity: 0 }}
                                                        animate={{ y: 0, opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.3, ease: [0.43, 0.13, 0.23, 0.96] }}
                                        >
                                            <h3>개인정보 수집·이용에 대한 안내</h3>
                                            <span>
                                                <br/>
                                                문의사항을 처리하기 위해 아래 목적의 개인정보를 수집/이용하며, 데이터 암호화를 하는 등 안전한 개인정보 취급에 최선을 다하고 있습니다.
                                                <table>
                                                    <tr>
                                                        <th>
                                                            수집항목
                                                        </th>
                                                        <th>
                                                            수집목적
                                                        </th>
                                                        <th>
                                                            보유기간
                                                        </th>
                                                    </tr>
                                                    <tr>
                                                        <td>휴대폰 번호</td>
                                                        <td>문의사항 처리/이벤트 응모</td>
                                                        <td>1년 간 보관</td>
                                                    </tr>
                                                </table>
                                            </span>
                                        </motion.div>
                                    )}
                                </div>
                                <div className='able-button-dark' onClick={onSignUpButtonClickHandler}>{'회원가입'}</div>
                            </>
                        )}
                        <div className='auth-description-box'>
                            <div className='auth-description'>{'이미 계정이 있으신가요?'}&nbsp;&nbsp;&nbsp;&nbsp;<span className='auth-description-link' onClick={onSignInLinkClickHandler}>{'로그인'}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    //  render : 인증 화면 렌더링   //
    return (
        <div id='auth-wrapper'>
            <div className='auth-container'>
                <div className='auth-jumbotron-box'>
                    <div className='auth-jumbotron-contents'>
                        <div className='auth-logo-icon'></div>
                        <div className='auth-jumbotron-text-box'>
                            <div className='auth-jumbotron-text'>{'환영합니다'}</div>
                            <div className='auth-jumbotron-text'>{'Mrlee-Story 입니다.'}</div>
                        </div>
                    </div>
                </div>
                {view === 'sign-in' && (
                    <SignInCard />
                )}
                {view === 'sign-up' && (
                    <SignUpCard />
                )}
            </div>
        </div>
    )
}
