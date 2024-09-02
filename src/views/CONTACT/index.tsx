import { deleteBoardRequest, getBoardListRequest, getSearchBoardListRequest, signInGuestRequest } from 'apis';
import SignInGuestRequestDto from 'apis/request/auth/sign-in-guest.request.dto';
import { SignInGuestResponseDto } from 'apis/response/auth';
import GetBoardListResponseDto from 'apis/response/board/get-board-list.response.dto';
import ResponseDto from 'apis/response/response.dto';
import InputTextBox from 'components/BoardForm/InputTextBox';
import BoardItem from 'components/BoardItem';
import InfiniteScroll from 'components/InfiniteScroll';
import Modal from 'components/Modal';
import { CONTACT_DETAIL_PATH, CONTACT_PATH, CONTACT_UPDATE_PATH, CONTACT_WRITE_PATH, ETC_ERROR_ALERT_MESSAGE, INFINITE_SCROLL_SIZE, MAIN_PATH } from 'constant';
import useInfiniteScroll from 'hooks/infinite-scroll.hook';
import useUserInfoTextForm, { InputTextUserFormType } from 'hooks/user-info-text-form.hook';
import { ChangeEvent, FocusEventHandler, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';
import ResponseCode from 'types/enum/response-code.enum';
import UserAuthority from 'types/enum/user-authority.enum';
import { Board, UserGuest, UserMember } from 'types/interface';
import './style.css';
import ScrollTop from 'components/ScrollTop';
import { DeleteBoardResponseDto } from 'apis/response/board';
import ToolTip from 'components/Tooltip';

//  component 1 : Contact 게시판 페이지 컴포넌트  //
export default function Contact() {

    //  state : 검색어 상태 //
    const [ searchWord, setSearchWord ] = useState<string>('');
    //  state : 이전 검색어 상태    //
    const [ preSearchWord, setPreWearchWord ] = useState<string | null>(null);

    //  state : 쿠키 상태   //
    const [ cookies, setCookie ] = useCookies();

    //  state : Path 상태  //
    const location = useLocation();
    //  state : 쿼리 파람 상태  //
    const queryParams = new URLSearchParams(location.search);

    //  state : 로그인 사용자 상태  //
    const { loginUser } = useLoginUserStore();

    //  state : 패스워드 입력 모달 show 상태    //
    const [ showPasswordModal, setShowPasswordModal ] = useState<boolean>(false);

    //  state : 최근 클릭한 게시판 번호 상태    //
    const [ currentBoardNumber, setCurrentBoardNumber ] = useState<number>(0);

    //  state : 공지사항 게시물 리스트 상태 //
    const [ noticeList, setNoticeList ] = useState<Board[]>(null);
    
    //  state : 무한 스크롤 커스텀 훅    //
    const { cursor, setCursor, size, contentList, addContentList, resetContentList } = useInfiniteScroll<Board>(0, INFINITE_SCROLL_SIZE);

    //  state : 마지막 게시물 여부  //
    const [ isLast, setLast ] = useState<boolean>(true);

    //  state : 검색 개수 상태   //
    const [ searchCount, setSearchCount ] = useState<number>(-1);

    //  state : 키워드 박스 참조 상태   //
    const searchKeywordBoxRef = useRef<HTMLDivElement>();
    

    //  effect : 초기 렌더링 효과   //
    useEffect(() => {
        getBoardListRequest(0, 100, true).then(getNoticeBoardListResponse);

        const searchWordParam = queryParams.get('searchWord');
        const preSearchWordParam = queryParams.get('preSearchWord');

        if (searchWordParam) {
            setSearchWord(searchWordParam);
            if (preSearchWord) setPreWearchWord(preSearchWordParam);
            getSearchBoardListRequest(searchWordParam, preSearchWordParam).then(getSearchBoardListResponse);
        } else {
            setLast(false);
        }
    }, []);


    //  function : 네비게이트 함수  //
    const navigate = useNavigate();
    
    
    //  function : 게시물 무한스크롤 콜백 핸들링(동기식 Wrapper) 함수getBoard Requst + Response   //
    const callbackGetLatestBoard = async () => {
        if (isLast) {
            return;
        }
        const isLoading = await getBoardListRequest(cursor, size, false).then(getBoardListResponse);
        return isLoading;
    }

    //  function : 게시물 공지사항 respose 처리 함수
    const getNoticeBoardListResponse = async (responseBody:GetBoardListResponseDto | ResponseDto | null) => {
        if (!responseBody) {
            alert(ETC_ERROR_ALERT_MESSAGE);
            setLast(true);
            return false;
        }

        const { code } = responseBody;
        if (code===ResponseCode.DATABASE_ERROR) {
            alert('데이터베이스 오류입니다.');
            setLast(true);
            return false;
        }
        if (code!==ResponseCode.SUCCESS) {
            alert(ETC_ERROR_ALERT_MESSAGE);
            setLast(true);
            return false;
        }

        const { latestBoardList } = responseBody as GetBoardListResponseDto;
        setNoticeList(latestBoardList);
    }

    //  function : 게시물 리스트 response 처리 함수 //
    const getBoardListResponse = async (responseBody: GetBoardListResponseDto | ResponseDto | null) => {
        if (!responseBody) {
            alert(ETC_ERROR_ALERT_MESSAGE);
            setLast(true);
            return false;
        }
        const { code } = responseBody;
        if (code===ResponseCode.DATABASE_ERROR) {
            alert('데이터베이스 오류입니다.');
            setLast(true);
            return false;
        }
        if (code!==ResponseCode.SUCCESS) {
            alert(ETC_ERROR_ALERT_MESSAGE);
            setLast(true);
            return false;
        }

        const { latestBoardList, currentCursor } = responseBody as GetBoardListResponseDto;
        if (latestBoardList.length==0) {
            // observerRef.current.innerText = '마지막 게시물입니다.';
            setLast(true);
            return true;
        }
        addContentList(latestBoardList);
        setCursor(currentCursor);
        // setBoardList((prevData) => [...prevData, ...latestBoardList]);
        // setCursor(currentCursor);
        return false;
        // setLoading(false);
    }

    //  function : 공지사항 수정 처리 함수  //
    const handlePatchNotice = (boardNumber:number) => {
        if (loginUser.authorizationLevel!==UserAuthority.ADMIN) {
            alert('권한이 없습니다.');
            return;
        }
        
        navigate(CONTACT_UPDATE_PATH(boardNumber));

    }
    //  function : 공지사항 삭제 처리 함수  //
    const handleDeleteNotice = (boardNumber:number) => {
        if (loginUser.authorizationLevel!==UserAuthority.ADMIN) {
            alert('권한이 없습니다.');
            return;
        }
        deleteBoardRequest(boardNumber, cookies.accessToken).then((responseBody: DeleteBoardResponseDto | ResponseDto | null) => {
            
            if (!responseBody) {
                alert(ETC_ERROR_ALERT_MESSAGE);
                return;
            }
            const { code } = responseBody;

            if (code!=='SU') {
                alert(responseBody.code + '(' + responseBody.message + ')');
                return;
            }
            
            alert('삭제가 완료되었습니다.');

            navigate(0);
        });
    }
    
    //  event handler : 게시물 클릭 이벤트 처리 함수    /
    const onBoardClickHandler = (boardParam:Board) => {
        if (!boardParam) {
            alert('잘못된 요청입니다. (게시물이 존재하지 않음)');
            return;
        }
        const { boardNumber, secret } = boardParam;

        if (!boardNumber) {
            alert('잘못된 요청입니다.');
            return;
        }

        //  비밀글이 아닐 경우 : 모든 사용자가 조회 가능
        if (!secret) {
            navigate({pathname:CONTACT_DETAIL_PATH(boardNumber)}, {state:{board:boardParam}});
            return;
        }

        /** 비밀글인 경우
         * 1. 게시글의 작성자가 게스트 그룹이라면
         *      - 로그인 사용자가 게스트라면 비밀번호 창 띄움
         *      - 로그인 사용자가 회원이라면 로그아웃을 안내
         * 2. 게시글의 작성자가 회원이라면
         *      - 
         * 3. 게시글의 작성자가 관리자라면
         *      - 관리자만 허용
         */
        if (secret) {
            let hasRole = false;

            // 현재 로그인 사용자가 회원이 아닐 때에만 비밀번호 입력을 받으므로 currnet board number 지정
            // if (!loginUser || loginUser.authorizationLevel==UserAuthority.COMMENTER || loginUser.authorizationLevel==UserAuthority.GUEST) {
                // setShowPasswordModal(true);
                setCurrentBoardNumber(boardNumber);
                // return;
            // }
    
            // 멤버/게스트/ADMIN에 대해 검증 후 role 부여
            if ( loginUser.authorizationLevel==boardParam.writerAuthorizationLevel ) {
                if ( loginUser.authorizationLevel==UserAuthority.MEMBER ) {
                    const member = loginUser as UserMember;
                    if (/* boardParam.writerEmail && member.email==boardParam.writerEmail
                        && */ member.memberNumber == boardParam.writerNumber
                    ) {
                        hasRole = true;
                        // navigate({pathname:CONTACT_DETAIL_PATH(boardNumber)}, {state:{board:boardParam}});
                        // return;
                    }
                } else if (loginUser.authorizationLevel==UserAuthority.WRITER) {
                    const guest = loginUser as UserGuest;
                    if (guest.nickname == boardParam.writerNickname 
                        && guest.guestNumber == boardParam.writerNumber
                    ) {
                        hasRole = true;
                        // navigate({pathname:CONTACT_DETAIL_PATH(boardNumber)}, {state:{board:boardParam}});
                        // return;
                    }
                } else if (loginUser.authorizationLevel==UserAuthority.ADMIN) {
                    hasRole = true;
                    // navigate({pathname:CONTACT_DETAIL_PATH(boardNumber)}, {state:{board:boardParam}});
                    // return;
                }
            } else if (loginUser.authorizationLevel == UserAuthority.ADMIN) {
                hasRole = true;
            }

            // 권한이 없을 때 경험  : 클릭한 게시물의 권한 등급에 따름
            if (!hasRole) {
                switch (boardParam.writerAuthorizationLevel) {
                    // 상황 1 - 게시물 작성자가 관리자 : 무조건 비인가
                    case UserAuthority.ADMIN:
                        alert('권한이 없습니다.');
                        return;
                    // 상황 2 - 게시물 작성자가 회원 : 로그인 페이지로 안내
                    case UserAuthority.MEMBER:
                        alert('회원 작성글입니다. 로그인 후 이용해주세요.');
                        return;
                    // 상황 3 - 게시물 작성자가 비회원 : 로그인 사용자 권한에 따라 처리
                    default : 
                        // 상황 3-1 - 로그인 사용자가 회원 : 로그아웃을 안내
                        // 상황 3-2 - 로그인 사용자가 게스트 : 비밀번호 입력 Modal 창 띄움
                        if (loginUser.authorizationLevel == UserAuthority.MEMBER) {
                            alert('비회원 작성글입니다. 게시글 작성자라면 로그아웃 후 다시 이용해주세요.');
                        } else {
                            setShowPasswordModal(true);
                        }
                        return;
                }
            }

            if (hasRole) {
                navigate({pathname:CONTACT_DETAIL_PATH(boardNumber)}, {state:{board:boardParam}});
                return;
            } else {
                setShowPasswordModal(true);
                // setCurrentBoardNumber(boardNumber);
            }
        }
    }

    //  event handler : 검색어 변경 이벤트 처리 //
    const onSearchWordChangeHandler = (event:ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchWord(value);
    }


    //  event handler : 게시물 작성 버튼 클릭 이벤트 처리   //
    const onWriteClickHandler = () => {
        navigate(CONTACT_WRITE_PATH());
    }

    //  event handler : get search board list response 처리 함수    //
    const getSearchBoardListResponse = (responseBody: GetBoardListResponseDto | ResponseDto | null) => {
        if (!responseBody) return;

        const { code } = responseBody;
        if (code==='DBE') alert('데이터베이스 오류입니다.');
        if (code!=='SU') return;

        if (!searchWord && !queryParams.get('searchWord')) return;

        const { latestBoardList } = responseBody as GetBoardListResponseDto;
        resetContentList();
        addContentList(latestBoardList);
        setSearchCount(latestBoardList.length);
        
        if (searchWord) {
            queryParams.set('searchWord', searchWord);
        }
        if (preSearchWord) {
            queryParams.set('preSearchWord', preSearchWord);
        }
        navigate(`${location.pathname}?${queryParams.toString()}`);

        setPreWearchWord(searchWord);
        setLast(true);

    }

    //  event handler : 검색 버튼 클릭 이벤트 처리  //
    const onClickSearchBoardHandler = () => {
        if (searchWord) {
            if (preSearchWord && searchWord==preSearchWord) return;

            getSearchBoardListRequest(searchWord, preSearchWord).then(getSearchBoardListResponse);
        }
    }
    
    // component 1-1 : 비밀글에 대한 비밀번호 입력 Modal 창 컴포넌트    //
    const BoardSecretValidate = () => {
        
        //  state : 비밀번호 확인 버튼 참조 상태(forward)    //
        const submitSecretPasswordRef = useRef<HTMLButtonElement>(null);
        //  state : 비밀번호 훅 상태   //
        const {ref:secretPasswordRef, value:secretPassword, inputType:secretPasswordInputType, switchInputType:swtichSecretPasswordInputType, resetValue:resetSecretPassword, onPasswordBlurHandler:onSecretPasswordBlurHandler, onPasswordChangeHandler:onSecretPasswordChangeHandler, isError:isSecretPasswordError, errorMessage:secretPasswordErrorMessage} = useUserInfoTextForm(InputTextUserFormType.Password, {});

        //  effect : 패스워드 변경 효과: submit 버튼 활성/비활성 //
        useEffect(() => {
            if (!submitSecretPasswordRef?.current) return;

            if (!secretPassword || isSecretPasswordError) {
                submitSecretPasswordRef.current.className='disable-button';
            } else {
                submitSecretPasswordRef.current.className='able-button-dark';
            }
            
        }, [secretPassword, isSecretPasswordError]);

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
                    resetSecretPassword();
                    if (secretPasswordRef.current) secretPasswordRef.current.focus();
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
            navigate(CONTACT_DETAIL_PATH(currentBoardNumber));
        }
        
        //  event handler : 패스워드 submit 버튼 클릭 이벤트 처리   //
        const onBoardSecretClickHandler = () => {
            if (!secretPassword || isSecretPasswordError) return;
            
            // 이 컴포넌트는 1. 권한이 없는, 2. 게스트라는 가정 하에 렌더링되므로, 게시물 불러오기 전 guest token 발급이 선행되어야 함
            const requestBody:SignInGuestRequestDto = {
                userAuthority: UserAuthority.WRITER,
                password: secretPassword,
                contentNumber: currentBoardNumber
            };
            
            signInGuestRequest(requestBody).then(response => {
                signInGuestResponse(response);
            });
        }


        //  event handler : 패스워트 input 키다운 이벤트 처리   //
        const onSecretPasswordKeyDownHandler = (event:KeyboardEvent<HTMLInputElement>) => {
            if (event.key != 'Enter') return;

            if (!submitSecretPasswordRef.current) {
                return;
            }

            submitSecretPasswordRef.current.focus();

            if (!secretPassword || isSecretPasswordError) {
                secretPasswordRef.current?.focus();
                return;
            }
            submitSecretPasswordRef.current.click();
        };

        return (
            <Modal okButtonRef={submitSecretPasswordRef} onOkPasswordSubmitButtonHandler={onBoardSecretClickHandler} type='prompt' title='비밀번호 입력' alterText={`비밀글입니다. 비밀번호를 입력해주세요.`} closeModal={ () => { setShowPasswordModal(false) } }>
                    <InputTextBox
                        ref={secretPasswordRef}
                        inputElementId='bord-write-writer-password' 
                        label='비밀번호'
                        type={secretPasswordInputType}
                        name='password'
                        placeHolder='게시글 작성 시 입력한 비밀번호를 입력하세요.' 
                        isRequired={true}
                        value={secretPassword}
                        onBlurEventHandler={onSecretPasswordBlurHandler}
                        onChangeEventHanlder={onSecretPasswordChangeHandler}
                        onKeyDownEventHandler={onSecretPasswordKeyDownHandler}
                        isError={isSecretPasswordError}
                        errorMessage={secretPasswordErrorMessage}
                        switchInputType={swtichSecretPasswordInputType}
                        />
            </Modal>
        )
    }


    //  render : Contact 게시판 페이지 컴포넌트 렌더링  //
    return (
        <section className="contact-section">
            { showPasswordModal && (
                <BoardSecretValidate />
            )}

            <div className="contact-header-container">
                <h1 className='contact-title'>
                    Contact
                </h1>

                <div className='contact-button-container'>
                    <div className='contact-burtton-search-box'>
                        <div className='contact-search-wrapper'>
                            <label htmlFor="search" className="contact-blind">내용 검색</label>
                            <div ref={searchKeywordBoxRef} className='contact-search-input-wrapper'>
                                <input id="contact-search" className='contact-search-input-text' type="search" name="" placeholder="검색어를 입력해주세요." value={searchWord} 
                                    onChange={onSearchWordChangeHandler} 
                                    autoComplete="off"
                                    // onFocus={onFocusSearchBoxHandler} 
                                    // onBlur={() => {searchKeywordBoxRef.current.classList.remove('keyword-active')}}
                                    />
                            </div>
                            <div className='contact-button-wrapper'>
                                <button className="contact-btn contact-btn-dark" onClick={onClickSearchBoardHandler}>검색</button>
                            </div>
                        </div>
                    </div>
                    <div className='contact-write-button-wrapper'>
                        <div className='contact-write-button' onClick={onWriteClickHandler}>{'글 쓰기'}</div>
                    </div>
                </div>
            </div>

            <div className='contact-container' >
                <div className='contact-notice-title-container'>
                    <input type='checkbox' name='accordion-title' id='notice-title' />
                    <label htmlFor='notice-title'>
                        
                        <div className='icon-box-auto'>
                            <div className='icon icon-notice'></div>
                        </div>
                        공지사항
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width={25} height={25}>
                            <path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"/>
                        </svg>
                    </label>
                    <div>
                        {
                            !noticeList || noticeList.length==0 && (
                                <h1 style={{margin:'5dvh 0'}}>등록된 공지사항이 없습니다.</h1>
                            )
                        }
                        { noticeList && noticeList.length>0 && (
                            <>
                                {noticeList.map( (item, index) => (
                                    <div key={`contact-notice-content-item-${index}`} className='contact-notice-content-container'>
                                        <input type='checkbox' name='accordion-content' id={`notice-content-${item.boardNumber}`} />
                                        <label htmlFor={`notice-content-${item.boardNumber}`}>
                                            <span>{item.title}</span>
                                            <div className='contact-notice-info-box'>
                                                <span>{item.writerNickname}</span>
                                                <span>{item.regdate}</span>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width={25} height={25}>
                                                <path d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"/>
                                            </svg>
                                        </label>
                                        <div>
                                            {
                                                loginUser.authorizationLevel==UserAuthority.ADMIN && (
                                                    <div className='notice-admin-control-box'>
                                                        <div className='notice-admin-control-button' onClick={() => handlePatchNotice(item.boardNumber)}>{'수정'}</div>
                                                        <div className='notice-admin-control-button' onClick={() => handleDeleteNotice(item.boardNumber)}>{'삭제'}</div>
                                                    </div>
                                                )
                                            }
                                            <div>{item.content}</div>
                                            <div>
                                                {item.boardImageList.map ( (image, imgIndex) => (
                                                    <img key={`notice-image-${imgIndex}`} style={{width:'60%'}} src={image} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) )}
                            </>
                        )}
                    </div>




                </div>
            </div>


            <div id='contact-content-list'>
                <div className="contact-container">
                    <div className='contact-content-title'>
                        <div className='icon-box-auto'>
                            <div className='icon icon-board'></div>
                        </div>
                        게시판
                    </div>
                {/* { boardList.map( item => (
                    <BoardItem boardListItem={item} onClickHandler={(e) => onBoardClickHandler(item)} />
                )) } */}
                { !contentList || contentList.length==0 && (
                    <div style={{width:'100%', textAlign:'center', marginTop:'10dvh'}}>
                        <h1>등록된 게시물이 없습니다.</h1>
                    </div>
                )}
                { contentList && contentList.length>0 && contentList.map( (item, index) => (
                    <BoardItem key={`contact-board-item-${index}`} boardListItem={item} onClickHandler={(e) => onBoardClickHandler(item)} />
                )) }
                </div>
            </div>
        <InfiniteScroll callback={callbackGetLatestBoard} isLast={isLast} contentName='게시물'/>
        <ScrollTop />
    </section>
    )

}
