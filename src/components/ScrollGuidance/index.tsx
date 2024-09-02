import React, { useEffect, useRef } from 'react'
import './style.css';

interface ScrollGudianceProps {
  totalSection: number;
  section: number;
  setSection: React.Dispatch<React.SetStateAction<number>>;
}
export default function ScrollGuidance(props:ScrollGudianceProps) {

  const { totalSection, section, setSection } = props;

  const rootRef = useRef<HTMLDivElement>();


  //  effect : section 변경 효과 : item 변경  //
  useEffect(() => {
    const targetList = document.getElementsByClassName(`scroll-guidance-item-${section}`);
    rootRef.current.childNodes.forEach((item, idx) => {
      const divItem = item as HTMLDivElement;
      if (idx===section) {
        divItem.classList.add('selected');
      } else {
        divItem.classList.remove('selected');
      }
    })
  }, [section]);

  //  function : 스크롤 item 생성 //
  const repeatItem = (totalSection: number) => {
    let arr = [];

    for(let i = 0; i < totalSection; i++) {
      arr.push(
          <div id={`scroll-guidance-item-${i}`} key={`scroll-guidance-item-${i}`} className='scroll-guidance-item'
              // style={{
              //   flex: `1 0 calc(100% / ${totalSection} - 10px)`,
              //   maxWidth: `calc(100% / ${totalSection} - 10px)`
              // }}
              onClick={() => setSection(i)}
            >
            <span className='scroll-guidance-item-text'>{i}</span>
          </div>
      );
    }
    return arr;
  }

  return (
    <>
        <div ref={rootRef} className='scroll-guidance-container'>
        {
          repeatItem(totalSection)
        }
        </div>
    </>
  )
}
