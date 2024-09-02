import DefaultProfileImage from 'assets/image/icon-user-default.png';
import { useNavigate } from 'react-router-dom';
import { Board } from 'types/interface';
import './style.css';
import { CONTACT_DETAIL_PATH } from 'constant';
import defaultSecretIcon from 'assets/image/icon-secret-content.png';

interface Props {
    boardListItem: Board;
    onClickHandler: (board:Board) => void;
}

//   Componenet : Board List Item 컴포넌트  //
export default function BoardItem({ boardListItem, onClickHandler }: Props) {
    //  properties      //
    
    const { boardNumber, title, content, boardImageList, regdate, updatedate } = boardListItem;
    const { writerNumber, writerEmail, writerNickname, writerProfileImage, writerAuthorizationLevel } = boardListItem;
    const { commentCount, viewCount } = boardListItem;
    const { notice, secret } = boardListItem;

    //  function : 네이게이트 함수  //
    const navigate = useNavigate();

    //  event handler : 게시물 아이템 클릭 이벤트 처리 함수     //
    // const onClickHandler = () => {
    //     navigate({pathname:CONTACT_DETAIL_PATH(boardNumber)}, {state:{board:boardListItem}});  
    // }

    //  render : Board List Item 컴포넌트 렌더링 //
    return (
        <div className='board-list-item' onClick={(e) => onClickHandler(boardListItem)}>
            <div className='board-list-item-main-box'>
                <div className='board-list-item-top'>
                    <div className='board-list-item-profile-box'>
                        <div className='board-list-item-profile-image' style={{backgroundImage: `url(${ writerProfileImage ? writerProfileImage : DefaultProfileImage })`}}></div>
                    </div>
                    <div className='board-list-item-write-box'>
                        <div className='board-list-item-nickname'>
                            {writerNickname}
                            {writerEmail && <span className='board-list-item-email'>{writerEmail}</span>}
                        </div>
                        <div className='board-list-item-write-date'>
                            {regdate}
                            {updatedate && <span className='board-list-item-update-date'>{`  (수정됨 ${updatedate})`}</span>}
                        </div>
                    </div>
                </div>
                <div className='board-list-item-middle'>
                    <div className='board-list-item-title'>
                        {/* {title} */}
                        {`${title}`}
                    </div>
                    <div className={secret ? 'board-list-item-content-secret' : 'board-list-item-content' } >
                        {secret ? '비공개 게시물입니다.' : content}
                    </div>
                </div>
                <div className='board-list-item-bottom'>
                    <div className='board-list-item-counts'>
                        {`댓글 ${commentCount} - 조회수 ${viewCount}`}
                    </div>
                </div>
            </div>

            {/* { boardImageList && boardImageList.length>0 && ( */}
            <div className='board-list-item-image-box'>
                <div className='board-list-item-image' style={{ backgroundImage: `url(${ secret ? defaultSecretIcon : boardImageList && boardImageList.length > 0 && boardImageList[0] })` }}></div>
            </div>
            {/* )} */}
        </div>
    )
}
