import MenuButtonItem from 'components/MenuButtonItem';
import { ABOUT_PATH, AUTH_PATH, CONTACT_PATH, ETC_ERROR_ALERT_MESSAGE, JWT_COOKIE_KEY, LIBRARY_PATH, MAIN_PATH, MILESTONES_PATH } from 'constant';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';
import useNavFoldingStore from 'store/nav-folding.store';
import UserAuthority from 'types/enum/user-authority.enum';
import './style.css';
import { RefObject, useEffect, useRef, useState } from 'react';
import { deleteMemberRequest } from 'apis';
import ResponseDto from 'apis/response/response.dto';
import ResponseCode from 'types/enum/response-code.enum';

interface NavProps {
  currentPath: string;
}

export default function Nav(props:NavProps) {
  //  state : nav folding 여부 상태   //
  const { isFolding, setFolding } = useNavFoldingStore();

  //  state : 로그인 유저 전역 상태 //
  const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();

  //  state : cookie 상태 //
  const [ cookies, , removeCookie ] = useCookies([JWT_COOKIE_KEY]);



  //  function : 네비게이트 함수  //
  const navigate = useNavigate();

  //  event handler : 로그인 창 이동  //
  const onSignInLinkClickHandler = () => {
    navigate(AUTH_PATH());
  }

  //  event handler : 로그아웃 이벤트 처리  //
  const onSignOutLinkClickHandler = () => {
    resetLoginUser();
    // setCookie('accessToken', '', { path: MAIN_PATH(), expires : new Date() });
    removeCookie(JWT_COOKIE_KEY);
    navigate(MAIN_PATH());
  }

  //  event handler : 회원 탈퇴 이벤트 처리 //
  const onDeleteAcoutinkClickHandler = () => {
    const check = window.confirm('정말 회원탈퇴하시겠습니까?\r\n(회원 정보가 영구 삭제됩니다)');

    if (!check) return;

    const token = cookies?.accessToken;

    if (!token) {
      alert('오류: 접속 정보를 찾을 수 없습니다.;');
    }

    deleteMemberRequest(token).then(deleteMemberResponse);
  }

  const deleteMemberResponse = (responseBody:ResponseDto | null) =>  {
    if (!responseBody) {
      alert(ETC_ERROR_ALERT_MESSAGE);
      return;
    }
    const { code } = responseBody as ResponseDto;

    if (code!=ResponseCode.SUCCESS) {
      alert(`오류 : ${responseBody.message}`);
      return;
    }

    alert('회원 탈퇴되었습니다. 이용해주셔서 감사합니다.');
    resetLoginUser();
    removeCookie(JWT_COOKIE_KEY);
    navigate(MAIN_PATH());
  }

  return (
    <>
      <div id='nav' className={`${isFolding? 'hide-menu' : 'show-menu'}`} >
        <div className='nav-container'>
          <MenuButtonItem currentPath={props.currentPath} label={'Home'} toPath={MAIN_PATH()} />
          <MenuButtonItem currentPath={props.currentPath} label={'About'} toPath={ABOUT_PATH()} />
          <MenuButtonItem currentPath={props.currentPath} label={'Portfolio'} toPath={MILESTONES_PATH()} />
          <MenuButtonItem currentPath={props.currentPath} label={'Library'} toPath={LIBRARY_PATH()} />
          <MenuButtonItem currentPath={props.currentPath} label={'Contact'} toPath={CONTACT_PATH()} />
        </div>
        <div className='auth-button-container'>
          { !loginUser || (loginUser && loginUser.authorizationLevel!==UserAuthority.ADMIN && loginUser.authorizationLevel!==UserAuthority.MEMBER ? (
            <div className='auth-description'>
              <div className='auth-description-box'>
                            <div className='auth-description'>
                                {'회원이신가요?'}&nbsp;&nbsp;&nbsp;&nbsp;
                                <span className='auth-description-link' onClick={onSignInLinkClickHandler}>
                                    {'로그인'}
                                </span>
                            </div>
                        </div>
            </div>
          ) : (
            <div className='auth-description'>
              <div className='auth-description-box'>
                            <div className='auth-description'>
                                <span className='auth-description-link' onClick={onSignOutLinkClickHandler}>
                                    {'로그아웃'}&nbsp;&nbsp;&nbsp;&nbsp;
                                </span>
                                <span className='auth-description-link' onClick={onDeleteAcoutinkClickHandler}>
                                    {'회원탈퇴'}
                                </span>
                            </div>
                        </div>
            </div>
          )
        )}

        </div>
      </div>
    </>
  )
}