import React, { useContext } from 'react';
import './style.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { MAIN_PATH } from 'constant';
import useNavFoldingStore from 'store/nav-folding.store';

//  Component : Header 컴포넌트 //
export default function Header() {

//  state //
  //  Nav Folding 여부 상태  
  const { isFolding, setFolding } = useNavFoldingStore();

//  function //
  // 네비게이트
  const navigate = useNavigate();

  const {pathname} = useLocation();


//  event handler //
  // 로고 버튼 클릭 //
  const onLogoClickHandler = () => {
    if (pathname==MAIN_PATH()) {
      navigate(0);
    } else {
      navigate(MAIN_PATH());
    }
  }

  // 메뉴 버튼 클릭 //
  const onFoldingBtnClickHandler = () => {
    setFolding(!isFolding);
  }

//  render : Header 렌더링  //
  return (
    <div id='header'>
      <div className='header-container'>
        <div className='header-logo-box' onClick={onLogoClickHandler}>
          <div className='icon-box'>
            <div className='icon icon-logo-mrlee-story-horizontal'></div>
          </div>
        </div>
        <div className='header-button-box'>
          <div className='icon-box'>
              <a className="menu-trigger" href="#" onClick={onFoldingBtnClickHandler}>
                  <span className={isFolding? '' : 'active'}></span>
                  <span className={isFolding? '' : 'active'}></span>
                  <span className={isFolding? '' : 'active'}></span>
              </a>
            </div>
        </div>
      </div>
    </div>
  )
}
