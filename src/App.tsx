import { getSignInUserRequest } from 'apis';
import ResponseDto from 'apis/response/response.dto';
import { GetSignInUserResponseDto } from 'apis/response/user';
import { FramerMotionConfig } from 'config/framer-motion-configuation';
import { ABOUT_PATH, AUTH_PATH, CONTACT_DETAIL_PATH, CONTACT_PATH, CONTACT_PRE_SEARCH_PATH, CONTACT_SEARCH_PATH, CONTACT_UPDATE_PATH, CONTACT_WRITE_PATH, JWT_COOKIE_KEY, LIBRARY_PATH, MAIN_PATH, MILESTONES_PATH } from 'constant';
import { MotionConfig } from 'framer-motion';
import Container from 'layouts/Container';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Route, Routes } from 'react-router-dom';
import useLoginUserStore from 'store/login-user.store';
import { Vector3 } from 'three';
import ResponseCode from 'types/enum/response-code.enum';
import UserAuthority from 'types/enum/user-authority.enum';
import Authentication from 'views/Authentication';
import BoardDetail from 'views/Board/Detail';
import BoardUpdate from 'views/Board/Update';
import BoardWrite from 'views/Board/Write';
import Contact from 'views/CONTACT';
import Library from 'views/LIBRARY';
import Main from 'views/Main';
import Milestones from 'views/MILESTONES';
import './App.css';
import About from 'views/ABOUT';
import LoadingScreen from 'components/LoadingScreen';

//  TODO delete //
const getRandomPosition = (radius: number) => {
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * radius;
  return new Vector3(Math.cos(angle) * distance, Math.sin(angle) * distance, 0);
}


//  Components : Application 메인 컴포넌트  //
function App() {

  //  state : 로그인 유저 전역 상태 //
  const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();
  //  state : cookie 상태 //
  const [ cookies, , removeCookie ] = useCookies([JWT_COOKIE_KEY]);
  //  state : 중복 실행 발지를 위한 cookie 복사본 상태
  const [ accessToken, setAccessToken ] = useState<string>(null);
  //  state : 로딩 완료 여부 상태 //
  const [ started, setStarted ] = useState<boolean>(false);


  //  function : 로그인 유저 response 처리 함수 //
  const getSignInUserResponse = (responseBody: GetSignInUserResponseDto | ResponseDto | null) => {
    if (!responseBody) return;

    const { code } = responseBody;

    if (code===ResponseCode.AUTHORIZATION_FAIL || code===ResponseCode.NOT_EXISTED_USER || code===ResponseCode.DATABASE_ERROR) {
      resetLoginUser();
      return;
    }

    const {loginUser:responseUser} = { ...responseBody as GetSignInUserResponseDto };

    if (!responseUser || responseUser.authorizationLevel===UserAuthority.GUEST) {
      resetLoginUser();
      // setCookie('accessToken', '', { path: MAIN_PATH(), expires : new Date() });
      removeCookie(JWT_COOKIE_KEY);
      setAccessToken(null);
      return;
    }

    setLoginUser(responseUser);
  }

  useEffect(() => {
    if (!cookies.accessToken) return;

    setAccessToken(cookies.accessToken);
    getSignInUserRequest(cookies.accessToken).then(getSignInUserResponse);
  }, [])

  //  effect : 엑세스 토큰 값 변경 효과(login user store 세팅) //
  useEffect(() => {
    if (!cookies.accessToken) {
      resetLoginUser();
      setAccessToken(null);
      return;
    }

    if (cookies.accessToken === accessToken) {
      return;
    }

    setAccessToken(cookies.accessToken);
    getSignInUserRequest(cookies.accessToken).then(getSignInUserResponse);
  }, [cookies.accessToken]);

  //  render : Application 메인 컴포넌트 렌더링 //
  return (
    <>
      <LoadingScreen started={started} setStarted={setStarted} />
      <MotionConfig transition={{...FramerMotionConfig}}>
          <Routes>
            <Route element={<Container />}>
              <Route path={MAIN_PATH()} element={<Main />} />
              <Route path={AUTH_PATH()} element={<Authentication />} />
              <Route path={ABOUT_PATH()} element={<About />} />
              <Route path={MILESTONES_PATH()} element={<Milestones />} />
              <Route path={LIBRARY_PATH()} element={<Library />} />
              <Route path={CONTACT_PATH()} element={<Contact />} />
              <Route path={CONTACT_SEARCH_PATH(':searchWord')} element={<Contact />} />
              <Route path={CONTACT_PRE_SEARCH_PATH(':searchWord', ':preSearchWord')} element={<Contact />} />
              <Route path={CONTACT_WRITE_PATH()} element={<BoardWrite />} />
              <Route path={CONTACT_UPDATE_PATH(':boardNumber')} element={<BoardUpdate />} />
              <Route path={CONTACT_DETAIL_PATH(':boardNumber')} element={<BoardDetail />} />
              {/* </Route> */}
              <Route path={AUTH_PATH()} element={<Authentication />} />
            </Route>
          </Routes>
      </MotionConfig>
    </>
  );

}

export default App;
