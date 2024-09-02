import { deleteBoardRequest, getBoardRequest, getCommentListRequest, increaseViewCountRequest, postCommentRequest, signInGuestRequest } from 'apis';
import SignInGuestRequestDto from 'apis/request/auth/sign-in-guest.request.dto';
import PostCommentRequestDto from 'apis/request/board/post-comment.request.dto';
import { SignInGuestResponseDto } from 'apis/response/auth';
import { DeleteBoardResponseDto, GetCommentListResponseDto, IncreaseViewCountResponseDto } from 'apis/response/board';
import GetBoardResponseDto from 'apis/response/board/get-board.response.dto';
import PostCommentResponseDto from 'apis/response/board/post-comment.response.dto';
import ResponseDto from 'apis/response/response.dto';
import defaultProfileImage from 'assets/image/icon-user-default.png';
import InputCheckBox from 'components/BoardForm/InputCheckBox';
import InputTextBox from 'components/BoardForm/InputTextBox';
import CommentItem from 'components/CommentItem';
import InfiniteScroll from 'components/InfiniteScroll';
import Modal from 'components/Modal';
import { AUTH_PATH, CONTACT_PATH, CONTACT_UPDATE_PATH, ETC_ERROR_ALERT_MESSAGE, INFINITE_SCROLL_SIZE, JWT_COOKIE_KEY, MAIN_PATH } from 'constant';
import dayjs from 'dayjs';
import useInfiniteScroll from 'hooks/infinite-scroll.hook';
import useUserInfoCheckForm, { InputCheckUserFormType } from 'hooks/user-info-check-form.hook';
import useUserInfoTextForm, { InputTextUserFormType } from 'hooks/user-info-text-form.hook';
import { ChangeEvent, Dispatch, KeyboardEvent, memo, useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { NavigateFunction, useLocation, useNavigate, useParams } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';
import ResponseCode from 'types/enum/response-code.enum';
import UserAuthority from 'types/enum/user-authority.enum';
import { Board, User, UserGuest, UserMember } from 'types/interface';
import CommentListItem from 'types/interface/comment-list-item.interface';
import './style.css';
import { SetStateAction } from 'jotai';
import ScrollTop from 'components/ScrollTop';

//  component 1 : 게시물 상세 화면 컴포넌트    //
export default function BoardDetail() {

    //  state : 게시물 번호 path variable 상태  //
    const { boardNumber } = useParams();
    //  state : board 상태  //
    const [board, setBoard] = useState<Board | null>(null);
    //  state : 작성자 여부 상태    //
    const [isWriter, setWriter] = useState<boolean>(false);

    //  state : 로그인 유저 상태  //
    const { loginUser } = useLoginUserStore();
    //  state : 쿠키 상태   //
    const [cookies, setCookie] = useCookies([JWT_COOKIE_KEY]);

    //  state : 이미 조회된 컨텐츠인지 여부 상태    //
    const [ viewed, setViewed ] = useState<boolean>(false);
    
    
    // //  state : 수정/삭제 모드 구분 상태 //
    // const [ editOrDelete, setEditOrDelete ] = useState<'수정' | '삭제' | null>(null);
    //  state : 패스워스 모달 표출 여부 상태    //
    const [ showPasswordModal, setShowPasswordModal ] = useState<'수정' | '삭제' | "댓글 작성" | null>(null);

    const state = useLocation().state;

    //  effect : 게시물 번호 변경 시 효과 : board 세팅    //
    useEffect(() => {
        if (!boardNumber) {
            alert('잘못된 게시물 요청입니다. 게시판으로 이동합니다.');
            navigate(CONTACT_PATH());
            return;
        }
        // 게시물 조회 로직 : props에 있다면 해당 props로, 아니라면 request로 board 세팅
        const boardProp:Board = state?.board;
        if ( boardProp==null || boardProp.secret ) {
            const accessToken = cookies.accessToken? cookies.accessToken : '';
            getBoardRequest(boardNumber, accessToken).then(getBoardResponse);
        } else {
            setBoard(boardProp);
        }

        // 조회수 증가 로직
        if (!viewed) {
            setViewed(true);
            increaseViewCountRequest(boardNumber).then(increaseViewCountResponse);
        }

    }, [boardNumber]);

    //  effect : 로그인 사용자 변경 시 효과 : 작성자 여부 갱신 //
    useEffect(() => {
        if (!loginUser || !board) {
            if (isWriter) setWriter(false);
            return;
        }

        if ( loginUser.authorizationLevel==board.writerAuthorizationLevel ) {
            if ( loginUser.authorizationLevel==UserAuthority.MEMBER ) {
                const member = loginUser as UserMember;
                if (/* board.writerEmail && member.email==board.writerEmail
                    && */ member.memberNumber == board.writerNumber
                ) {
                    if (!isWriter) setWriter(true);
                    return;
                }
            } else if (loginUser.authorizationLevel==UserAuthority.WRITER) {
                const guest = loginUser as UserGuest;
                if (guest.nickname == board.writerNickname 
                    && guest.guestNumber == board.writerNumber
                ) {
                    if (!isWriter) setWriter(true);
                    return;
                }
            } else if (loginUser.authorizationLevel==UserAuthority.ADMIN) {
                if (!isWriter) setWriter(true);
                return;
            }
        }
        if (isWriter) setWriter(false);
        
    }, [loginUser, board]);
        
    //  effect : 수정/삭제 모드 구번 변경 효과  //
    useEffect(() => {
        if (!showPasswordModal) return;

        switch (showPasswordModal) {
            case '삭제' : 
                handleDeleteBoard();
                break;
            case '수정' : 
                handlePatchBoard();
                break;
            case '댓글 작성' : 
                // handlePostComment();
                break;
        };
    }, [isWriter, showPasswordModal]);

    

    //  function : 네비게이트 함수  //
    const navigate = useNavigate();
    
    //  function : 게시물 삭제 이벤트 처리  //
    const handleDeleteBoard = () => {
        if ( !boardNumber || !board ) {
            alert('게시물 정보가 없습니다. 게시판 페이지로 이동합니다.');
            navigate(CONTACT_PATH());
            return;
        }

        // 작성자가 아니면서 관리자가 아니라면 권한 인증
        if (!isWriter && loginUser.authorizationLevel!==UserAuthority.ADMIN) {
            switch (board.writerAuthorizationLevel) {
                // 상황 1 - 게시물 작성자가 관리자 : 무조건 비인가
                case UserAuthority.ADMIN:
                    alert('권한이 없습니다.');
                    // if (editOrDelete) setEditOrDelete(null);
                    if (showPasswordModal) setShowPasswordModal(null);
                    return;
                // 상황 2 - 게시물 작성자가 회원 : 로그인 페이지로 안내
                case UserAuthority.MEMBER:
                    alert('회원 작성글입니다. 로그인 후 이용해주세요.');
                    // if (editOrDelete) setEditOrDelete(null);
                    if (showPasswordModal) setShowPasswordModal(null);
                    return;
                // 상황 3 - 게시물 작성자가 비회원 : 로그인 사용자 권한에 따라 처리
                default : 
                    // 상황 3-1 - 로그인 사용자가 회원 : 로그아웃을 안내
                    // 상황 3-2 - 로그인 사용자가 게스트 : 비밀번호 입력 Modal 창 띄움
                    if (loginUser.authorizationLevel == UserAuthority.MEMBER) {
                        alert('비회원 작성글입니다. 게시글 작성자라면 로그아웃 후 다시 이용해주세요.');
                        // if (editOrDelete) setEditOrDelete(null);
                        if (showPasswordModal) setShowPasswordModal(null);
                    } else {
                        // if (!showPasswordModal) setShowPasswordModal('삭제');
                    }
                    return;
            }
        }

        // 작성자 또는 관리자라면 삭제 권한 가짐
        const checkDelete = window.confirm('정말 삭제하시겠습니까?');

        if (!checkDelete) {
            if (showPasswordModal) {
                setShowPasswordModal(null);
            }
            return;
        }

        deleteBoardRequest(boardNumber, cookies.accessToken).then(deleteBoardResponse);
    }
    //  function : delete board response 처리 함수 //
    const deleteBoardResponse = (responseBody: DeleteBoardResponseDto | ResponseDto | null) => {
        if (!responseBody) return;

        const { code } = responseBody;
        
        if (code==='VF') alert('잘못된 접근입니다.');
        if (code==='NU') alert('존재하지 않는 유저입니다.');
        if (code==='NB') alert('존재하지 않는 게시물입니다.');
        if (code==='AF') alert('인증에 실패했습니다.');
        if (code==='NP') alert('권한이 없습니다.');
        if (code==='DBE') alert('데이터베이스 오류입니다.');
        if (code!=='SU') return;

        alert('삭제가 완료되었습니다.');

        navigate(CONTACT_PATH());
    }

    //  function : 게시물 수정 이벤트 처리  //
    const handlePatchBoard = () => {
        if (!boardNumber || !board) {
            alert('게시물 정보가 없습니다. 게시판 페이지로 이동합니다.');
            navigate(CONTACT_PATH());
            return;
        }

        // 작성자가 아니면 권한 인증(관리자도 타 게시물 수정 권한은 없음)
        if (!isWriter) {
            switch (board.writerAuthorizationLevel) {
                // 상황 1 - 게시물 작성자가 관리자 : 무조건 비인가
                case UserAuthority.ADMIN:
                    alert('권한이 없습니다.');
                    // if (editOrDelete) setEditOrDelete(null);
                    if (setShowPasswordModal) setShowPasswordModal(null);
                    return;
                // 상황 2 - 게시물 작성자가 회원 : 로그인 페이지로 안내
                case UserAuthority.MEMBER:
                    alert('회원 작성글입니다. 로그인 후 이용해주세요.');
                    // if (editOrDelete) setEditOrDelete(null);
                    if (showPasswordModal) setShowPasswordModal(null);
                    return;
                // 상황 3 - 게시물 작성자가 비회원 : 로그인 사용자 권한에 따라 처리
                default : 
                    // 상황 3-1 - 로그인 사용자가 회원 : 로그아웃을 안내
                    if (loginUser.authorizationLevel == UserAuthority.MEMBER) {
                        alert('비회원 작성글입니다. 게시글 작성자라면 로그아웃 후 다시 이용해주세요.');
                        // if (editOrDelete) setEditOrDelete(null);
                        if (showPasswordModal) setShowPasswordModal(null);
                    // 상황 3-2 - 로그인 사용자가 게스트 : 비밀번호 입력 Modal 창 띄움
                    } else {
                        // setShowPasswordModal(true);
                        setShowPasswordModal('수정');
                    }
                    return;
            }
        }
        
        // 작성자라면 수정 페이지로 이동
        navigate(CONTACT_UPDATE_PATH(boardNumber));
        return;
    }

    //  function : 게시물 조회수 증가 response 처리 함수   //
    const increaseViewCountResponse = (responseBody:IncreaseViewCountResponseDto | ResponseDto | null) => {
        if (!responseBody) {
            alert(ETC_ERROR_ALERT_MESSAGE);
            return;
        }
        const { code } = responseBody;
        switch (code) {
            case ResponseCode.NOT_EXISTED_BOARD:
                alert('존재하지 않는 게시물입니다.');
                return;
            case ResponseCode.DATABASE_ERROR:
                alert('데이터베이스 오류입니다.');
                return;
        }
    }

    //  function : 게시물 response 처리 함수    //
    const getBoardResponse = (responseBody:GetBoardResponseDto | ResponseDto | null) => {
        if (!responseBody) {
            alert(ETC_ERROR_ALERT_MESSAGE);
            navigate(-1);
            return;
        }

        const { code } = responseBody;

        if (code===ResponseCode.NOT_EXISTED_BOARD) {
            alert('존재하지 않는 게시물입니다.');
            navigate(CONTACT_PATH());
            return;
        }
        if (code===ResponseCode.DATABASE_ERROR) {
            alert('데이터베이스 오류입니다.');
            navigate(CONTACT_PATH());
            return;
        }

        // 비밀글에 대해서 회원인데 작성자가 아니거나, 비회원일 경우 처리(Auth Fail 코드에 대한 처리)
        if (code===ResponseCode.AUTHORIZATION_FAIL) {
            const { contentAuthLevel } = responseBody as GetBoardResponseDto;

            if (contentAuthLevel==UserAuthority.MEMBER && loginUser.authorizationLevel < UserAuthority.MEMBER) {
                const goAuthView = window.confirm('비밀글입니다. 로그인하시겠습니까? \r\n(취소하시면 게시판 페이지로 이동합니다.');
                if (goAuthView) {
                    navigate(AUTH_PATH());
                    return;
                } else {
                    navigate(CONTACT_PATH());
                    return;
                }
            }

            // 회원일 경우 취소 후 게시판으로 이동(단, 해당 게시글의 작성자가 비회원 등급일 경우 비회원으로 재로그인에 대한 방법을 안내)
            if ( loginUser.authorizationLevel==UserAuthority.MEMBER ) {
                const message = contentAuthLevel==UserAuthority.GUEST? '비밀글입니다. 게시판 페이지로 이동합니다. \r\n(만약 비회원 게시물 작성자라면 로그아웃 후 다시 이용해주세요.)' : '비밀글입니다. 게시판 페이지로 이동합니다.';
                alert(message);
                navigate(CONTACT_PATH());
                return;
            }
            // 그 외에는 secret 상태를 true로 만들어서 비밀번호 입력창을 띄움
            // setSecretBoard(true);
            return;
        }

        if (code!==ResponseCode.SUCCESS) {
            alert(ETC_ERROR_ALERT_MESSAGE + '\r\n게시판 페이지로 이동합니다.');
            navigate(CONTACT_PATH());
            return;
        }
        const { boardListItem } = { ...responseBody as GetBoardResponseDto };
        setBoard(boardListItem);
    }

    //  component 1-3 : 비밀번호 입력 Modal 컴포넌트    //
    const PasswordModal = () => {

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
                    alert('존재하지 않는 게시물입니다. \r\n 게시판으로 이동합니다.');
                    navigate(CONTACT_PATH());
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
        }
        
        //  event handler : 패스워드 submit 버튼 클릭 이벤트 처리   //
        const onBoardPasswordSubmitHandler = () => {
            if (!password || isPasswordError) return;
            
            // 1. 권한이 없는, 2. 게스트라는 가정 하에 렌더링되므로, 게시물 불러오기 전 guest token 발급이 선행되어야 함
            const requestBody:SignInGuestRequestDto = {
                userAuthority: UserAuthority.WRITER,
                password: password,
                contentNumber: boardNumber
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
                    placeHolder='게시글 작성 시 입력한 비밀번호를 입력하세요.' 
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


    //  render : 게시물 디테일 컴포넌트 렌더링  //
    return (
        <>
        {!board && <></>}

            
        {showPasswordModal && !isWriter && !(showPasswordModal=='삭제' && loginUser.authorizationLevel==UserAuthority.ADMIN) && (
            <PasswordModal />
        )}

        {(board && (!board.secret || (board.secret && (isWriter || loginUser.authorizationLevel==UserAuthority.ADMIN))) ) && 
        // {/* {(!isSecretBoard || (isSecretBoard && isWriter)) &&  */}
            (
            <div id='board-detail-wrapper'>
                <div className='board-detail-container'>
                    <BoardDetailTop board={board} setShowPasswordModal={setShowPasswordModal} navigate={navigate}/>
                    <BoardDetailBottom board={board} setShowPasswordModal={setShowPasswordModal} isWriter={isWriter} 
                                    loginUser={loginUser} cookies={cookies} showPasswordModal={showPasswordModal}
                    />
                </div>
                <ScrollTop />
            </div>
            )
        }
        </>
    )
}


//  component 1-1 : 게시물 상세 화면 상단 컴포넌트    //
interface BoardDetailTopProps {
    board:Board;
    setShowPasswordModal:Dispatch<SetStateAction<any>>;
    navigate:NavigateFunction;
}
const BoardDetailTop = memo((props:BoardDetailTopProps) => {
    const { board, setShowPasswordModal, navigate } = props;
    //  state : more 버튼 상태  //
    const [showMore, setShowMore] = useState<boolean>(false);
    
    //  state : 수정/삭제 표출 태그 참조 상태    //
    const moreButtonRef = useRef<HTMLDivElement>(null);
    //  state : 수정/삭제 박스 태그 참조 상태    //
    const moreElementRef = useRef<HTMLDivElement>(null);

    
    


    //  function : 작성일 포맷 변경 함수    //
    const getWriteDatetimeFormat = (originDate:string) => {
        if (!board) return;
        const date = dayjs(originDate);
        return date.format('YYYY. MM. DD');
    }

    //  function : 마우스 클릭 아웃 효과 함수(more 태그 사라짐)     //
    const handleClickOutside = (e:any) => {
        if (moreElementRef.current && !moreElementRef.current.contains(e.target) && moreButtonRef &&  !moreButtonRef.current?.contains(e.target)) {
            setShowMore(false);
        }
    }





    //  effect : more 창 변경 효과: more 창 활성/비활성  //
    useEffect(() => {
        if (showMore) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showMore]);



    //  event handler : more 버튼 클릭 이벤트 처리(수정/삭제 버튼 보이기 상태 변경) //
    const onMoreBtnClickHandler = () => {
        setShowMore(!showMore);
    }

    //  event handler : 게시판 목록 이동 버튼 클릭 이벤트 처리  //
    const onContactPageClickHandler = () => {
        navigate(CONTACT_PATH());
    }





    //  render 1-1 : 게시물 상세 화면 상단 렌더링   //
    if (!board) return <></>

    return (
        <>
            <div id='board-detail-top'>
                <div className='board-detail-top-button-box'>
                    <div className='board-detail-go-contact-button' onClick={onContactPageClickHandler}>{'목록으로 이동'}</div>
                </div>
                <div className='board-detail-top-header'>
                    <div className='board-detail-title'>
                        {board.title}
                    </div>
                    <div className='board-detail-top-sub-box'>
                        <div className='board-detail-write-info-box'>
                            {/* <div className='board-detail-writer-profile-image'></div> */}
                            <div className='board-detail-writer-profile-image' style={{ backgroundImage: `url( ${board.writerProfileImage? board.writerProfileImage : defaultProfileImage} )` }}></div>
                            <div className='board-detail-writer-nickname'>
                                {board.writerNickname}
                            </div>
                            <div className='board-detail-info-divider'>{'\|'}</div>
                            <div className='board-detail-write-date'>
                                {getWriteDatetimeFormat(board.regdate)}
                                {board.updatedate && <span className='board-detail-update-date'>{`  (수정됨 ${getWriteDatetimeFormat(board.updatedate)})`}</span>}
                            </div>
                        </div>

                        <div className='icon-button' onClick={onMoreBtnClickHandler} ref={moreButtonRef}>
                            <div className='icon icon-more'></div>
                        </div>
                        
                        {showMore && 
                            <div className='board-detail-more-box' ref={moreElementRef}>
                                <div className='board-detail-update-button' onClick={() => (setShowPasswordModal('수정'))}>{'수정'}</div>
                                <div className='divider'></div>
                                <div className='board-detail-delete-button' onClick={() => (setShowPasswordModal('삭제'))}>{'삭제'}</div>
                            </div>
                        }
                    </div>
                </div>
                <div className='divider'></div>
                <div className='board-detail-top-main'>
                    <div className='board-detail-main-text'>
                        {board.content}
                    </div>
                    {board.boardImageList.map( (image, idx) => <img key={`image-${idx}`} className='board-detail-main-image' src={image} />)}
                    
                </div>
            </div>
        </>
    )
})



    
//  component 1-2 : 게시물 상세 화면 하단 컴포넌트    //
interface BoardDetailBottomProps {
    board:Board;
    showPasswordModal:"수정" | "삭제" | "댓글 작성" | null
    setShowPasswordModal:Dispatch<SetStateAction<"수정" | "삭제" | "댓글 작성"  | null>>;
    isWriter:boolean;
    loginUser:User | UserMember | UserGuest;
    cookies:{ accessToken?: any; };
}
const BoardDetailBottom = (props:BoardDetailBottomProps) => {

    const { board, setShowPasswordModal, isWriter, loginUser, cookies, showPasswordModal } = props;
    const { boardNumber } = board;

    //  state : 댓글 textarea 참조 상태 //
    const commentRef = useRef<HTMLTextAreaElement | null>(null);
    // //  state : pagination 관련 상태 //
    // const { currentPage, setCurrentPage, currentSection, setCurrentSection, viewList, viewPageList, totalSection, setTotalList } = usePagination<CommentListItem>(3);
    // state : 전체 댓글 개수 상태   //
    const [commentCount, setCommentCount] = useState<number>(0);
    // state : 댓글 상자 리스트 보기 상태   //
    const [showComment, setShowComment] = useState<boolean>(true);
    // state : 댓글 입력 텍스트 상태   //
    const [comment, setComment] = useState<string>('');


    //  state : 댓글 닉네임 훅 상태   //
    const {ref:nicknameRef, value:nickname, inputType:nicknameInputType, setValue:setNickname, resetValue:resetNickname, onNicknameBlurHandler, onNicknameChangeHandler, isError:isNicknameError, errorMessage:nicknameErrorMessage } = useUserInfoTextForm(InputTextUserFormType.Nickname, {mustDiffentValue:board?.writerNickname});
    //  state : 댓글 비밀번호 훅 상태   //
    const {ref:passwordRef, value:password, inputType:passwordInputType, switchInputType:switchPasswordInputType, setValue:setPassword, onPasswordBlurHandler, onPasswordChangeHandler, isError:isPasswordError, errorMessage:passwordErrorMessage} = useUserInfoTextForm(InputTextUserFormType.Password, {});
    //  state : 작성자 여부 훅 상태  //
    const { isChecked:isCommenterAndWriter, setChecked:setCommenterAndWriter, labelText:isWriterLabelText, tooltipType:isWriterTooltipType, tooltipMessage:isWriterTooltipMessage, tooltipSvgType:isWriterTooltipSvgType, onCheckChangeDefaultHandler:onIsWriterChange, inputElementId:isWriterInputElementId } = useUserInfoCheckForm(InputCheckUserFormType.Writer);

    //  state : 무한 스크롤 커스텀 훅    //
    const { cursor, setCursor, size, contentList, addContentList, setContentList, resetContentList } = useInfiniteScroll<CommentListItem>(0, INFINITE_SCROLL_SIZE);

    //  state : 마지막 게시물 여부  //
    const [ isLast, setLast ] = useState<boolean>(false);

    useEffect(() => {
        setCommentCount(board.commentCount);
    }, []);

    useEffect(() => {
        if (isCommenterAndWriter) {
            setShowPasswordModal('댓글 작성');
            // if (!board?.writerNickname) return;
            // resetNickname();
            // setNickname(board?.writerNickname);
        } else {
            setShowPasswordModal(null);
        }
    }, [isCommenterAndWriter]);

    useEffect(() => {
        if (showPasswordModal) return;

        setCommenterAndWriter(false);
    }, [showPasswordModal])

    // effect : 게시물 번호 path variable 변경 시 좋아요/댓글리스트 로딩    //
    useEffect(() => {
        if (!boardNumber) return;
        // getCommentListRequest(boardNumber).then(getCommentListResponse);
    }, [boardNumber]);

    //  event handler : 댓글 Folding 버튼 클릭 이벤트 처리   //
    const onShowCommentClickHandler = () => {
        setShowComment(!showComment);
    }

    //  event handler : 댓글 변경 이벤트 처리   //
    const onCommentChangeHandler = (event:ChangeEvent<HTMLTextAreaElement>) => {
        setComment(event.target.value);

        
        if (!commentRef.current) return;

        commentRef.current.style.height = 'auto';
        commentRef.current.style.height = `${commentRef.current.scrollHeight}px`;
    }

    //  event handler : 댓글 전송 버튼 클릭 이벤트 처리 //
    const onCommentSubmitButtonClickHandler = () => {
        if ( comment==='' || (!isWriter && !loginUser && loginUser.authorizationLevel>=UserAuthority.MEMBER && (!nickname || !password || isNicknameError || isPasswordError))) return; 
        
        
        const requestBody: PostCommentRequestDto = 
            {
                content: comment,
                nickname: nickname,
                password: password
            };
        postCommentRequest(boardNumber, requestBody, cookies.accessToken).then(postCommentResponse);
    }

    //  function : 댓글 Post response 처리 함수 //
    const postCommentResponse = async (responseBody: PostCommentResponseDto | ResponseDto | null) => {
        if (!responseBody) return;

        const { code } = responseBody;
        if (code==='VF') alert('잘못된 접근입니다.');
        if (code==='NU') alert('존재하지 않는 유저입니다.');
        if (code==='NB') alert('존재하지 않는 게시물입니다.');
        if (code==='AF') alert('인증에 실패했습니다.');
        if (code==='DBE') alert('데이터베이스 오류입니다.');
        if (code!=='SU') return;
        
        const { commentCount } = responseBody as PostCommentResponseDto;
        setCommentCount(commentCount);
        setComment('');
        setNickname('');
        setPassword('');
        setCommenterAndWriter(false);
        if (!boardNumber) return;
        
        // 최신 댓글을 불러오기 위해 커서 초기화
        // const initComment = () => {
            getCommentListRequest(boardNumber, 0, size).then((response) => {
                if (!response) return false;
                const { code } = response;
                switch(code) {
                case ResponseCode.NOT_EXISTED_BOARD:
                    alert('존재하지 않는 게시물입니다.');
                    setLast(true);
                    return false;
                case ResponseCode.DATABASE_ERROR:
                    alert('데이터베이스 오류입니다.');
                    setLast(true);
                    return false;
                case ResponseCode.SUCCESS:
                    break;
                default:
                    alert(ETC_ERROR_ALERT_MESSAGE);
                    setLast(true);
                    return false;
                }
    
                const { commentList, currentCursor } = response as GetCommentListResponseDto;
                if (commentList.length==0) {
                    setLast(true);
                    return true;
                }
                setContentList(commentList);
                setCursor(currentCursor);
            });
        // };
        // await initComment.then
        // getCommentListRequest(boardNumber, cursor, size).then(getCommentListResponse);
    }

    //  function : 댓글 수정/삭제 후 다시 불러오기  //
    const reloadCommentList = () => {
        const loadedCommentSize = contentList.length;
        resetContentList();
        getCommentListRequest(boardNumber, 0, loadedCommentSize).then(getCommentListResponse);
    }

    //  function : 댓글 무한스크롤 콜백 핸들링(동기식 Wrapper) 함수getComment Requst + Response   //
    const callbackGetLatestBoard = async () => {
        if (isLast) {
            return;
        }
        const isLoading = await getCommentListRequest(boardNumber, cursor, size).then(getCommentListResponse);
        return isLoading;
    }

    //  function : get comment list response 처리 함수 //
    const getCommentListResponse = (responseBody: GetCommentListResponseDto | ResponseDto | null) => {
        if (!responseBody) return false;
        const { code } = responseBody;
        switch(code) {
        case ResponseCode.NOT_EXISTED_BOARD:
            alert('존재하지 않는 게시물입니다.');
            setLast(true);
            return false;
        case ResponseCode.DATABASE_ERROR:
            alert('데이터베이스 오류입니다.');
            setLast(true);
            return false;
        case ResponseCode.SUCCESS:
            break;
        default:
            alert(ETC_ERROR_ALERT_MESSAGE);
            setLast(true);
            return false;
        }

        const { commentList, currentCursor } = responseBody as GetCommentListResponseDto;
        if (commentList.length==0) {
            setLast(true);
            return true;
        }
        addContentList(commentList);
        setCursor(currentCursor)
        // setTotalList(commentList);
        // setTotalCommentCount(commentList.length);

        return false;
    }

    



    //  render 1-2 : 게시물 상세 화면 하단 렌더링   //
    return (
        <div id='board-detail-bottom'>
            <div className='board-detail-bottom-button-box'>
                <div className='board-detail-bottom-button-group'>
                        <div className='icon-button'>
                        <div className='icon icon-comment'></div>
                    </div>
                    <div className='board-detail-bottom-button-text'>
                        {`댓글 ${commentCount}`}
                    </div>
                    <div className='icon-button' onClick={onShowCommentClickHandler}>
                    {showComment ? 
                    <div className='icon icon-up-light'></div> : 
                    <div className='icon icon-down-light'></div>
                    }
                    </div>
                </div>
            </div>
            {showComment && (
            <div className='board-detail-bottom-comment-box'>

                <div className='board-detail-bottom-comment-input-box'>
                    <div className='board-detail-bottom-comment-user-input-container'>
                        
                        <div className='board-detail-bottom-comment-user-input-box'>
                            { !isWriter && !loginUser?.nickname && (
                                <>
                                    {
                                        // 게시물 작성자의 등급이 회원이 아닐 경우 : 작성자 여부 체크박스를 표시
                                        board.writerAuthorizationLevel<UserAuthority.MEMBER && 
                                        (
                                            // 로그인 유저가 멤버 이하일 때에만 체크박스 표시
                                            !loginUser || (loginUser && loginUser.authorizationLevel<UserAuthority.MEMBER)
                                    
                                        )
                                        ? (
                                            <InputCheckBox
                                                isChecked={isCommenterAndWriter}
                                                labelText={isWriterLabelText}
                                                onChangeHandler={onIsWriterChange}
                                                tooltipMessage={isWriterTooltipMessage}
                                                tooltipType={isWriterTooltipType}
                                                tooltipSvgType={isWriterTooltipSvgType}
                                                inputElementId={isWriterInputElementId}
                                            />
                                        )
                                        :
                                        <div></div>
                                    }
                                    <InputTextBox 
                                        ref={nicknameRef}
                                        inputElementId='border-write-writer-nickname' 
                                        label='닉네임'
                                        type={nicknameInputType}
                                        name='nickname'
                                        placeHolder='3자~10자 이내' 
                                        isRequired={true}
                                        value={isCommenterAndWriter && board?.writerNickname ? board?.writerNickname : nickname }
                                        onBlurEventHandler={onNicknameBlurHandler}
                                        onChangeEventHanlder={onNicknameChangeHandler}
                                        isError={isNicknameError}
                                        errorMessage={nicknameErrorMessage}
                                        readonly={isWriter || isCommenterAndWriter}
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
                                        isError={isPasswordError}
                                        errorMessage={passwordErrorMessage}
                                        switchInputType={switchPasswordInputType}
                                        />
                                </>
                            )}
                            
                        </div>
                    </div>

                    <div className='board-detail-bottom-comment-input-container'>
                        <textarea ref={commentRef} className='board-detail-bottom-comment-textarea' placeholder='댓글을 작성해주세요.' value={comment} onChange={onCommentChangeHandler} />
                        <div className='board-detail-bottom-comment-button-box'>
                            <div className={comment==='' || (!isWriter && !loginUser && loginUser.authorizationLevel>=UserAuthority.MEMBER && (!nickname || !password || isNicknameError || isPasswordError)) ? 'disable-button' : 'able-button-dark'} onClick={onCommentSubmitButtonClickHandler}>{'댓글 달기'}</div>
                        </div>
                    </div>
                </div>


                {/* <div className='board-detail-bottom-comment-pagination-box'>
                    <Pagination
                        currentPage={currentPage} 
                        currentSection={currentSection} 
                        setCurrentPage={setCurrentPage} 
                        setCurrentSection={setCurrentSection} 
                        viewPageList={viewPageList} 
                        totalSection={totalSection} 
                    />
                </div> */}

                <div className='divider'></div>

                <div className='board-detail-bottom-comment-container'>
                    <div className='board-detail-bottom-comment-title'>
                        {'댓글 '}
                        <span className='emphasis'>
                            {commentCount}
                        </span>
                    </div>
                    <div className='board-detail-bottom-comment-list-container'>
                        { contentList.map( (item, index) => <CommentItem key={`board-detail-bottom-comment-item-${index}`} commentListItem={item} 
                                                                loginUser={loginUser}
                                                                boardWriterAuth={board.writerAuthorizationLevel}
                                                                boardWriterNum={board.writerNumber}
                                                                reloadCommentList={reloadCommentList}
                                                                setCommentCount={setCommentCount}
                                                            />) }

                        <InfiniteScroll callback={callbackGetLatestBoard} isLast={isLast} contentName='댓글'/>
                    </div>
                </div>

            </div>
            )}
        </div>
    )
}