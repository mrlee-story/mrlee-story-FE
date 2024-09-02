import { ExtendedRecordMap } from 'notion-types';

import { useEffect, useRef, useState } from 'react';
import './style.css';

import LoadingIndicator from 'components/LoadingIndicator';
import ModalContent from 'components/ModalContent';
import 'katex/dist/katex.min.css'; // Math equations
import 'prismjs/themes/prism-tomorrow.css'; // Syntax highlighting for code blocks
import 'rc-dropdown/assets/index.css'; // Dropdowns
import { NotionRenderer as NotionRendererX } from 'react-notion-x';
import { Code } from 'react-notion-x/build/third-party/code';
import { Collection } from "react-notion-x/build/third-party/collection";
import { Equation } from 'react-notion-x/build/third-party/equation';
import { Modal } from "react-notion-x/build/third-party/modal";

import 'react-notion-x/src/styles.css';
import useNotionAPICacheStore from 'store/notion-api-cache-store';
import ScrollTop from 'components/ScrollTop';

// interface ProjectInfo {
//     thumbnailUrl:string;
//     projectName:string;
//     projectId:string;
// }

export default function Milestones() {
    // const [ projectDataList, setProjectDataList ] = useState<ProjectInfo[]>();
    const {isNotionDataLoading, projectCacheList, loadProjectCacheList, getPage, currentSelectedProjectIdx, setCurrentSelectedProjectIdx} = useNotionAPICacheStore();
    // const [recordMap, setRecordMap] = useState<BlockMapType>();
    const [projectRecordMap, setProjectRecordMap] = useState<ExtendedRecordMap>();
    const [workRecordMap, setWorkRecordMap] = useState<ExtendedRecordMap>();


    // const [ selectedIdx, setSelectedIDx ] = useState<number | null>(-1);
    // const [ isLoading, setLoading ] = useState<boolean>(false);

    // const [ isChangeWorkDB, setChangeWorkDB ] = useState<boolean>(true);
    const projectContentRef = useRef<HTMLDivElement>();

    const wrapperRef = useRef(null);

    const scrollUp = () => {
      if (wrapperRef.current) {
        wrapperRef.current.scrollBy({ top: -50, behavior: 'smooth' });
      }
    };
  
    const scrollDown = () => {
      if (wrapperRef.current) {
        wrapperRef.current.scrollBy({ top: 50, behavior: 'smooth' });
      }
    };
  
    const scrollLeft = () => {
      if (wrapperRef.current) {
        wrapperRef.current.scrollBy({ left: -50, behavior: 'smooth' });
      }
    };
  
    const scrollRight = () => {
      if (wrapperRef.current) {
        wrapperRef.current.scrollBy({ left: 50, behavior: 'smooth' });
      }
    };

    //  effect : 첫 렌더링 시 효과  //
    useEffect(() => {
        if (!projectCacheList || projectCacheList.length===0) {
            // setLoading(true);
            loadProjectCacheList();
            // setLoading(false);
        }

        // 선택된 프로젝트 컨텐츠 렌더링 변화 감지
        const config = { childList: true, subtree: true};

        const projectCallback = (mutationList, observer) => {
            for(let mutation of mutationList) {
                if (mutation.type === 'childList') {
                    const aTags = document.querySelectorAll('a');
                    if (!aTags || aTags.length==0) return;

                    aTags.forEach(anchor => {
                        const anchorEl = anchor as HTMLAnchorElement;
                        const href = anchorEl.getAttribute('href');
                        if (href) {
                            anchorEl.removeAttribute('href');

                            if (anchorEl.classList.contains('notion-collection-card') && anchorEl.classList.contains('notion-collection-card-size-medium')) {
                                const workDbId = href.replace('/', '');
                                // setDatabaseUrl 함수로 href를 변형하여 id 설정
                                anchorEl.setAttribute('id', `work-db-${workDbId}`);
    
                                // 클릭 이벤트 설정
                                anchorEl.onclick = () => {
                                    getPage(workDbId, setWorkRecordMap);
                                };
                            }

                        }
                    });
                }
            }
        }

        const projectObserver = new MutationObserver(projectCallback);
        projectObserver.observe(projectContentRef.current, config);

        // 선택된 주요 업무 컨텐츠 렌더링 변화 감지
        const workCallback = (mutationList, observer) => {
            for(let mutation of mutationList) {
                if (mutation.type === 'childList') {
                    const aTags = document.querySelectorAll('a');
                    if (!aTags || aTags.length==0) return;
                    aTags.forEach(anchor => {
                        const anchorEl = anchor as HTMLAnchorElement;
                        const href = anchorEl.getAttribute('href');
                        if (href) {
                            anchorEl.removeAttribute('href');
                        }
                    })
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeName === 'IMG' && node instanceof HTMLImageElement && node.classList.contains('medium-zoom-image--opened')) {
                            const imgElement = node as HTMLImageElement;
                            imgElement.style.zIndex = '50000';
                        }
                    });
                }
            }
        }
        const workObserver = new MutationObserver(workCallback);
        workObserver.observe(document.body, config);
        return () => {
            projectObserver.disconnect();
            workObserver.disconnect();
        }
    }, []);

    //  effect : 선택된 프로젝트가 변경될 시 효과   //
    useEffect(() => {
        if (currentSelectedProjectIdx == null || currentSelectedProjectIdx<0) return;
        setProjectRecordMap(null);
        if (!projectCacheList || projectCacheList.length<2 || !projectCacheList[currentSelectedProjectIdx]) return;
        
        getPage(projectCacheList[currentSelectedProjectIdx].id, setProjectRecordMap);
    }, [currentSelectedProjectIdx]);

    return (
        <>
            {isNotionDataLoading && 
                <LoadingIndicator />
            }
            {workRecordMap &&
                    <ModalContent closeModal={() => setWorkRecordMap(null)}>
                        <NotionRendererX recordMap={workRecordMap} 
                                            fullPage={true}
                                            disableHeader
                                            components={{
                                                Code,
                                                Modal,
                                                Collection,
                                                Equation
                                            }}
                            />
                    </ModalContent>
            }
            <div id='portfolio-container'>
                <div className='portfolio-fixed-nav-box'>
                    <div className='portfolio-title'>
                        <h1>Portfolio</h1> <br/>
                        <p>&nbsp;&nbsp;&nbsp;| 참여 프로젝트를 상세히 확인하세요</p>
                    </div>

                    <div className='portfolio-prev-button-box'>
                        <button className='scroll-arrow up-arrow' onClick={scrollUp}>▲</button>
                        <button className='scroll-arrow left-arrow' onClick={scrollLeft}>◀</button>
                    </div>

                    <div ref={wrapperRef} className='portfolio-nav-wrapper'>
                        {projectCacheList && projectCacheList.map((item, index) => (
                            <div key={`portfolio-nav-${index}`}className='portfolio-project-item-box'>
                                <div className={`portfolio-project-item ${currentSelectedProjectIdx==index ? 'selected' : ''}`} onClick={() => setCurrentSelectedProjectIdx(index)}>
                                    <div className='portfolio-project-item-thumbnail-box'>
                                        <img className='portfolio-project-item-thumbnail' src={item.thumbnailUrl} />
                                    </div>
                                    <div className='portfolio-project-item-name'>{item.name}</div>
                                </div>
                            </div>
                        )
                        )}
                        
                    </div>

                    <div className='portfolio-next-button-box'>
                        <button className='scroll-arrow down-arrow' onClick={scrollDown}>▼</button>
                        <button className='scroll-arrow right-arrow' onClick={scrollRight}>▶</button>
                    </div>
                </div>
                
                <div className='portfolio-content-wrapper' ref={projectContentRef}>
                    {
                        projectRecordMap && 
                        <NotionRendererX recordMap={projectRecordMap} 
                                        fullPage={true}
                                        disableHeader
                                        components={{
                                            Code,
                                            Modal,
                                            Collection,
                                            Equation
                                        }}
                        />
                    }
                </div>
                <ScrollTop />
            </div>
        </>
    )
}