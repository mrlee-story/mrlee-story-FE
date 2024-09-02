import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react";


interface ScrollProps {
  section:number;
  onSectionChange:Dispatch<SetStateAction<number>>;
  copySection:number;
  setCopySection:Dispatch<SetStateAction<number>>;
  scrollRef: RefObject<HTMLDivElement>;
  sectionCount: number;
}

const DEBOUNCE_DELAY = 300; // 300ms 딜레이

export const ScrollManager = (props:ScrollProps) => {
  const { section, copySection, setCopySection, sectionCount, onSectionChange, scrollRef } = props;

  //  state : section 카피 값(다른 컴포넌트와 애니메이션 효과 딜레이 맞추기 위함)  //
  // const [ copySection, setCopySection ] = useState<number>(section);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const data = useScroll();

  const handleScroll = (event:WheelEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (section==copySection) {
      const deltaY = event.deltaY;
      if (deltaY > 0 && section < sectionCount - 1) {
        setCopySection((prev) => Math.min(prev + 1, sectionCount - 1));
        // onSectionChange((prev) => Math.min(prev + 1, sectionCount - 1));
      } else if (deltaY < 0 && section > 0) {
        setCopySection((prev) => Math.max(prev - 1, 0));
        // onSectionChange((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  data.fill.classList.add("top0Absolute");

  useEffect(() => {

    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
    }

    const handleTouchEnd = (e) => {
      
      const diffX = startX - e.changedTouches[0].clientX;
      const diffY = startY - e.changedTouches[0].clientY;
      
      // 스와이프가 주로 수직 방향일 때
      if (Math.abs(diffY) > Math.abs(diffX)) {
        
        if (diffY > 30) {
          // 아래로 스와이프
          e.preventDefault();
          setCopySection((prev) => Math.min(prev + 1, sectionCount - 1));
        } else if (diffY < -30) {
          // 위로 스와이프
          e.preventDefault();
          setCopySection((prev) => Math.max(prev - 1, 0));
        }
      }
      startX = 0;
      startY = 0;
    };
    
    window.addEventListener('wheel', handleScroll, {passive:false});
    // window.addEventListener('scroll', handleChangeY, {passive:false});

    window.addEventListener('touchstart', handleTouchStart, {passive:true});
    window.addEventListener('touchmove', handleTouchMove, {passive:false});
    window.addEventListener('touchend', handleTouchEnd, {passive:false});

    debounceTimeout.current = setTimeout(() => {
      debounceTimeout.current = null;
    }, DEBOUNCE_DELAY);

    return () => {
      window.removeEventListener('wheel', handleScroll);

      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    }
  });

  useEffect(() => {
    gsap.to(data.el, {
        // 애니메이션의 시간
        duration: 1,
        // 스크롤를 해당 위치(픽셀 단위)로 설정
        scrollTop: copySection * data.el.clientHeight,
        // 애니메이션 시작될 때의 함수
        onStart: () => {
        },  
        // 애니메이션 종료될 때의 함수
        onComplete: () => {
            onSectionChange(copySection);
        },
    });
  }, [copySection]);

  return null;
}