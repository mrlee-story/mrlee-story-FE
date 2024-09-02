import React, { useEffect, useRef, useState } from 'react';
import './style.css';

export default function ScrollTop() {

    const [ isVisibleScrollTopButton, setVisibleScrollTopButton ] = useState<boolean>(false);

    useEffect(() => {
        // 핸들러 함수 정의
        const handleScroll = () => {
            const scrollValue = window.scrollY;
            if (scrollValue >= window.innerHeight*0.7) {
                setVisibleScrollTopButton(true);
            } else if (scrollValue<=window.innerHeight*0.7) {
                setVisibleScrollTopButton(false);
            } 
        };

        // 윈도우 리사이즈 이벤트 리스너 추가
        window.addEventListener('scroll', handleScroll);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scroll({
            top: 0,
            behavior:'smooth'
        })
    }


    return (
        <>
            {
                isVisibleScrollTopButton && (
                    <div id='scroll-top-button-container'>
                        <div className='scroll-top-icon-button' onClick={scrollToTop} title='상단으로 이동'>
                            <div className='icon icon-scroll-top'></div>
                        </div>
                    </div>
                )
            }
        </>
    )
}
