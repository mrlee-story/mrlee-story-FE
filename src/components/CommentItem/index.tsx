import React, { Dispatch, KeyboardEvent, SetStateAction, useEffect, useRef, useState } from 'react';
import './style.css';
import dayjs from 'dayjs';
import CommentListItem from 'types/interface/comment-list-item.interface';
import DefaultProfileImage from 'assets/image/icon-user-default.png'
import ToolTip from 'components/Tooltip';
import { User, UserGuest, UserMember } from 'types/interface';
import UserAuthority from 'types/enum/user-authority.enum';
import { SignInGuestResponseDto } from 'apis/response/auth';
import ResponseDto from 'apis/response/response.dto';
import ResponseCode from 'types/enum/response-code.enum';
import SignInGuestRequestDto from 'apis/request/auth/sign-in-guest.request.dto';
import { useCookies } from 'react-cookie';
import { ETC_ERROR_ALERT_MESSAGE, JWT_COOKIE_KEY, MAIN_PATH } from 'constant';
import { NavigateFunction } from 'react-router-dom';
import useUserInfoTextForm, { InputTextUserFormType } from 'hooks/user-info-text-form.hook';
import { deleteCommentRequest, patchCommentRequest, signInGuestRequest } from 'apis';
import InputTextBox from 'components/BoardForm/InputTextBox';
import Modal from 'components/Modal';
import { PatchCommentRequestDto } from 'apis/request/board';
import { DeleteCommentResponseDto } from 'apis/response/board';

interface Props {
    commentListItem: CommentListItem;
    // commentorInfo: 'admin' | 'writer' | null
    loginUser:User;
    boardWriterNum:number;
    boardWriterAuth:UserAuthority;
    reloadCommentList:() => void;
    setCommentCount:Dispatch<SetStateAction<number>>;
}

//  component: Comment List Item 컴포넌트   //
export default function CommentItem({ commentListItem, loginUser, boardWriterNum, boardWriterAuth, reloadCommentList, setCommentCount}: Props) {

    //  state : properties   //
    const { commentNumber, writerNickname, writerProfileImage, regdate, content, writerAuthorizationLevel, writerNumber} = commentListItem;

    //  state : 댓글 수정 상태 여부 //
    const [ isEdeting, setEdeting ] = useState<boolean>(false);
    //  state : 수정된 댓글 상태   //
    const [ patchComment, setPatchComment ] = useState<string>(content);

    //  state : 패스워스 모달 표출 여부 상태    //
    const [ showPasswordModal, setShowPasswordModal ] = useState<'댓글 수정' | '댓글 삭제' | null>(null);

    //  state : 패스워드 모달 복사본 상태 : 반드시 수정/삭제에 대한 처리가 이뤄진 후 null로 바뀜   //
    const [ copyStatus, setCopyStatus ] = useState<'댓글 수정' | '댓글 삭제' | null>(null);
    
    const commentorInfo:'admin' | 'writer' | null = writerAuthorizationLevel==UserAuthority.ADMIN? 
            'admin'
            :
            writerAuthorizationLevel==boardWriterAuth && writerNumber==boardWriterNum?
                'writer'
                :
                null;

            
    //  state : 쿠키 상태   //
    const [cookies, setCookie] = useCookies([JWT_COOKIE_KEY]);

    useEffect(() => {
        setPatchComment(commentListItem.content);
    }, [commentListItem]);

    useEffect(() => {
        if (!copyStatus) return;

        switch (copyStatus) {
            case '댓글 삭제' : 
                handleDeleteComment();
            break;
                
            case '댓글 수정' : 
                handlePatchComment();
            break;
        }
    }, [loginUser])

    //  function : 댓글 작성자 여부 확인 로직   //
    const checkCommenter = () => {
        if (!loginUser || !commentListItem) {
            return false;
        }

        if ( loginUser.authorizationLevel==writerAuthorizationLevel ) {
            if ( loginUser.authorizationLevel==UserAuthority.MEMBER ) {
                const member = loginUser as UserMember;
                if (member.memberNumber == writerNumber) {
                    return true;
                }
            } else if (loginUser.authorizationLevel==UserAuthority.WRITER || loginUser.authorizationLevel==UserAuthority.COMMENTER ) {
                const guest = loginUser as UserGuest;
                if (guest.nickname == writerNickname 
                    && guest.guestNumber == writerNumber
                ) {
                    return true;
                }
            }
        }
        return false;
    }


    //  event handler : 댓글 수정 이벤트 처리   //
    const handlePatchComment = () => {
        if ( !commentListItem || !commentNumber) {
            alert('댓글 정보가 없습니다.');
            return;
        }

        const isCommenter:boolean = checkCommenter();
        // 작성자가 아니면 권한 인증(관리자도 타 게시물 수정 권한은 없음)
        if (!isCommenter) {
            switch (writerAuthorizationLevel) {
                // 상황 1 - 게시물 작성자가 관리자 : 무조건 비인가
                case UserAuthority.ADMIN:
                    alert('권한이 없습니다.');
                    // if (editOrDelete) setEditOrDelete(null);
                    setShowPasswordModal(null);
                    setCopyStatus(null);
                    return;
                // 상황 2 - 게시물 작성자가 회원 : 로그인 페이지로 안내
                case UserAuthority.MEMBER:
                    alert('회원 작성글입니다. 로그인 후 이용해주세요.');
                    // if (editOrDelete) setEditOrDelete(null);
                    setShowPasswordModal(null);
                    setCopyStatus(null);
                    return;
                // 상황 3 - 게시물 작성자가 비회원 : 로그인 사용자 권한에 따라 처리
                default : 
                    // 상황 3-1 - 로그인 사용자가 회원 : 로그아웃을 안내
                    if (loginUser.authorizationLevel == UserAuthority.MEMBER) {
                        alert('비회원 작성글입니다. 게시글 작성자라면 로그아웃 후 다시 이용해주세요.');
                        // if (editOrDelete) setEditOrDelete(null);
                        setShowPasswordModal(null);
                        setCopyStatus(null);
                    // 상황 3-2 - 로그인 사용자가 게스트 : 비밀번호 입력 Modal 창 띄움
                    } else {
                        // setShowPasswordModal(true);
                        setShowPasswordModal('댓글 수정');
                        setCopyStatus('댓글 수정');
                    }
                    return;
            }
        }
        
        // 작성자라면 수정 페이지로 이동
        // navigate(CONTACT_UPDATE_PATH(boardNumber));
        setEdeting(true);
        setCopyStatus(null);
        return;
    }
    //  event handler : 댓글 삭제 이벤트 처리   //
    const handleDeleteComment = () => {
        if ( !commentListItem || !commentNumber) {
            alert('댓글 정보가 없습니다.');
            return;
        }

        const isCommenter:boolean = checkCommenter();
        // 작성자가 아니면 권한 인증(관리자도 타 게시물 수정 권한은 없음)
        if (!isCommenter && loginUser?.authorizationLevel!=UserAuthority.ADMIN) {
            switch (writerAuthorizationLevel) {
                // 상황 1 - 게시물 작성자가 관리자 : 무조건 비인가
                case UserAuthority.ADMIN:
                    alert('권한이 없습니다.');
                    // if (editOrDelete) setEditOrDelete(null);
                    setShowPasswordModal(null);
                    setCopyStatus(null);
                    return;
                // 상황 2 - 게시물 작성자가 회원 : 로그인 페이지로 안내
                case UserAuthority.MEMBER:
                    alert('회원 작성글입니다. 로그인 후 이용해주세요.');
                    // if (editOrDelete) setEditOrDelete(null);
                    setShowPasswordModal(null);
                    setCopyStatus(null);
                    return;
                // 상황 3 - 게시물 작성자가 비회원 : 로그인 사용자 권한에 따라 처리
                default : 
                    // 상황 3-1 - 로그인 사용자가 회원 : 로그아웃을 안내
                    if (loginUser.authorizationLevel == UserAuthority.MEMBER) {
                        alert('비회원 작성글입니다. 게시글 작성자라면 로그아웃 후 다시 이용해주세요.');
                        // if (editOrDelete) setEditOrDelete(null);
                        setShowPasswordModal(null);
                        setCopyStatus(null);
                    // 상황 3-2 - 로그인 사용자가 게스트 : 비밀번호 입력 Modal 창 띄움
                    } else {
                        // setShowPasswordModal(true);
                        setShowPasswordModal('댓글 삭제');
                        setCopyStatus('댓글 삭제');
                    }
                    return;
            }
        }

        setCopyStatus(null);

        const check = window.confirm('정말 삭제하시겠습니까?');

        if (!check) {
            return;
        }

        //  토큰 검증
        const accessToken = cookies.accessToken;

        if (!accessToken) return;

        deleteCommentRequest(commentNumber, accessToken).then((responseBody:DeleteCommentResponseDto | ResponseDto | null) => {
            if (!responseBody) {
                alert(ETC_ERROR_ALERT_MESSAGE);
                return;
            }
            
            const { code } = responseBody;
            if (code!=ResponseCode.SUCCESS) {
                alert(ETC_ERROR_ALERT_MESSAGE);
                return;
            }

            const { commentCount } = responseBody as DeleteCommentResponseDto;

            reloadCommentList();
            setCommentCount(commentCount);
            alert('성공적으로 삭제되었습니다.');
        })

    }

    //  event handler : 댓글 수정 submit 이벤트 처리   //
    const onClickPatchSubmitCommentHandler = () => {
        //  토큰 검증
        const accessToken = cookies.accessToken;

        if (!accessToken) return;
        const requestBody:PatchCommentRequestDto = {
            content: patchComment,
        }

        patchCommentRequest(commentNumber, requestBody, accessToken).then(patchCommentResponse);
        setEdeting(false);
    }
    // event handler : 댓글 수정 취소 이벤트 처리   //
    const onCanclePatchCommentHandler = () => {
        const check = window.confirm('모든 작업을 취소하시겠습니까?');
        
        if (!check) return;

        setPatchComment(content);
        setEdeting(false);
    }

    //  function : 댓글 수정 response 처리 함수 //
    const patchCommentResponse = (responseBody:ResponseDto | null) => {
        if (!responseBody) {
            alert(ETC_ERROR_ALERT_MESSAGE);
            return;
        }
        
        const { code } = responseBody;

        switch (code) {
            case ResponseCode.DATABASE_ERROR:
                alert('데이터베이스 오류입니다.');
                return;
            case ResponseCode.NOT_EXISTED_BOARD:
                alert('존재하지 않는 게시물입니다.');
                return;
            case ResponseCode.NOT_EXISTED_USER:
                alert('존재하지 않는 사용자입니다.');
                return;
            case ResponseCode.AUTHORIZATION_FAIL:
                alert('수정 권한이 없습니다.');
                return;
            case ResponseCode.SUCCESS:
                break;
            default:
                alert(ETC_ERROR_ALERT_MESSAGE);
                return;
        }

        reloadCommentList();
        alert('수정이 성공적으로 완료되었습니다.');
    }

    //  function : 작성일 경과 시간 함수    //
    const getElapsedTime = () => {
        const now = dayjs();
        const writeTime = dayjs(regdate);
        const gap = now.diff(writeTime, 's');
        if (gap < 60) return `${gap}초 전`;
        if (gap < 3600) return `${Math.floor(gap / 60)}분 전`;
        if (gap < 86400) return `${Math.floor(gap / 3600)}분 전`;
        return `${Math.floor(gap / 86400)}일 전`;
    }
    

    //  render : Comment List Item 렌더링   //
    return (
    <>
        {showPasswordModal && 
            <PasswordModal commentNumber={commentNumber} showPasswordModal={showPasswordModal}
                            setShowPasswordModal={setShowPasswordModal}
                            setCookie={setCookie}
                            />
        }
        <div className='comment-list-item'>
            <div className='comment-list-item-top'>
                <div className='comment-list-item-profile-box'>
                    <div className='comment-list-item-profile-image' style={{ backgroundImage: `url(${writerProfileImage ? writerProfileImage : DefaultProfileImage })` }}>
                    
                    </div>
                </div>
                <div className='comment-list-item-nickname'>
                    { writerNickname }   
                </div>
                <div className='comment-list-item-divider'>
                    { '\|' }
                </div>
                <div className='comment-list-item-time'>
                    { getElapsedTime() }
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    { commentorInfo && <ToolTip type='right' svgType={commentorInfo} message={commentorInfo=='admin' ? '관리자입니다' : '글쓴이입니다'}/> }
                </div>
                <div className='comment-list-item-butto-box'>
                    {
                        isEdeting?
                        <>
                            <p onClick={onClickPatchSubmitCommentHandler}>완료</p>
                            <p onClick={onCanclePatchCommentHandler}>취소</p>
                        </>
                        :
                        <>
                            <p onClick={handlePatchComment}>수정</p>
                            <p onClick={handleDeleteComment}>삭제</p>
                        </>
                    }
                </div>
            </div>
            <div className='comment-list-item-main'>
                {
                    isEdeting?
                    <textarea className='comment-list-item-content' style={{width:'100%', resize:'none'}}
                    value={patchComment} onChange={(e) => {setPatchComment(e.target.value)}}/>
                    :
                    <div className='comment-list-item-content'>
                        { content }
                    </div>
                }
            </div>
        </div>
    </>
    )
}


    //  component 1-3 : 비밀번호 입력 Modal 컴포넌트    //
    const PasswordModal = ({commentNumber, showPasswordModal, setShowPasswordModal, setCookie}) => {
        

        //  state : 비밀번호 확인 버튼 참조 상태(forward)    //
        const submitPasswordRef = useRef<HTMLButtonElement>(null);
        //  state : 비밀번호 훅 상태   //
        const {ref:passwordRef, value:password, inputType:passwordInputType, switchInputType:swtichPasswordInputType, resetValue:resetPassword, onPasswordBlurHandler, onPasswordChangeHandler, isError:isPasswordError, errorMessage:passwordErrorMessage} = useUserInfoTextForm(InputTextUserFormType.Password, {});

        
        //  effect : 패스워드 변경 효과: submit 버튼 활성/비활성 //
        useEffect(() => {
            if (!submitPasswordRef?.current) return;
            if (!password || isPasswordError) {
                submitPasswordRef.current.className='disable-button';
            } else {
                submitPasswordRef.current.className='able-button-dark';
            }
        }, [password, isPasswordError])

        
        //  function : 게스트 로그인 response 처리 함수 //
        const signInGuestResponse = (responseBody: SignInGuestResponseDto | ResponseDto | null) => {
            // 백엔드(서버) 네트워크 또는 도메인 이상 예외
            if (responseBody==null) {
                alert('네트워크 이상입니다.');
                return;
            }

            const { code } = responseBody;

            switch (code) {
                // 기타 예외
                case ResponseCode.DATABASE_ERROR:
                    alert('데이터베이스 오류입니다.');
                return;
                // 인증 실패
                case ResponseCode.SIGN_IN_FAIL:
                case ResponseCode.AUTHORIZATION_FAIL:
                    alert('인증에 실패하였습니다. 로그인 정보를 다시 확인해주세요.');
                    resetPassword();
                    if (passwordRef.current) passwordRef.current.focus();
                return;
                // 존재하지 않는 게시물
                case ResponseCode.NOT_EXISTED_BOARD:
                    alert('존재하지 않는 댓글입니다.');
                    // navigate(CONTACT_PATH());
                return;
                // 성공
                case ResponseCode.SUCCESS:
                break;
                default:
                    alert(ETC_ERROR_ALERT_MESSAGE);
                return;
            }

            const { token, expirationTime } = responseBody as SignInGuestResponseDto;
            const now = new Date().getTime();
            const expires = new Date(now + expirationTime);

            setCookie('accessToken', token, {expires, path:MAIN_PATH()});
            setShowPasswordModal(null);
            // if (showPasswordModal) {
            //     if (showPasswordModal=='댓글 수정') {
            //         handlePatchComment();
            //     } else if (showPasswordModal=='댓글 삭제') {
            //         handleDeleteComment();
            //     }
            // }
        }
        
        //  event handler : 패스워드 submit 버튼 클릭 이벤트 처리   //
        const onBoardPasswordSubmitHandler = () => {
            if (!password || isPasswordError) return;
            
            // 1. 권한이 없는, 2. 게스트라는 가정 하에 렌더링되므로, 게시물 불러오기 전 guest token 발급이 선행되어야 함
            const requestBody:SignInGuestRequestDto = {
                userAuthority: UserAuthority.COMMENTER,
                password: password,
                contentNumber: commentNumber
            };
            
            signInGuestRequest(requestBody).then(response => {
                signInGuestResponse(response);
            });
        }

        
        //  event handler : 패스워트 input 키다운 이벤트 처리   //
        const onPasswordKeyDownHandler = (event:KeyboardEvent<HTMLInputElement>) => {
            if (event.key != 'Enter') return;

            if (!submitPasswordRef.current) return;
            submitPasswordRef.current.focus();
            if (!password || isPasswordError) {
                passwordRef.current?.focus();
                return;
            }
            // submitPasswordRef.current.click();
        };

        return (
            <Modal okButtonRef={submitPasswordRef} onOkPasswordSubmitButtonHandler={onBoardPasswordSubmitHandler} type='prompt' title='비밀번호 입력' alterText={`${showPasswordModal}하기 위하여 비밀번호를 입력해주세요.`} closeModal={() => {setShowPasswordModal(null)}}>
                <InputTextBox
                    ref={passwordRef}
                    inputElementId='bord-write-writer-password' 
                    label='비밀번호'
                    type={passwordInputType}
                    name='password'
                    placeHolder='댓글 작성 시 입력한 비밀번호를 입력하세요.' 
                    isRequired={true}
                    value={password}
                    onBlurEventHandler={onPasswordBlurHandler}
                    onChangeEventHanlder={onPasswordChangeHandler}
                    onKeyDownEventHandler={onPasswordKeyDownHandler}
                    isError={isPasswordError}
                    errorMessage={passwordErrorMessage}
                    switchInputType={swtichPasswordInputType}
                    />
            </Modal>
        )
    }