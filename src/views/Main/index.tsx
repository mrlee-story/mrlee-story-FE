import { Billboard, Environment, OrbitControls, PresentationControls, Scroll, ScrollControls, Stars, Text, TrackballControls, useCursor, useGLTF } from '@react-three/drei';
import { Canvas, Props, useFrame, useLoader, useThree } from '@react-three/fiber';
import { fileUploadRequest, postBoardGuestRequest, postBoardRequest } from 'apis';
import { PostBoardGuestRequestDto, PostBoardRequestDto } from 'apis/request/board';
import { PostBoardGuestResponseDto, PostBoardResponseDto } from 'apis/response/board';
import ResponseDto from 'apis/response/response.dto';
import Ability from 'components/Ability';
import InputCheckBox from 'components/BoardForm/InputCheckBox';
import InputTextBox from 'components/BoardForm/InputTextBox';
import { AvatarMrlee } from 'components/Model/AvatarMrlee';
import { WorkingArea } from 'components/Model/EnvironmentWorkingArea';
import { Ironman } from 'components/Model/Ironman';
import ProjectsGallery from 'components/Projects';
import ScrollGuidance from 'components/ScrollGuidance';
import { ScrollManager } from 'components/ScrollManager';
import Section from 'components/Section';
import { FramerMotionConfig } from 'config/framer-motion-configuation';
import { ABOUT_PATH, CONTACT_DETAIL_PATH, CONTACT_PATH, ETC_ERROR_ALERT_MESSAGE, JWT_COOKIE_KEY, LIBRARY_PATH, MILESTONES_PATH } from 'constant';
import { animate, AnimatePresence, motion, useMotionValue } from 'framer-motion';
import { motion as motion3d } from 'framer-motion-3d';
import useUserInfoCheckForm, { InputCheckUserFormType } from 'hooks/user-info-check-form.hook';
import useUserInfoTextForm, { InputTextUserFormType } from 'hooks/user-info-text-form.hook';
import Footer from 'layouts/Footer';
import abilityMock from 'mocks/ability.mock';
import { ChangeEvent, KeyboardEvent, memo, useEffect, useMemo, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import useBoardStore from 'store/board.store';
import useLoginUserStore from 'store/login-user.store';
import useNavFoldingStore from 'store/nav-folding.store';
import useNotionAPICacheStore, { MilestoneInfo } from 'store/notion-api-cache-store';
import ResponseCode from 'types/enum/response-code.enum';
import UserAuthority from 'types/enum/user-authority.enum';
import './style.css';
import * as THREE from 'three';
import { ForwardRefComponent } from '@react-three/drei/helpers/ts-utils';
import { AsciiEffect } from 'three-stdlib';
import LoadingScreen from 'components/LoadingScreen';

const SECTION_COUNT = 5;

//  component 1 : 메인 Body 컴포넌트  //
export default function Main() {

  //  state //
  // 메인 body 섹션 상태
  const [section, setSection] = useState(0);
  //  애니메이션 동기화를 위한 섹션 copy값 상태 (section보다 먼저(마우스 휠 이벤트 직후) 변경됨)
  const [ copySection, setCopySection ] = useState(0);
  // nav folding 여부 상태
  const {isFolding, setFolding} = useNavFoldingStore();
  // 스크롤 요소 참조 상태
  const scrollRef = useRef(null);
  // 모바일 여부
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  //  state : 로딩 완료 여부 상태 //
  const [ started, setStarted ] = useState<boolean>(false);
  // 썸네일 이미지
  // const {yColorArray, loadYColorArray, loadThumbnailFileList } = useGalleryMosaicCacheStory();

  //  state : 노션 API 캐시 전역 상태 //
  const { workCacheList, projectCacheList, loadWorkCacheList, loadProjectCacheList, currentSelectedProjectIdx } = useNotionAPICacheStore();
  // const { currentSelectedProjectIdx } = useNotionAPICacheStore();

  // function : 네비게이트 함수 //
  const navigator = useNavigate();


  //  effect : 최초 렌더링 시 효과  //
  useEffect(() => {
    // 핸들러 함수 정의
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // 윈도우 리사이즈 이벤트 리스너 추가
    window.addEventListener('resize', handleResize);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  //  effect : 첫 렌더링 효과(노션 API 캐시 생성) //
  useEffect(() => {
    // 3d 모델 preload
    useGLTF.preload('/models-3d/ironman-super-hero-landing.glb');
    useGLTF.preload('/models-3d/Avatar.glb');
    useGLTF.preload('/models-3d/environment-working.glb');

    // 노션 api 캐시
    if (!workCacheList || workCacheList.length===0) {
      loadWorkCacheList();
    }
    if (!projectCacheList || projectCacheList.length===0) {
      loadProjectCacheList();
    }

    // 썸네일 로딩
    // loadYColorArray();
    // loadThumbnailFileList();

  }, []);
  //  effect  //
  // section 변경될 때마다 실행
  useEffect(() => {
    // 섹션 변경 시 nav 컴포넌트 folding 처리
    if (!isFolding) {
      setFolding(true);
    }
  },[copySection]);


  

//  render : 메인 Body 컴포넌트 렌더링  //
  return (
    <>
      <LoadingScreen started={started} setStarted={setStarted} />
      <Canvas className={`r3fCanvas`} shadows camera={{ position: [0, 150, 400], fov:50 }}       onCreated={({ camera }) => {camera.lookAt(0, 0, 0);}} >
        <color attach="background" args={section==3? ['#DDDDDD'] : ['#ececec']} />
        <ScrollControls pages={SECTION_COUNT}  damping={0.1} >
          {/* <ScrollManagerTest section={section} onSectionChange={setSection} scrollRef={scrollRef} sectionCount={SECTION_COUNT} setSection={setSection} /> */}
          <ScrollManager section={section} copySection={copySection} setCopySection={setCopySection} onSectionChange={setSection} scrollRef={scrollRef} sectionCount={SECTION_COUNT} />
          <Scroll html ref={scrollRef}>
            <MainSectionBox navigator={navigator}  isMobile={isMobile} />
          </Scroll>
          <Scroll>
            <Main3dMotion section={section} copySection={copySection} navigator={navigator} projectCacheList={projectCacheList} currentSelectedProjectIdx={currentSelectedProjectIdx} isMobile={isMobile} />
            {/* {copySection===2 && projectCacheList && projectCacheList.length>0 && (
              <ProjectsGallery projects={projectCacheList} currentProject={currentSelectedProjectIdx} navigator={navigator}/>
            )} */}
          </Scroll>
        </ScrollControls>
        <Environment preset={`${isMobile? 'apartment' : 'sunset'}`} />
      </Canvas>
      <ScrollGuidance totalSection={SECTION_COUNT} section={copySection} setSection={setCopySection}/>
    </>
  )
}


interface SectionsProps {
  navigator: NavigateFunction;
  isMobile:boolean;
}
//  component 1-1 : 스크롤 가능한 메인 섹션 박스 컴포넌트  //
const MainSectionBox = memo(({navigator, isMobile}:SectionsProps) => {
  
  // component 1-1-1 : 첫번째 섹션 - Home(인삿말)  //
  const HomeSection = () => {
    
    //  render : 첫번째 섹션  //
    return (
      <Section>
        <div className={`horizontal-layout-container ${isMobile? 'center-100' : 'left-70'}`}>
          <div className='main-text-container'>
            <div className='main-text-title'>
              <h1 className='text-title'>
                Mrlee&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br/>Story
              </h1>
            </div>
            <div className='main-text-content'>
              <motion.p className='text-sub-title'
                style={{borderLeft:'3px solid rgba(0, 0, 0, 0.7)', padding:'5dvh 0'}}
                initial={{ opacity: 0, y: 25, }}
                whileInView={{ opacity: 1, y: 0, }}
                transition={{ duration: 0.5, delay: 1, }}
              >
                {/* <div style={{borderLeft:'3px solid rgba(0, 0, 0, 0.7)', padding:'5dvh 0'}}> */}
                  <b>&nbsp;Like Ironman, </b>
                  <br/>&nbsp;&nbsp;&nbsp;&nbsp;이미 지나간 역경을 내일의 발전으로 만듭니다.
                  <br /><br /><br /><br />
                  
                  <b>&nbsp;Make the best, </b>
                  <br/>&nbsp;&nbsp;&nbsp;&nbsp;민감한 사용성과 가용성을 고민합니다.
                  <br /><br /><br /><br />

                  <b>&nbsp;Stopless, </b>
                  <br/>&nbsp;&nbsp;&nbsp;&nbsp;성장을 멈추지 않는 백엔드 개발자, 이민성입니다.
                {/* </div> */}
                
              </motion.p>
            </div>
          </div>

          
        </div>
      </Section>
    )
  }

  // component 1-1-2: 두번째 섹션 - About(PR, skill) //
  const AboutSection = () => {

    //  render : 두번째 섹션  //
    return (
      <Section>
        <motion.div className={`${isMobile? 'vertical-layout-container top-40' : 'horizontal-layout-container left-40'}`} whileInView={"visible"}>
          <div className='main-skill-container'>
            {
              abilityMock.map( (ability, index) => (
                <div key={`main-skill-ability-${index}`} className='main-skill-item-box'>
                  <Ability ability={ability} />
                </div>
              ))
            }
          </div>
          
        </motion.div>
        {!isMobile && (
          <div className='horizontal-layout-container center-20'></div>
        )}
        <div className={`${isMobile? 'vertical-layout-container bottom-60' : 'horizontal-layout-container right-40'}`} >
          <div className='main-about-text-container'>

            <div className='main-about-title-box'>
              <motion.h1 className='text-title'
                initial={{ opacity: 0, y: 25, }}
                whileInView={{ opacity: 1, y: 0, }}
                transition={{ duration: 0.5, delay: 0.5, }}
              >
                About
              </motion.h1>
            </div>

            <motion.div className='main-about-content-box'
              initial={{ opacity: 0, y: 25, }}
              whileInView={{ opacity: 1, y: 0, }}
              transition={{ duration: 0.5, delay: 1, }}
            >

              <div className='main-about-content-keyword-box'>
                <div className='main-about-content-keyword-focus'>
                  Backend <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 응용 S/W <br /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GIS&그래픽 처리
                </div>
                <div className='main-about-content-keyword-mask'>
                  <div className='main-about-content-keyword-mask-text'>
                    Backend <br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 응용 S/W <br /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;GIS&그래픽 처리
                  </div>
                </div>
              </div>

              <div className='main-about-content-desc'>
                <br/><b>&nbsp;"너 자신을 알라" </b>
                <br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;끊임없이 연구하여 지식을 얻습니다.
                <br/>&nbsp;&nbsp;&nbsp;&nbsp;끊임없이 경험하여 지혜를 얻습니다.
                <br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;2020년 11월 첫걸음하여, 
                <br/>&nbsp;&nbsp;&nbsp;&nbsp;항상 좋은 경험과 높은 생산성을 제공하였습니다.
                <br /><br/>
                
              </div>
            </motion.div>

            <div className='main-about-button-box'>
              <motion.a className='btn-navigate'
                initial={{ opacity: 0, y: 25, }}
                whileInView={{ opacity: 1, y: 0, }}
                transition={{ duration: 0.5, delay: 1, }}
                onClick={() => {navigator(ABOUT_PATH())}}
              >
                <span>더 자세히 보고싶으신가요?</span>
                <svg width="13px" height="10px" viewBox="0 0 13 10">
                  <path d="M1,5 L11,5"></path>
                  <polyline points="8 1 12 5 8 9"></polyline>
                </svg>
                
              </motion.a>
            </div>

          </div>
          
        </div>
      </Section>
    )
  }
  
  // component 1-1-3 : 세번째 섹션 - Portfolio(경력 및 포트폴리오) //
  const MileStonesSection = () => {

    const { projectCacheList } = useNotionAPICacheStore();

    const {currentSelectedProjectIdx, setCurrentSelectedProjectIdx} = useNotionAPICacheStore();

    const nextProject = () => {
      setCurrentSelectedProjectIdx((currentSelectedProjectIdx + 1) % projectCacheList.length);
    };
  
    const previousProject = () => {
      setCurrentSelectedProjectIdx((currentSelectedProjectIdx - 1 + projectCacheList.length) % projectCacheList.length);
    };

    // useEffect(() => {
    //   if (!projectCacheList) return;
      
    //   setCurrentSelectedProjectIdx(Math.round(projectCacheList.length/2));
    // }, [])

    //  render : 세번째 섹션  //
    return (
      <Section>
        <div className={'horizontal-layout-container center-100'}>
          <div className="main-project-container">

            <motion.div className="main-project-title-box"
              initial={{ opacity: 0, y: 25, }}
              whileInView={{ opacity: 1, y: 0, }}
              transition={{ duration: 0.5, delay: 0.5, }}
            >
              <h1 className='text-title'>
                Projects
              </h1>
            </motion.div>

            <motion.div className="main-project-content-box"
              initial={{ opacity: 0, y: 25, }}
              whileInView={{ opacity: 1, y: 0, }}
              transition={{ duration: 0.5, delay: 1, }}
            >
              <div className='main-project-content-text-box'>
                <div style={{borderLeft:'3px solid rgba(0, 0, 0, 0.7)', alignItems:'left'}}>
                  <br/><b>&nbsp; 다양한 R&D/SI 사업을 전담/기술 지원하며 높은 만족도를 제공하였습니다.</b>
                  <br/><br/>
                </div>
              </div>

              <div  className='main-project-content-button-box'>
                <motion.a className='btn-navigate'
                    initial={{ opacity: 0, y: 25, }}
                    whileInView={{ opacity: 1, y: 0, }}
                    transition={{ duration: 0.5, delay: 1, }}
                    onClick={() => navigator(MILESTONES_PATH())}
                >
                  <span>참여 프로젝트 자세히 보기</span>
                  <svg width="13px" height="10px" viewBox="0 0 13 10">
                    <path d="M1,5 L11,5"></path>
                    <polyline points="8 1 12 5 8 9"></polyline>
                  </svg>
                </motion.a>
              </div>
            </motion.div>
            
            <div className='main-project-button-box'>
              <button
                  className="main-project-button-previous"
                  onClick={previousProject}
                >
                  ← Previous
                </button>
                {/* <h2 className="text-3xl md:text-5xl font-bold">Projects</h2> */}
                <button
                  className="main-project-button-next"
                  onClick={nextProject}
                >
                  Next →
              </button>

            </div>

          </div>

        </div>
      </Section>
    )
  }

  // component 1-1-4 : 네번째 섹션 - Library(개발 페이지 전시관) //
  const LibrarySection = () => {
    
    //  render : 네번째 섹션  //
    return (
      <Section>
        <div className={isMobile? 'horizontal-layout-container center-100' : 'horizontal-layout-container right-50'} style={{position:'relative'}} >
          <div className='main-library-container'>
            <motion.div className="main-library-title-box"
                initial={{ opacity: 0, y: 25, }}
                whileInView={{ opacity: 1, y: 0, }}
                transition={{ duration: 0.5, delay: 0.5, }}
              >
              <h1 className='text-title'>
                Library
              </h1>
            </motion.div>

            <motion.div className='main-library-content-box'>
              <div className='main-library-text-box' style={{borderLeft:'3px solid rgba(0, 0, 0, 0.7)', alignItems:'left'}}>
                <b>&nbsp; 다양한 기술을 활용하여 개발한 Application들을 직접 경험해보세요</b>
                <br/><br/>

                <br/><br/><p style={{color: 'rgb(255, 255, 255)'}} className='main-library-text-info'>&nbsp; 해당 페이지는 현재 준비 중에 있습니다.<br/>&nbsp; 빠른 시일 내에 준비하여 색다른 경험을 제공하겠습니다.</p>
              </div>
              <div className='main-library-button-box' >
                <motion.a className='btn-navigate'
                      initial={{ opacity: 0, y: 25, }}
                      whileInView={{ opacity: 1, y: 0, }}
                      transition={{ duration: 0.5, delay: 1, }}
                      onClick={() => navigator(LIBRARY_PATH())}
                >
                  <span>Apllcation 목록으로 이동</span>
                  <svg width="13px" height="10px" viewBox="0 0 13 10">
                    <path d="M1,5 L11,5"></path>
                    <polyline points="8 1 12 5 8 9"></polyline>
                  </svg>
                </motion.a>
              </div>
            </motion.div>

          </div>


          
        </div>
      </Section>
    )
  }

  // component 1-1-5 : 다섯번째 섹션(Contact, Footer) //
  const ContactSection = () => {

    
    //  state : 쿠키 상태   //
    const [ cookies ] = useCookies([JWT_COOKIE_KEY]);

    //  state : 제목 영역 요소 참조 상태    //
    const titleRef = useRef<HTMLTextAreaElement | null>(null);
    //  state : 본문 영역 요소 참조 상태    //
    const contentRef = useRef<HTMLTextAreaElement | null>(null);
    //  state : 이미지 입력 요소 참조 상태    //
    const imageInputRef = useRef<HTMLInputElement | null>(null);

    //  state : 게시물 이미지 미리보기 URL 상태 //
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    //  state : 게시판 store 상태   //
    const { title, setTitle } = useBoardStore();
    const { content, setContent }  = useBoardStore();
    const { boardImageFileList, setBoardImageFileList, resetBoard } = useBoardStore();

    //  state : 로그인 상태 //
    const { loginUser, setLoginUser, resetLoginUser } = useLoginUserStore();
    //  state : 닉네임 훅 상태   //
    const {ref:nicknameRef, value:nickname, inputType:nicknameInputType, onNicknameBlurHandler, onNicknameChangeHandler, isError:isNicknameError, errorMessage:nicknameErrorMessage, resetValue:resetNickname} = useUserInfoTextForm(InputTextUserFormType.Nickname, {});
    //  state : 비밀번호 훅 상태   //
    const {ref:passwordRef, value:password, inputType:passwordInputType, switchInputType:switchPasswordInputType, onPasswordBlurHandler, onPasswordChangeHandler, isError:isPasswordError, errorMessage:passwordErrorMessage, resetValue:resetPassword} = useUserInfoTextForm(InputTextUserFormType.Password, {});
    //  state : 전화번호 훅 상태   //
    const {ref:telNumberRef, value:telNumber, inputType:telnumberInputType, onTelNumberBlurHandler, onTelNumberChangeHandler, isError:isTelNumberError, errorMessage:telNumberErrorMessage, resetValue:resetTelnumber} = useUserInfoTextForm(InputTextUserFormType.TelNumber, {});

    //  state : 개인정보 제공 동의 훅 상태    //
    const { isChecked:isAgreed, labelText:agreedLabelText, tooltipType:agreedTooltipType, tooltipMessage:agreedTooltipMessage, tooltipSvgType:agreedTooltipSvgType, onCheckChangeDefaultHandler:onAgreedChange, inputElementId:agreedInputElementId, setChecked:setAgreed } = useUserInfoCheckForm(InputCheckUserFormType.Agreed);
    //  state : 공지글 훅 상태  //
    const { isChecked:isNotice, labelText:noticeLabelText, tooltipType:noticeTooltiplType, tooltipMessage:noticeTooltipMessage, tooltipSvgType:noticeTooltipSvgType, onCheckChangeDefaultHandler:onNoticeChange, inputElementId:noticeInputElementId, setChecked:setNotice } = useUserInfoCheckForm(InputCheckUserFormType.Notice);
    //  state : 비밀글 훅 상태  //
    const { isChecked:isSecret, labelText:secretLabelText, tooltipType:secretTooltipType, tooltipMessage:secretTooltipMessage, tooltipSvgType:secretTooltipSvgType, onCheckChangeDefaultHandler:onSecretChange, inputElementId:secretInputElementId, setChecked:setSecret } = useUserInfoCheckForm(InputCheckUserFormType.Secret);
    
    useEffect(() => {
      resetForm();
    }, [])

    //  event handler : 이미지 업로드 클릭 이벤트 처리 //
    const onImageUploadButtonClickHandler = () => {
      if (!imageInputRef.current) return;
      imageInputRef.current.click();
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
    
    //  event handler : 제목 변경 이벤트 처리   //
    const onTitleChangeHandler = (event : ChangeEvent<HTMLTextAreaElement>) => {
      const { value }= event.target;
      setTitle(value);

      // if (!titleRef.current) return;

      // titleRef.current.style.height = 'auto';
      // titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    };

    //  event handler : 본문 변경 이벤트 처리   //
    const onContentChangeHandler = (event : ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = event.target;
      setContent(value);

      // if (!contentRef.current) return;
      // contentRef.current.style.height = 'auto';
      // contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
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

          const goDetailPage = window.confirm('게시물 작성이 성공적으로 완료되었습니다. \r\n 게시판 페이지로 이동하시겠습니까?');
          if (!goDetailPage) {
            resetForm();
            return;
          };

            navigator(CONTACT_PATH());
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
      const check = window.confirm('모든 작업을 취소하시겠습니까? 입력하신 모든 내용이 삭제됩니다.');

      if (!check) return;
      resetForm();
    }

    //  function : 전체 폼 초기화 //
    const resetForm = () => {
      resetBoard();
      setImageUrls([]);
      setTitle('');
      setContent('');
      setBoardImageFileList([]);
      
      resetNickname();
      resetPassword();
      resetTelnumber();
      setAgreed(false);
      setNotice(false);
      setSecret(false);
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

    //  function: 회원 게시물 업로드 response 처리 함수  //
    const postBoardResponse = (responseBody: PostBoardResponseDto | ResponseDto | null) => {
      if (!responseBody) return;

      const { code } = responseBody;
      if (code === ResponseCode.DATABASE_ERROR) alert('데이터베이스 오류입니다.');
      if (code === ResponseCode.AUTHORIZATION_FAIL || code===ResponseCode.NOT_EXISTED_USER) alert('권한 오류입니다.');
      if (code === ResponseCode.VALIDATION_FAILED) alert('필수 입력 항목을 작성해주세요.');
      if (code!==ResponseCode.SUCCESS) return;

      resetForm();
      if (!loginUser) {
          navigator(CONTACT_PATH());
          return;
      }

      const { boardNumber } = responseBody as PostBoardResponseDto;

      navigator(CONTACT_DETAIL_PATH(boardNumber));
    }

    //  render : 다섯번째 섹션  //
    
    if (isMobile) {
      return (
        <div className='horizontal-layout-container center-100'>
          <h1 className='main-mobile-text-title' style={{color:'rgba(50, 50, 50, 0.85)', paddingLeft: '10px', width:'100%', height:'15%', fontSize:'3rem', fontFamily:'감탄로드돋움체-Bold'}}>
            Contact
          </h1>
          <div className='main-contact-content-box' style={{marginLeft: '25dvw', width:'75dvw', height:'85%', marginTop:'5dvh'}}>
            <motion.div style={{width:'100%', height:'50%', textAlign:'center', alignContent:'center'}}
              initial={{ opacity: 0, y: 25, }}
              whileInView={{ opacity: 1, y: 0, }}
              transition={{ duration: 0.5, delay: 0.5, }}
            >
              <div className='main-about-content-desc' style={{borderLeft:'none', fontSize:'1.15rem'}}>
                <b>&nbsp;가장 큰 정보는 <br/> 무심코 주고 받는 대화 속에 있다</b>
                <br/><br/><br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;어떠한 말이든 감사히 경청하겠습니다
                <br/>&nbsp;&nbsp;&nbsp;&nbsp;백엔드 개발자 이민성입니다
                <br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;감사합니다
                <br /><br/>
                
              </div>
            </motion.div>
            <div style={{width:'100%', height:'20%', textAlign:'center', alignContent:'center'}}>
              <motion.a className='btn-navigate'
                initial={{ opacity: 0, y: 25, }}
                whileInView={{ opacity: 1, y: 0, }}
                transition={{ duration: 0.5, delay: 1, }}
                onClick={() => {navigator(CONTACT_PATH())}}
              >
                <span>문의사항이 있으신가요?</span>
                <svg width="13px" height="10px" viewBox="0 0 13 10">
                  <path d="M1,5 L11,5"></path>
                  <polyline points="8 1 12 5 8 9"></polyline>
                </svg>
                
              </motion.a>
            </div>
          </div>
          <Footer type='center' paddingBottomPercent={0}/>
        </div>
      )
    }
    return (
      <Section>
        <div className='horizontal-layout-container left-20'>
            <h1 className='text-title' style={{marginBottom:'70dvh', paddingLeft:'3dvw'}}>
            Contact
            </h1>
        </div>
        <div className={'horizontal-layout-container right-80'}>
          <div className='main-board-container'>
            <div className='main-board-box'>
              <div className='main-board-write-box'>

                <div className='main-board-write-title-box'>
                    <textarea ref={titleRef} className='main-board-writer-title-textarea' rows={1} placeholder='제목을 작성해주세요.' value={title} onChange={onTitleChangeHandler} />
                </div>

                <div className='divider'></div>

                <div className='main-board-write-content-box'>
                    <textarea ref={contentRef} className='main-board-write-content-textarea' placeholder='본문을 작성해주세요.' value={content} onChange={onContentChangeHandler} 
                    />
                    <div className='icon-button' onClick={onImageUploadButtonClickHandler}>
                        <div className='icon icon-image-box-light'></div>
                    </div>
                    <input ref={imageInputRef} type='file' accept='image/*' style={{ display:'none' }} onChange={onImageChangeHandler} />
                </div>

                <div className='main-board-write-images-box'>
                  <p>{`첨부 파일 개수 : ${imageUrls.length} 개`} </p>
                </div>
              </div>
            </div>

            <div className='main-board-write-control-box'>
              { loginUser?.authorizationLevel!==UserAuthority.ADMIN && loginUser?.authorizationLevel!==UserAuthority.MEMBER && (
                  <>
                      <InputTextBox 
                          ref={nicknameRef}
                          inputElementId='border-write-writer-nickname' 
                          label='닉네임'
                          type={nicknameInputType}
                          name='nickname'
                          placeHolder='3~10자 이내' 
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
                  // // 
                  // && () && 
                  // && ((!telNumber && !isTelNumberError) || (loginUser?.authorizationLevel!=UserAuthority.ADMIN && telNumber && isAgreed)) ?
                  <div className='able-button-dark' onClick={loginUser?.authorizationLevel < UserAuthority.MEMBER? onGuestUploadButtonClickHandler : onMemberUploadButtonClickHandler}>{'업로드'}</div>
                  :
                  <div className='disable-button'>{'업로드'}</div>
              }
              <div className='able-button-light' onClick={onCancleButtonClickHandler}>{'초기화'}</div>
            </div>
          </div>


        </div>
        <Footer type='center' paddingBottomPercent={0}/>
      </Section>
    )
  }

  //  render : 스크롤 가능한 메인 섹션 박스 렌더링 //
  return (
    <div className='containerCustomSections'>
      <HomeSection />
      <AboutSection />
      <MileStonesSection />
      <LibrarySection />
      <ContactSection />
    </div>
  )
});

//  interface : component 1-2 Props 타입   //
interface Main3dProps {
  section:number;
  copySection:number;

  projectCacheList:MilestoneInfo[];
  currentSelectedProjectIdx:number;

  isMobile:boolean;

  navigator:NavigateFunction; 
}

//  component 1-2 : 섹션 3D Model 및 Animation/Motion  //
const Main3dMotion = memo((props:Main3dProps) => {

  //  state //
  // section 상태
  const { section, copySection, navigator, projectCacheList, currentSelectedProjectIdx, isMobile } = props;
  // nav folding 여부 상태
  const { isFolding, setFolding } = useNavFoldingStore();
  // three 화면 영역
  const { viewport } = useThree();
  // 카메라 위치 상태
  const cameraPositionX = useMotionValue(0);
  // 카메라 시점 상태
  const cameraLookAtX = useMotionValue(0);
  // avatar 애나메이션 이름 상태
  const [ ironmanAnimation, setIronmanAnimation ] = useState<string>('IDLE');
  // background component ref
  const avatarAreaRef = useRef(null);
  // avatar component ref
  const avatarGroup = useRef(null);
  


  //  variable : 3d 화면 계산 변수  //
  // 반응형 화면 너비 비율
  const responsiveRatio = viewport.width / 12;
  // 전체 공식 스케일
  const backgroundScaleRatio = Math.max(0.5, Math.min(0.9 * responsiveRatio, 0.9));

  //  effect  //
  // nav folding 변경 시 효과
  useEffect(() => {
    animate(cameraPositionX, !isFolding ? -5 : 0, {
      ...FramerMotionConfig,
      type: 'spring'
    });
    animate(cameraLookAtX, !isFolding ? 5 : 0, {
      ...FramerMotionConfig,
      type: 'spring'
    });
  }, [isFolding]);

  // sectuin 변경 시 효과
  useEffect(() => {
    setIronmanAnimation('Armature|Armature|SUPERHEROLANDING');

  }, [section]);


  //  render : 섹션 3D Model 및 Animation/Motion 컴포넌트 렌더링  //
  return (
    <>
      {/* <Background /> */}
        {/* <div style={{backgroundImage:'url(assets/image/background-with-simple-white-wall.jpg)'}}></div> */}
      <motion3d.group
        ref={avatarGroup}
        // rotation={[-3.141592653589793, 1.2053981633974482, 3.141592653589793]}
        scale={[backgroundScaleRatio, backgroundScaleRatio, backgroundScaleRatio]}
        animate={"" + section}
        transition={{
          duration: 0.4,
        }}
        variants={{
          0: {
            y: -10,
            x: isMobile ? 0.3 : 100,
            z: 170,
            rotateX: isMobile ? 0.2 : 0,
            rotateY: isMobile ? -Math.PI / 1.5 : -Math.PI / 2.7,
            rotateZ: 0,
            scaleX: backgroundScaleRatio,
            scaleY: backgroundScaleRatio,
            scaleZ: backgroundScaleRatio,
          },
          1: {
            y: -viewport.height * 1.15,
            x: isMobile ? 0.3 : 0,
            z: 100,
            rotateX: isMobile ? 0.2 : 0,
            rotateY: isMobile ? -Math.PI / 2 : (Math.PI/180)*5,
            rotateZ: 0,
            scaleX: isMobile? 0.7 : backgroundScaleRatio,
            scaleY: isMobile? 0.7 : backgroundScaleRatio,
            scaleZ: isMobile? 0.7 : backgroundScaleRatio,
          },
          2: {
            x: viewport.width*0.35,
            y: isMobile ? -viewport.height * 2.15 : -viewport.height * 2.25,
            z: 50,
            rotateX: 0,
            rotateY: (Math.PI/180)*-90,
            rotateZ: 0.2,
            scaleX: isMobile? 0.5 : 0.7,
            scaleY: isMobile? 0.5 : 0.7,
            scaleZ: isMobile? 0.5 : 0.7,
          },
          3: {
            // y: -viewport.height * 3.25,
            // x: isMobile ? -1.4 : 220,
            // z: 8.5,
            // rotateX: 0,
            // rotateY: -Math.PI / 4,
            // rotateZ: 0,
            y: -viewport.height * 4.3,
            // x: 0.24,
            x: isMobile? 0 : viewport.width*-0.32,
            z: 8.5,
            rotateX: -0.3,
            // rotateY: -Math.PI / 4,
            rotateY: (-Math.PI/180) * -30,
            rotateZ: -0.05,
            scaleX: 1,
            scaleY: 1,
            scaleZ: 1,
          },
          4: {
            y: -viewport.height * 4.3,
            // x: 0.24,
            x: viewport.width*-0.37,// -320,
            z: 8.5,
            rotateX: -0.3,
            // rotateY: -Math.PI / 4,
            rotateY: (-Math.PI/180) * ((viewport.width/100)*-3),
            rotateZ: -0.05,
            // rotateX: -0.2,
            // // rotateY: -Math.PI / 4,
            // rotateY: (-Math.PI/180) * 10,
            // rotateZ: 0.09,
            scaleX: 0.8,
            scaleY: 0.9,
            scaleZ: 0.8,
          },
        }}
        >
        {section===0 && (
          <>
            <AvatarMrlee animation={ironmanAnimation} wireframe={section === 0} section={section} copySection={copySection} />
            <AnimatePresence>
              {/* {section === 0 && ( */}
                <motion3d.group key="workingArea" exit={{opacity:0, transition:{duration:1}}}>
                  <WorkingArea section={section} copySection={copySection} />
                </motion3d.group>
              {/* )} */}
            </AnimatePresence>
          </>
        )}
        {section===2 &&  (
          <>
          <ProjectsGallery projects={projectCacheList} currentProject={currentSelectedProjectIdx} navigator={navigator} isMobile={isMobile} />
          </>
        )}
        {section!==0 && section!=3 && (
          <>
            <Ironman animation={ironmanAnimation} wireframe={section === 1} section={section} copySection={copySection} isMobile={isMobile} />
          </>
        )}
        {section==3 && (
          <group rotation={[0, 10.5, 10]} position={[viewport.width*0.01, viewport.height*1.2, 0]} scale={2}>
              <Cloud count={8} radius={isMobile? viewport.width/4 : (viewport.width/10)} />
            </group>
        )}
        </motion3d.group>
    </>
  )
});



function Word({ children, ...props }) {
  const color = new THREE.Color()
  const fontProps = { font: '/fonts/감탄로드돋움체 Bold.ttf', fontSize: 10, letterSpacing: -0.05, lineHeight: 1, 'material-toneMapped': true}
  const ref = useRef<any>()
  const [hovered, setHovered] = useState(false)
  const over = (e) => (e.stopPropagation(), setHovered(true))
  const out = () => setHovered(false)

  // Change the mouse cursor on hover
  useEffect(() => {
    if (hovered) document.body.style.cursor = 'pointer'
    return () => {(document.body.style.cursor = 'auto')}
  }, [hovered])
  
  // Tie component to the render-loop
  useFrame(({ camera }) => {
    ref.current.rotateY(0.01);
    // Make text face the camera
    // ref.current.quaternion.copy(camera.quaternion);
    // Animate font color
    ref.current.material.color.lerp(color.set(hovered ? '#fa2720' : 'white'), 0.1)
  })
  return (
    // <Billboard>
      <Text ref={ref} onPointerOver={over} onPointerOut={out} {...props} {...fontProps} children={children} />
      // </Billboard>
  )
}

function Cloud({ count = 4, radius }) {
  // Create a count x count random words with spherical distribution
  const words = useMemo(() => {
    const temp = [];
    const spherical = new THREE.Spherical();
    const phiSpan = Math.PI / (count + 1);
    const thetaSpan = (Math.PI * 2) / count;

    for (let i = 1; i < count + 1; i++) {
      for (let j = 0; j < count; j++) {
        temp.push([new THREE.Vector3().setFromSpherical(spherical.set(radius, phiSpan * i, thetaSpan * j)), generateWord()])
      }
    }
    return temp
  }, [count, radius]);

  const ref = useRef<THREE.Group>();
  useFrame(({ camera }) => {
    // Make text face the camera
    // ref.current.quaternion.copy(camera.quaternion);
    // Animate font color
    ref.current.rotateY(-0.01);
  })
  return (
    <group ref={ref} rotation={[(Math.PI/-180)*180, (Math.PI/-180)*30, (Math.PI/-180)*-20]}>
      {
        words.map(([pos, word], index) =>(
          <Word key={`cloude-word-${index}`} position={pos} children={word} />
          )
        )
      }
    </group>
  )
}


function generateWord() {
  const wordList = [
    'Java', 'Unity', 'PostgreSQL', 'SQL', 'Oracle', 'Linux', 'C#', 'Python', 'NodeJS',
    'React', 'JavaScript', 'TypeScript', 'Figma', 'HTML', 'CSS', 'SCSS', 
    'Spring', 'SpringBoot', 'ElasticStack', 'Web', 'GIS', 'App', 'Gradle', 'Maven', 
    'JPA', 'Mybatis', 'JQuery', 'JSP', 'Thymeleaf', 'ThreeJS', 'R3F',
    'Notion', 'Git', 'SVN',
  ]
  return wordList[randInt(wordList.length)];
}
function randInt(lessThan) {
  return Math.floor(Math.random() * lessThan);
}