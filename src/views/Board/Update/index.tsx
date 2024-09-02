import { fileUploadRequest, getBoardRequest, patchBoardRequest } from 'apis';
import InputCheckBox from 'components/BoardForm/InputCheckBox';
import { CONTACT_DETAIL_PATH, CONTACT_PATH, ETC_ERROR_ALERT_MESSAGE, JWT_COOKIE_KEY } from 'constant';
import useUserInfoCheckForm, { InputCheckUserFormType } from 'hooks/user-info-check-form.hook';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useBoardStore from 'store/board.store';
import useLoginUserStore from 'store/login-user.store';
import UserAuthority from 'types/enum/user-authority.enum';
import './style.css';
import { GetBoardResponseDto } from 'apis/response/board';
import ResponseDto from 'apis/response/response.dto';
import ResponseCode from 'types/enum/response-code.enum';
import { convertUrlsToFiles } from 'utils';
import PatchBoardRequestDto from 'apis/request/board/patch-board.request.dto';
import PatchBoardResponseDto from 'apis/response/board/patch-board.response.dto';

//  component : 게시물 수정 화면 컴포넌트   //
export default function BoardUpdate() {

    //  state : path 상태   //
    const { pathname } = useLocation();

    //  state : 쿠키 상태   //
    const [ cookies ] = useCookies([JWT_COOKIE_KEY]);

    //  state : 게시물 번호 상태(게시물 수정 작업)  //
    const { boardNumber } = useParams();

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


    //  state : 공지글 훅 상태  //
    const { isChecked:isNotice, setChecked:setNotice, labelText:noticeLabelText, tooltipType:noticeTooltiplType, tooltipMessage:noticeTooltipMessage, tooltipSvgType:noticeTooltipSvgType, onCheckChangeDefaultHandler:onNoticeChange, inputElementId:noticeInputElementId } = useUserInfoCheckForm(InputCheckUserFormType.Notice);
    //  state : 비밀글 훅 상태  //
    const { isChecked:isSecret, setChecked:setSecret, labelText:secretLabelText, tooltipType:secretTooltipType, tooltipMessage:secretTooltipMessage, tooltipSvgType:secretTooltipSvgType, onCheckChangeDefaultHandler:onSecretChange, inputElementId:secretInputElementId } = useUserInfoCheckForm(InputCheckUserFormType.Secret);
    //* 게시판 store 상태   //
    const { title, setTitle } = useBoardStore();
    const { content, setContent }  = useBoardStore();
    const { boardImageFileList, setBoardImageFileList } = useBoardStore();
    // const { isSecret, setSecret } = useBoardStore();
    // const { isNotice, setNotice } = useBoardStore();


    //  effect : 첫 렌더링 시 효과   //
    useEffect(() => {
        const accessToken = cookies.accessToken;
        if (!accessToken) {
            alert('게시물 수정 권한이 없습니다.');
            navigate(-1);
            return;
        }

        if (!boardNumber) {
            alert('잘못된 접근입니다.');
            navigate(-1);
            return;
        }

        getBoardRequest(boardNumber, accessToken).then(getBoardResponse);
    }, [boardNumber]);
    
    //  function : navigate 함수   //
    const navigate = useNavigate();

    //  function : get board response 처리 함수 //
    const getBoardResponse = (responseBody: GetBoardResponseDto | ResponseDto | null) => {
        if (!responseBody) {
            alert(ETC_ERROR_ALERT_MESSAGE);
            navigate(-1);
            return;
        }

        const { code } = responseBody;

        if (code===ResponseCode.NOT_EXISTED_BOARD) {
            alert('존재하지 않는 게시물입니다.');
            navigate(-1);
            return;
        }
        if (code===ResponseCode.DATABASE_ERROR) {
            alert('데이터베이스 오류입니다.');
            navigate(-1);
            return;
        }

        // 비밀글에 대해서 회원인데 작성자가 아니거나, 비회원일 경우 처리(Auth Fail 코드에 대한 처리)
        if (code===ResponseCode.AUTHORIZATION_FAIL) {
            alert('권한이 없습니다.');
            navigate(-1);
            return;
        }

        if (code!==ResponseCode.SUCCESS) {
            alert(ETC_ERROR_ALERT_MESSAGE);
            navigate(-1);
            return;
        }

        const { boardListItem } = { ...responseBody as GetBoardResponseDto };
        const { title, content, boardImageList, secret, notice } = boardListItem;

        setTitle(title);
        setContent(content);
        if (boardImageList) {
            setImageUrls(boardImageList);
        }
        setSecret(secret);
        setNotice(notice);

        if (boardImageList && boardImageList.length>0) {
            convertUrlsToFiles(boardImageList).then(boardImageFileList => setBoardImageFileList(boardImageFileList));
        }
        
        if (titleRef.current) {
            titleRef.current.style.height = 'auto';
            titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
        }


        if (contentRef.current) {
            contentRef.current.style.height = 'auto';
            contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
        }
    }

    //  function : patch board response 처리 함수   //
    const patchBoardResponse = (responseBody: PatchBoardResponseDto | ResponseDto | null) => {
        if (!responseBody) {
            alert(ETC_ERROR_ALERT_MESSAGE);
            navigate(-1);
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

        if (!boardNumber) return;
        navigate(CONTACT_DETAIL_PATH(boardNumber));
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

    // //  event handler : 이미지 업로드 클릭 이벤트 처리 //
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

    //  event handler : 수정 버튼 클릭 이벤트 처리    //
    const onPatchButtonClickHandler = async () => {
        //  토큰 검증
        const accessToken = cookies.accessToken;

        if (!accessToken) return;
        
        // 폼 양식 검증
        if ( !title || !content) {
            alert('필수 내용을 양식에 맞게 모두 작성해주세요.');

            if (!title) titleRef.current?.focus();
            if (!content) contentRef.current?.focus();
            return;
        }

        if (!boardNumber) {
            alert(ETC_ERROR_ALERT_MESSAGE);
            return;
        }

        const confirm = window.confirm('입력하신 내용으로 수정하시겠습니까?');

        if (!confirm) return;

        //  Request Body 생성
        const boardImageUrlList:string[] = [];

        for (const file of boardImageFileList) {
            const data = new FormData();
            data.append('file', file);

            const url = await fileUploadRequest(data);  // 파일 서버 업로드 및 url loading
            if (url) boardImageUrlList.push(url);
        }

        const requestBody: PatchBoardRequestDto = {
            title, content, boardImageUrlList, secret:isSecret, notice:isNotice
        }

        patchBoardRequest(boardNumber, requestBody, accessToken).then(patchBoardResponse);
    }
    
    //  event handler : 취소 버튼 클릭 이벤트 처리  //
    const onCancleButtonClickHandler = () => {
        const check = window.confirm('모든 작업을 취소하고 뒤로 돌아가시겠습니까?');

        if (!check) return;

        navigate(-1);
    }

    //  render : 게시물 수정 화면 컴포넌트 렌더링  //
    return (
        <>
            <div className='board-update-container' >

                <div className='horizontal-layout-container left-60'>

                    <div id='board-update-wrapper'>
                        <div className='board-update-box'>

                            <div className='board-update-title-box'>
                                <textarea ref={titleRef} className='board-updater-title-textarea' rows={1} placeholder='제목을 작성해주세요.' value={title} onChange={onTitleChangeHandler} />
                            </div>

                            <div className='divider'></div>

                            <div className='board-update-content-box'>
                                <textarea ref={contentRef} className='board-update-content-textarea' placeholder='본문을 작성해주세요.' value={content} onChange={onContentChangeHandler} />
                                <div className='icon-button' onClick={onImageUploadButtonClickHandler}>
                                    <div className='icon icon-image-box-light'></div>
                                </div>
                                <input ref={imageInputRef} type='file' accept='image/*' style={{ display:'none' }} onChange={onImageChangeHandler} />
                            </div>

                            <div className='board-update-images-box'>
                                {imageUrls && imageUrls.map((imageUrl, index) =>
                                    <div key={`board-update-image-wrapper-${index}`} className='board-update-image-box'>
                                        <img className='board-update-image' src={imageUrl} />
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
                    <div className='board-update-control-box'>

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
                            title && content ? 
                            <div className='able-button-dark' onClick={onPatchButtonClickHandler}>{'업로드'}</div>
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

