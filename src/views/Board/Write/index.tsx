import { fileUploadRequest, postBoardGuestRequest, postBoardRequest } from 'apis';
import { PostBoardGuestResponseDto } from 'apis/response/board';
import PostBoardResponseDto from 'apis/response/board/post-board.response.dto';
import ResponseDto from 'apis/response/response.dto';
import InputCheckBox from 'components/BoardForm/InputCheckBox';
import InputTextBox from 'components/BoardForm/InputTextBox';
import { CONTACT_DETAIL_PATH, CONTACT_PATH, CONTACT_WRITE_PATH, ETC_ERROR_ALERT_MESSAGE, JWT_COOKIE_KEY, MAIN_PATH } from 'constant';
import { motion } from 'framer-motion';
import useUserInfoCheckForm, { InputCheckUserFormType } from 'hooks/user-info-check-form.hook';
import useUserInfoTextForm, { InputTextUserFormType } from 'hooks/user-info-text-form.hook';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useBoardStore from 'store/board.store';
import useLoginUserStore from 'store/login-user.store';
import ResponseCode from 'types/enum/response-code.enum';
import UserAuthority from 'types/enum/user-authority.enum';
import './style.css';
import { PostBoardGuestRequestDto, PostBoardRequestDto } from 'apis/request/board';

//  component : 게시물 작성 화면 컴포넌트   //
export default function BoardWrite() {

    //  state : path 상태   //
    const { pathname } = useLocation();

    //  state : 쿠키 상태   //
    const [ cookies ] = useCookies([JWT_COOKIE_KEY]);

    //  state : 로그인 상태 //
    const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();

    //  state : 제목 영역 요소 참조 상태    //
    const titleRef = useRef<HTMLTextAreaElement | null>(null);
    //  state : 본문 영역 요소 참조 상태    //
    const contentRef = useRef<HTMLTextAreaElement | null>(null);
    //  state : 이미지 입력 요소 참조 상태    //
    const imageInputRef = useRef<HTMLInputElement | null>(null);

    //  state : 게시물 이미지 미리보기 URL 상태 //
    const [imageUrls, setImageUrls] = useState<string[]>([]);


    //  state : 닉네임 훅 상태   //
    const {ref:nicknameRef, value:nickname, inputType:nicknameInputType, onNicknameBlurHandler, onNicknameChangeHandler, isError:isNicknameError, errorMessage:nicknameErrorMessage} = useUserInfoTextForm(InputTextUserFormType.Nickname, {});
    //  state : 비밀번호 훅 상태   //
    const {ref:passwordRef, value:password, inputType:passwordInputType, switchInputType:switchPasswordInputType, onPasswordBlurHandler, onPasswordChangeHandler, isError:isPasswordError, errorMessage:passwordErrorMessage} = useUserInfoTextForm(InputTextUserFormType.Password, {});
    //  state : 전화번호 훅 상태   //
    const {ref:telNumberRef, value:telNumber, inputType:telnumberInputType, onTelNumberBlurHandler, onTelNumberChangeHandler, isError:isTelNumberError, errorMessage:telNumberErrorMessage} = useUserInfoTextForm(InputTextUserFormType.TelNumber, {});

    //  state : 개인정보 제공 동의 훅 상태    //
    const { isChecked:isAgreed, labelText:agreedLabelText, tooltipType:agreedTooltipType, tooltipMessage:agreedTooltipMessage, tooltipSvgType:agreedTooltipSvgType, onCheckChangeDefaultHandler:onAgreedChange, inputElementId:agreedInputElementId } = useUserInfoCheckForm(InputCheckUserFormType.Agreed);
    //  state : 공지글 훅 상태  //
    const { isChecked:isNotice, labelText:noticeLabelText, tooltipType:noticeTooltiplType, tooltipMessage:noticeTooltipMessage, tooltipSvgType:noticeTooltipSvgType, onCheckChangeDefaultHandler:onNoticeChange, inputElementId:noticeInputElementId } = useUserInfoCheckForm(InputCheckUserFormType.Notice);
    //  state : 비밀글 훅 상태  //
    const { isChecked:isSecret, labelText:secretLabelText, tooltipType:secretTooltipType, tooltipMessage:secretTooltipMessage, tooltipSvgType:secretTooltipSvgType, onCheckChangeDefaultHandler:onSecretChange, inputElementId:secretInputElementId } = useUserInfoCheckForm(InputCheckUserFormType.Secret);
    //* 게시판 store 상태   //
    const { title, setTitle } = useBoardStore();
    const { content, setContent }  = useBoardStore();
    const { boardImageFileList, setBoardImageFileList } = useBoardStore();
    // const { setSecret:setBoardSecret, setAgreed, setNotice } = useBoardStore();
    // const { isSecret, setSecret } = useBoardStore();
    // const { isAgreed, setAgreed } = useBoardStore();
    // const { isNotice, setNotice } = useBoardStore();
    const { resetBoard } = useBoardStore();


    //  effect : 첫 렌더링 시 효과   //
    useEffect(() => {
        // 첫 화면 진입 시 title input에 포커스
        if (titleRef?.current) titleRef.current.focus();
        resetBoard();
    }, []);
    
    //  function : navigate 함수   //
    const navigate = useNavigate();

    //  function: 회원 게시물 업로드 response 처리 함수  //
    const postBoardResponse = (responseBody: PostBoardResponseDto | ResponseDto | null) => {
        if (!responseBody) return;

        const { code } = responseBody;
        if (code === ResponseCode.DATABASE_ERROR) alert('데이터베이스 오류입니다.');
        if (code === ResponseCode.AUTHORIZATION_FAIL || code===ResponseCode.NOT_EXISTED_USER) alert('권한 오류입니다.');
        if (code === ResponseCode.VALIDATION_FAILED) alert('필수 입력 항목을 작성해주세요.');
        if (code!==ResponseCode.SUCCESS) return;

        resetBoard();
        if (!loginUser) {
            navigate(CONTACT_PATH());
            return;
        }

        const { boardNumber } = responseBody as PostBoardResponseDto;

        navigate(CONTACT_DETAIL_PATH(boardNumber));
    }

    //  function : 비회원 게시물 업로드 response 처리 함수    //
    const postBoardGuestResponse = (responseBody:PostBoardGuestResponseDto | ResponseDto | null) => {
        // 백엔드(서버) 네트워크 또는 도메인 이상 예외
        if (responseBody==null) {
            alert('네트워크 이상입니다');
            return;
        }

        const { code } = responseBody;

        switch (code) {
            // 검증 실패
            case ResponseCode.VALIDATION_FAILED:
                alert('모든 값을 입력하세요.');
            return;
            // 기타 오류
            case ResponseCode.DATABASE_ERROR:
                alert('데이터베이스 오류입니다.');
            return;
            // 성공
            case ResponseCode.SUCCESS:

            break;
            // 성공 외 기타 오류
            default : 
            alert('오류가 발생하였습니다.');
            return;
        }
        const { boardNumber: responseBoardNumber } = responseBody as PostBoardGuestResponseDto;
        // 성공
        return responseBoardNumber;
    }

    //  event handler : 제목 변경 이벤트 처리   //
    const onTitleChangeHandler = (event : ChangeEvent<HTMLTextAreaElement>) => {
        const { value }= event.target;
        setTitle(value);

        if (!titleRef.current) return;

        titleRef.current.style.height = 'auto';
        titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    };

    //  event handler : 본문 변경 이벤트 처리   //
    const onContentChangeHandler = (event : ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = event.target;
        setContent(value);

        if (!contentRef.current) return;
        contentRef.current.style.height = 'auto';
        contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
    };

    //  event handler : 이미지 업로드 클릭 이벤트 처리 //
    const onImageUploadButtonClickHandler = () => {
        if (!imageInputRef.current) return;
        imageInputRef.current.click();
    };

    //  event handler : 이미지 닫기 버튼 클릭 이벤트 처리   //
    const onImageCloseButtonClickHandler  = (deleteIdx:number) => {
        if (!imageInputRef.current) return;
        
        imageInputRef.current.value = '';

        // 미리보기 용도
        const newImageUrls = imageUrls.filter((url, idx) => idx!==deleteIdx);
        setImageUrls(newImageUrls);

        // 이미지 업로드 용도
        const newBoardImageUrlList = boardImageFileList.filter((file, idx) => idx!==deleteIdx);
        setBoardImageFileList(newBoardImageUrlList);
    };

    //  event handler : 이미지 변경 이벤트 처리 //
    const onImageChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || !event.target.files.length) return;

        const file = event.target.files[0];

        // 본문 미리보기 용도
        const imageUrl = URL.createObjectURL(file);
        const newImageUrls = imageUrls.map(item => item);
        newImageUrls.push(imageUrl);
        setImageUrls(newImageUrls);

        // 이미지 업로드 용도)
        const newBoardImateUrlList = boardImageFileList.map(item => item);
        newBoardImateUrlList.push(file);
        setBoardImageFileList(newBoardImateUrlList);

        // 같은 이미지 중복 허용
        if (imageInputRef.current) {
            imageInputRef.current.value='';
        }
    };

    //  event handler : 닉네임 input 키다운 이벤트 처리 //
    const onNicknameKeyDownHandler = (event:KeyboardEvent<HTMLInputElement>) => {
        if (event.key != 'Enter') return;

        contentRef.current?.focus();
    };
    //  event handler : 패스워트 input 키다운 이벤트 처리   //
    const onPasswordKeyDownHandler = (event:KeyboardEvent<HTMLInputElement>) => {
        if (event.key != 'Enter') return;
    };
    //  event handler : 전화번호 input 키다운 이벤트 처리   //
    const onTelNumberKeyDownHandler = (event:KeyboardEvent<HTMLInputElement>) => {
        if (event.key != 'Enter') return;
    };

    //  event handler : 게스트용 업로드 버튼 클릭 이벤트 처리   //
    const onGuestUploadButtonClickHandler = async () => {
        //  폼 양식 검증
        if ( !(title && content && 
            (
                // 비회원일 경우
                (loginUser?.authorizationLevel!=undefined && loginUser?.authorizationLevel<3 && 
                    //  닉네임과 비밀번호 필수. 
                    nickname && !isNicknameError && password && !isPasswordError  &&
                    // 전화번호 입력했을 시 개인정보 제공 동의도 필수
                    ( (!telNumber && !isTelNumberError) || (telNumber && !isTelNumberError && isAgreed))
                )
            )) ) {
            alert('필수 내용을 양식에 맞게 모두 작성해주세요.');

            if (!title) titleRef.current?.focus();
            if (!content) contentRef.current?.focus();
            if ((!nickname || isNicknameError)) nicknameRef.current?.focus();
            if ((!password || isPasswordError)) passwordRef.current?.focus();
            if (isTelNumberError) telNumberRef.current?.focus();
            return;
        }

        //  Guest 사용자 처리
        // if (cookies.accessToken) {
        //     setaCookie('accessToken', '', { path: MAIN_PATH(), expires : new Date() });
        // }

        //  Request Body 생성
        const boardImageUrlList:string[] = [];

        for (const file of boardImageFileList) {
            const data = new FormData();
            data.append('file', file);

            const url = await fileUploadRequest(data);  // 파일 서버 업로드 및 url loading
            if (url) boardImageUrlList.push(url);
        }

        //  Guest
        const requestBody:PostBoardGuestRequestDto = {
            title, content, boardImageUrlList, nickname, password, telNumber, secret:isSecret, notice:false, agreed:telNumber? isAgreed : true
        }
        postBoardGuestRequest(requestBody).then(response => {
            const responseBoardNumber = postBoardGuestResponse(response);
            if (!responseBoardNumber) {
                alert(ETC_ERROR_ALERT_MESSAGE);
                return;
            }
            
            if (isSecret) {
                alert('게시물 작성이 성공적으로 완료되었습니다.\r\n게시판으로 이동합니다.');
                navigate(CONTACT_PATH());
            } else {
                const goDetailPage = window.confirm('게시물 작성이 성공적으로 완료되었습니다. \r\n작성하신 페이지로 이동하시겠습니까?\r\n(취소:게시판 페이지로 이동)');
                
                if (goDetailPage) {
                    navigate(CONTACT_DETAIL_PATH(responseBoardNumber));
                } else {
                    navigate(CONTACT_PATH());
                }
            }
        });
    }

    //  event handler : 회원/관리자용 업로드 버튼 클릭 이벤트 처리    //
    const onMemberUploadButtonClickHandler = async () => {
        //  토큰 검증
        const accessToken = cookies.accessToken;

        if (!accessToken) return;
        
        // 폼 양식 검증
        if ( !(title && content && 
            (
                // 비회원일 경우
                (loginUser?.authorizationLevel!=undefined && loginUser?.authorizationLevel<3 && 
                    //  닉네임과 비밀번호 필수. 
                    nickname && !isNicknameError && password && !isPasswordError  &&
                    // 전화번호 입력했을 시 개인정보 제공 동의도 필수
                    ( (!telNumber && !isTelNumberError) || (telNumber && !isTelNumberError && isAgreed))
                ) ||
                // 회원일 경우 통과
                (
                    loginUser?.authorizationLevel!=undefined && loginUser?.authorizationLevel>=3
                )
            )) ) {
            alert('필수 내용을 양식에 맞게 모두 작성해주세요.');

            if (!title) titleRef.current?.focus();
            if (!content) contentRef.current?.focus();
            if ((!nickname || isNicknameError)) nicknameRef.current?.focus();
            if ((!password || isPasswordError)) passwordRef.current?.focus();
            if (isTelNumberError) telNumberRef.current?.focus();
            return;
        }

        //  Request Body 생성
        const boardImageUrlList:string[] = [];

        for (const file of boardImageFileList) {
            const data = new FormData();
            data.append('file', file);

            const url = await fileUploadRequest(data);  // 파일 서버 업로드 및 url loading
            if (url) boardImageUrlList.push(url);
        }

        const requestBody:PostBoardRequestDto = {
            title, content, boardImageUrlList, secret:isSecret, notice:isNotice
        }
        postBoardRequest(requestBody, accessToken).then(postBoardResponse);
    }
    
    //  event handler : 취소 버튼 클릭 이벤트 처리  //
    const onCancleButtonClickHandler = () => {
        const check = window.confirm('모든 작업을 취소하고 뒤로 돌아가시겠습니까?');

        if (!check) return;

        navigate(-1);
    }

    //  render : 게시물 작성 화면 컴포넌트 렌더링  //
    return (
        <>
        <div className='board-write-container'>
            <div className='horizontal-layout-container left-60'>

                <div id='board-write-wrapper'>
                    <div className='board-write-box'>

                        <div className='board-write-title-box'>
                            <textarea ref={titleRef} className='board-writer-title-textarea' rows={1} placeholder='제목을 작성해주세요.' value={title} onChange={onTitleChangeHandler} />
                        </div>

                        <div className='divider'></div>

                        <div className='board-write-content-box'>
                            <textarea ref={contentRef} className='board-write-content-textarea' placeholder='본문을 작성해주세요.' value={content} onChange={onContentChangeHandler} />
                            <div className='icon-button' onClick={onImageUploadButtonClickHandler}>
                                <div className='icon icon-image-box-light'></div>
                            </div>
                            <input ref={imageInputRef} type='file' accept='image/*' style={{ display:'none' }} onChange={onImageChangeHandler} />
                        </div>

                        <div className='board-write-images-box'>
                            {imageUrls.map((imageUrl, index) =>
                                <div key={`board-write-image-wrapper-${index}`} className='board-write-image-box'>
                                    <img className='board-write-image' src={imageUrl} />
                                    <div className='icon-button image-close' onClick={() => onImageCloseButtonClickHandler(index)} >
                                        <div className='icon icon-close'></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
            </div>
            
            <div className='horizontal-layout-container right-40'>
                <div className='board-write-control-box'>
                    { loginUser?.authorizationLevel!==UserAuthority.ADMIN && loginUser?.authorizationLevel!==UserAuthority.MEMBER && (
                        <>
                            <InputTextBox 
                                ref={nicknameRef}
                                inputElementId='border-write-writer-nickname' 
                                label='닉네임'
                                type={nicknameInputType}
                                name='nickname'
                                placeHolder='3자~10자 이내' 
                                isRequired={true}
                                value={nickname}
                                onBlurEventHandler={onNicknameBlurHandler}
                                onChangeEventHanlder={onNicknameChangeHandler}
                                onKeyDownEventHandler={onNicknameKeyDownHandler}
                                isError={isNicknameError}
                                errorMessage={nicknameErrorMessage}
                                />
                            <InputTextBox 
                                ref={passwordRef}
                                inputElementId='bord-write-writer-password' 
                                label='비밀번호'
                                type={passwordInputType}
                                name='password'
                                placeHolder='8~16자 이내' 
                                isRequired={true}
                                value={password}
                                onBlurEventHandler={onPasswordBlurHandler}
                                onChangeEventHanlder={onPasswordChangeHandler}
                                onKeyDownEventHandler={onPasswordKeyDownHandler}
                                isError={isPasswordError}
                                errorMessage={passwordErrorMessage}
                                switchInputType={switchPasswordInputType}
                                />
                            <InputTextBox 
                                ref={telNumberRef}
                                inputElementId='bord-write-writer-telnumber' 
                                label='휴대폰 번호'
                                type={telnumberInputType}
                                name='telnumber'
                                placeHolder='이벤트 참여/유선 답변을 원하시면 작성해주세요.' 
                                isRequired={false}
                                value={telNumber}
                                onBlurEventHandler={onTelNumberBlurHandler}
                                onChangeEventHanlder={onTelNumberChangeHandler}
                                onKeyDownEventHandler={onTelNumberKeyDownHandler}
                                isError={isTelNumberError}
                                errorMessage={telNumberErrorMessage}
                                />
                            { telNumber && (
                                <>
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
                                                    <tbody>
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
                                                    </tbody>
                                                </table>
                                                위 동의를 거부하시려면 휴대폰 번호를 삭제해주시기 바랍니다. <br/>
                                            </span>
                                            <span style={{fontSize:'0.6875rem'}}>
                                                (단, 유선 답변 및 이벤트 등의 일부 기능에 제한이 있을 수 있습니다.)
                                            </span>
                                        </motion.div>
                                    )}
                                </>
                            )}
                        </>
                    )}

                    { loginUser?.authorizationLevel!==UserAuthority.ADMIN && (
                        <InputCheckBox
                            isChecked={isSecret}
                            labelText={secretLabelText}
                            onChangeHandler={onSecretChange}
                            tooltipMessage={secretTooltipMessage}
                            tooltipType={secretTooltipType}
                            tooltipSvgType={secretTooltipSvgType}
                            inputElementId={secretInputElementId}
                        />
                    )}

                    { loginUser?.authorizationLevel===UserAuthority.ADMIN && (
                            <InputCheckBox
                                isChecked={isNotice}
                                labelText={noticeLabelText}
                                onChangeHandler={onNoticeChange}
                                tooltipMessage={noticeTooltipMessage}
                                tooltipType={noticeTooltiplType}
                                tooltipSvgType={noticeTooltipSvgType}
                                inputElementId={noticeInputElementId}
                            />
                    )}

                        

                            
                        
                    { 
                        // title과 content는 필수
                        title && content && 
                        (
                            // 비회원일 경우
                            (loginUser?.authorizationLevel!=undefined && loginUser?.authorizationLevel<3 && 
                                //  닉네임과 비밀번호 필수. 
                                nickname && !isNicknameError && password && !isPasswordError  &&
                                // 전화번호 입력했을 시 개인정보 제공 동의도 필수
                                ( (!telNumber && !isTelNumberError) || (telNumber && !isTelNumberError && isAgreed))
                            ) ||
                            // 회원일 경우 통과
                            (
                                loginUser?.authorizationLevel!=undefined && loginUser?.authorizationLevel>=3
                            )
                        ) ? 
                        <div className='able-button-dark' onClick={loginUser?.authorizationLevel < UserAuthority.MEMBER? onGuestUploadButtonClickHandler : onMemberUploadButtonClickHandler}>{'업로드'}</div>
                        :
                        <div className='disable-button'>{'업로드'}</div>
                    }
                    <div className='able-button-light' onClick={onCancleButtonClickHandler}>{'뒤로가기'}</div>
                </div>
            </div>
        </div>

        </>
    )
}

