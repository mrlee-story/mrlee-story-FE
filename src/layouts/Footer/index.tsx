import React from 'react';
import './style.css';

interface FooterProps {
  type: 'left' | 'center' | 'right';
  paddingBottomPercent: number;
}
export default function Footer(props:FooterProps) {
  const { type, paddingBottomPercent } = props;

  const style:React.CSSProperties = {
    justifyContent:`${type}`,
    marginBottom:`${paddingBottomPercent}%`
  }

  const copyValue = (value:string) => {
    navigator.clipboard.writeText(value).then(() => {
      alert('이메일이 복사되었습니다.\r\n(ims8984@naver.com)')
    })
  }

  const openPage = (url:string) => {
    window.open(url, '_blank');
  }

  return (
    <div id="footer" style={style}>
      <div className='footer-container'>
        <div className='footer-logo-box'>
            <img src='/images/logo-mrlee-story-horizontal.png' className='footer-logo' />
        </div>
        <div className='footer-social-box'>
          <div className='footer-social-item'>
            <img src='/images/icon-email-dark.png' className='social-image' alt='email' title='이메일 복사하기' onClick={() => copyValue('ims8984@naver.com')}/>
          </div>
          <div className='footer-social-item'>
            <img src='/images/logo-notion-dark.png' className='social-image' alt='notion' title='노션 페이지 이동(새창)' onClick={() => openPage('https://disco-lamprey-f7b.notion.site/3626c214524a4001a317bc5d80f2983e?pvs=32')}/>
          </div>
          <div className='footer-social-item'>
            <img src='/images/logo-github-dark.png' className='social-image' alt='github' title='github 이동(새창)' onClick={() => openPage('https://github.com/mrlee-story')} />
          </div>
          <div className='footer-social-item'>
            <img src='/images/logo-instagram-dark.png' className='social-image' alt='sns' title='인스타 이동(새창)' onClick={() => openPage('https://www.instagram.com/l_alstjd/')} />
          </div>
        </div>
        <div className='footer-copyright-box'>
          ⓒ 2024. LeeMinSeong. All rights reserved
        </div>
      </div>
    </div>
  )
}
